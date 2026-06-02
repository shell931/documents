# Arquitectura de implementación — Angular + NestJS

Stack acordado para el recolector de anexos preconteo. Enfoque **implementable desde el sprint 1**, con frontera clara entre API operativa (CRUD, auth, cargas) y **procesamiento pesado** (export ZIP, consolidados, PDF).

**Relacionado con:** `analisis-recolector-anexos-preconteo.md` §3.2–3.3, `plan-desarrollo-tareas-iniciales.md`, `mock-html/index.html`.

---

## 1. Vista general

```text
┌─────────────────┐     HTTPS/REST      ┌──────────────────────┐
│  Angular (SPA)  │ ──────────────────► │  API Gateway (NestJS) │
│  apps/web       │                     │  apps/api-gateway      │
└─────────────────┘                     └──────────┬───────────┘
                                                   │
                     ┌─────────────────────────────┼─────────────────────────────┐
                     │ sync (CRUD, auth, uploads)  │ async (jobs)                │
                     ▼                             ▼                             │
              ┌──────────────┐              ┌──────────────┐                      │
              │  PostgreSQL  │              Redis / Bull   │                      │
              │  (datos)     │              (cola jobs)    │                      │
              └──────────────┘              └──────┬───────┘                      │
                     ▲                             │                             │
                     │                             ▼                             │
                     │              ┌──────────────────────────┐                │
                     │              │ Processing service (NestJS) │                │
                     │              │ apps/processing             │                │
                     │              │ ZIP, consolidado, PDF       │                │
                     │              └──────────┬───────────────┘                │
                     │                         │                                 │
                     └─────────────────────────┼─────────────────────────────────┘
                                               ▼
                                        ┌──────────────┐
                                        │ S3 / MinIO   │
                                        │ (archivos)   │
                                        └──────────────┘
```

| Componente | Responsabilidad |
| --- | --- |
| **Angular** | UI: anexos (listado + KPIs), detalle, revisión, exportación (disparo), redacción, informe PDF (resumen). Solo habla con el gateway. |
| **API Gateway** | Auth, permisos por rol/región/depto, catálogos, entregas, evidencias, revisión, informe (texto), encolar trabajos, consultar estado de jobs. |
| **Processing MS** | Tareas CPU/IO: armar ZIP `01..70`, consolidado por anexo, generar PDF Cap. VIII, validaciones masivas «Ver Anexo XX». |
| **PostgreSQL** | Fuente de verdad transaccional. |
| **Cola (Redis + BullMQ)** | Desacoplar peticiones HTTP de trabajos largos. |
| **Object storage** | Binarios; en BD solo metadata + hash. |

---

## 2. ¿Gateway + microservicio desde el día 1?

**Recomendación:** sí, pero **acotado** — dos aplicaciones Nest en el mismo monorepo, no diez microservicios.

| Enfoque | Cuándo usarlo |
| --- | --- |
| **Monolito Nest único** | Solo si el equipo es muy pequeño y no habrá exportaciones pesadas en meses. |
| **Gateway + Processing (recomendado)** | Export ZIP, consolidados y PDF pueden tardar minutos; conviene cola + worker desde MVP. |
| **Kong/Traefik + muchos MS** | Overkill para esta fase; reservar si más adelante hay integraciones RNEC externas. |

El «gateway» aquí es un **BFF/API Nest** (no obligatorio Kong en v1): expone la API que consume Angular y orquesta; el MS **no** debe ser llamado directamente por el front.

---

## 3. Repositorio sugerido (Nx o npm workspaces)

```text
report-collector/
├── apps/
│   ├── web/                 # Angular 19+
│   ├── api-gateway/         # NestJS — puerto 3000
│   └── processing/          # NestJS — worker + health HTTP opcional
├── libs/
│   ├── shared/              # DTOs, enums, constantes (Region TPS/ASD, estados)
│   ├── domain/              # reglas puras (validar depto ∈ región, transiciones estado)
│   └── persistence/         # Prisma o TypeORM — usado por gateway; processing lee/escribe jobs
├── docker/
│   ├── docker-compose.yml   # postgres, redis, minio, api, processing
│   └── ...
└── docs/
```

**Alternativa válida:** un solo `package.json` con proyectos Nest separados por `nest-cli.json` (monorepo Nest oficial).

---

## 4. API Gateway — módulos Nest (MVP)

| Módulo | Endpoints / responsabilidad |
| --- | --- |
| `AuthModule` | Login, JWT, refresh, perfil, departamentos asignados al usuario |
| `CatalogModule` | 70 anexos, regiones, departamentos, checklist por anexo (admin) |
| `DeliveryModule` | Entregas por anexo + evento; estado; enviar a revisión |
| `EvidenceModule` | Upload (presigned URL a MinIO o multipart), metadata región/depto/descripción |
| `ReviewModule` | Cola revisión (filtro por región revisor), aprobar / devolver |
| `ReportModule` | Secciones Cap. VIII, bloques narrativos, borrador |
| `ExportModule` | `POST /exports` → encola job; `GET /exports/:id` estado |
| `AuditModule` | Consulta audit log (admin) |
| `JobsModule` | Estado unificado de trabajos async (polling o SSE opcional) |

**Reglas en gateway (no en processing):**

- Validar JWT y rol (`cargador` | `revisor` | `admin`).
- Validar `departamento ∈ región` y `usuario` autorizado para ese departamento.
- Validar transiciones de estado antes de encolar consolidado/export.

---

## 5. Processing service — workers (MVP)

| Job | Trigger | Salida |
| --- | --- | --- |
| `export.package` | Usuario/admin en pestaña Exportación | ZIP `Anexos_Preconteo_Congreso_*.zip` + `manifest.json`; **por cada anexo aprobado, arma la carpeta `NN.`** (consolidación interna) |
| `report.pdf.generate` | Exportar PDF Cap. VIII | PDF informe + validación referencias |
| `report.validate-references` | On-demand o pre-export PDF | Lista «Ver Anexo XX» OK / alerta |

Implementación Nest:

- `@nestjs/bullmq` + processors en `apps/processing`.
- Idempotencia por `jobId` / `exportId`.
- Actualizar tabla `async_jobs` (`pending | running | completed | failed`, progreso %, error, uri resultado).

**Fase 1 mínima del MS:** solo `export.package` con 3–5 anexos de prueba; el resto en Fase 2–3.

---

## 6. Modelo de datos v1 → implementación (PostgreSQL)

El diseño lógico (tarea 4 del plan) se materializa así:

### Tablas núcleo (gateway escribe; processing lee muchas)

```sql
-- Catálogo (seed)
regions (id, code TPS|ASD, name)
departments (id, region_id, name)          -- 33 filas
annexes (id, number 1-70, name, family, catalog_description, ...)
events (id, code, name, event_date)

-- Operación
users, user_departments (user_id, department_id)
deliveries (
  id, annex_id, event_id,
  status,                          -- borrador | en_revision | aprobado
)
evidences (
  id, delivery_id,
  region_id, department_id,        -- obligatorio en cargas territoriales
  storage_key, original_name, sha256, mime, size,
  description, uploaded_by, uploaded_at
)
reviews (id, delivery_id, reviewer_id, decision, notes, created_at)

-- Informe Cap. VIII
report_sections, narrative_blocks, annex_references

-- Async
async_jobs (id, type, payload jsonb, status, progress, result_uri, error, created_by, ...)

audit_log (append-only, ...)
```

**Decisión v1 recomendada:** una fila `deliveries` por **`annex_id + event_id`**; evidencias departamentales en `evidences`. Al exportar, `export.package` arma la carpeta del anexo en el ZIP (consolidación en el job, sin estado `consolidado` en UI).

### Librería de persistencia

- **Prisma** (recomendado con Nest: migraciones claras, tipos para Angular vía OpenAPI).
- Generar **OpenAPI** desde gateway (`@nestjs/swagger`) → cliente Angular (`ng-openapi` o similar).

---

## 7. Angular — mapa a módulos

| Ruta / feature | Mock actual | Servicios |
| --- | --- | --- |
| `/anexos` | 1) Anexos (KPIs + catálogo) | `CatalogService`, `DeliveryService`, filtros región/depto |
| `/anexos/:id` | Detalle (Abrir) | `EvidenceService`, upload con región/depto |
| `/revision` | 5) Revisión | `ReviewService` |
| `/exportacion` | 3) Exportación | `ExportService` → job polling |
| `/informe` | 4) Informe PDF | `ReportService` |
| `/redaccion` | 2) Redacción | `ReportService` (secciones) |

**Estado:** NgRx o signals + servicios; para MVP basta **servicios + interceptors** (JWT).

**UI:** reutilizar flujo del `mock-html`; Angular Material o PrimeNG según preferencia del equipo.

---

## 8. Comunicación gateway ↔ processing

### Opción A (recomendada MVP): cola Redis

```text
Gateway: ExportService.create() → INSERT async_jobs → BullMQ.add('export.package', { jobId })
Processing: Processor → lee evidencias aprobadas → escribe ZIP en MinIO → UPDATE async_jobs
Angular: poll GET /exports/:id cada N segundos
```

Ventajas: simple, mismo stack Nest, reintentos, no HTTP síncrono largo.

### Opción B: HTTP interno

Gateway `POST http://processing:3001/internal/exports` con API key.

Útil si no quieren Redis al inicio; peor para trabajos de varios minutos (timeouts).

### Contrato compartido

Paquete `libs/shared`:

```typescript
// jobs/export-package.job.ts
export interface ExportPackagePayload {
  jobId: string;
  eventId: string;
  includeOnlyApproved: boolean;
  requestedBy: string;
}
```

---

## 9. Seguridad y despliegue

| Tema | Implementación |
| --- | --- |
| Auth | JWT (access + refresh); roles en claims o consulta BD |
| Autorización | Guards Nest: `RolesGuard`, `DepartmentScopeGuard` |
| Storage | Presigned PUT a MinIO; gateway nunca proxy archivos grandes |
| Red | Processing sin exposición pública; solo red interna / compose |
| Secretos | `.env` por app; en prod vault o variables del orquestador |

**Docker Compose local:** `postgres`, `redis`, `minio`, `api-gateway`, `processing`, `web` (nginx o `ng serve` fuera).

---

## 10. Fases de implementación (técnico)

### Fase 0 — Bootstrap (3–5 días)

- [ ] Monorepo: `web`, `api-gateway`, `processing`, `libs/shared`, `libs/persistence`
- [ ] Docker Compose: Postgres, Redis, MinIO
- [ ] Prisma schema v1 + seed (70 anexos, 33 deptos, 2 regiones)
- [ ] Auth mínimo (login mock o LDAP después)
- [ ] Angular shell con rutas alineadas al mock

### Fase 1 — Operación core (2–3 semanas)

- [ ] CRUD catálogo + listado anexos con filtros
- [ ] Upload evidencia (región, depto, descripción)
- [ ] Detalle anexo + checklist + enviar a revisión
- [ ] Cola revisión + aprobar/devolver
- [ ] Processing: job `export.package` básico
- [ ] Pantalla exportación con estado del job

### Fase 2 — Reglas de armado por anexo en export

- [ ] Reglas por familia de anexo (copia, subcarpetas, merge PDF) dentro de `export.package`
- [ ] Dashboard por región/departamento

### Fase 3 — Informe PDF

- [ ] Módulo redacción + informe (gateway)
- [ ] Jobs `report.validate-references` y `report.pdf.generate`

---

## 11. Decisiones explícitas (ADR cortas)

| ID | Decisión | Motivo |
| --- | --- | --- |
| ADR-01 | Angular + NestJS | Alineado con equipo y mock |
| ADR-02 | Gateway + Processing separados | Export/consolidado/PDF no bloquean API |
| ADR-03 | Redis + BullMQ | Patrón estándar Nest; evita HTTP largo |
| ADR-04 | Prisma + PostgreSQL | Migraciones y tipos |
| ADR-05 | MinIO/S3 para binarios | Escala y coherente con análisis §3.2 |
| ADR-06 | Una `delivery` por anexo+evento; evidencias por depto | Un solo anexo en catálogo, muchas aportaciones territoriales |
| ADR-07 | Front solo habla con gateway | Seguridad y contrato único OpenAPI |

---

## 12. Qué no hacer aún

- Microservicio por cada familia de anexo (A–F).
- Kubernetes obligatorio en MVP (Compose basta en dev).
- GraphQL si REST + OpenAPI cubre el front.
- Duplicar lógica de negocio en processing (solo orquestación de archivos y lectura BD).

---

## 13. Próximos pasos concretos

1. Validar ADR-06 (`delivery` por anexo+evento vs por departamento) con operación UT ILE.
2. Crear monorepo y `docker-compose.yml`.
3. Prisma: migración `001_init` con tablas §6.
4. Gateway: `Auth` + `Catalog` + `Evidence` (upload).
5. Processing: processor `export.package` vacío que marca job `completed` (smoke test).
6. Angular: login + listado anexos contra API real.
