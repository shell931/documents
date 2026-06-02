# Plan de desarrollo — tareas iniciales

Recolector de Anexos Preconteo (RNEC / UT ILE 2026). Lista priorizada para pasar de análisis y mock HTML a ejecución real.

**Relacionado con:** `analisis-recolector-anexos-preconteo.md`, `mock-html/index.html`, `**arquitectura-implementacion.md`** (Angular + NestJS, gateway, processing MS).

**Stack de implementación:** front **Angular**, back **NestJS** (`api-gateway` + `processing`), **PostgreSQL**, **Redis/BullMQ**, **MinIO/S3**.

---

## Tareas iniciales (priorizadas)

### 1. Cerrar reglas de negocio obligatorias

- Confirmar estructura oficial de entrega (`01..70`), nombres exactos y reglas internas de nombrado.
- Definir qué anexos son departamentales vs centrales (Casa Matriz, Data Center, consulados).
- Validar criterio de consolidado: por carpeta, por documento merge o ambos.

### 2. Precargar y normalizar catálogo territorial (seed)

Cargar en BD las tablas maestras con la lista **oficial** acordada (no la inventa el usuario al subir archivos):

- Tabla `regions`: TPS, ASD (y códigos fijos).
- Tabla `departments`: 33 filas (32 departamentos + Bogotá D.C.), cada una con `region_id` correcto.
- **Normalizar** nombres y códigos (ej. siempre `ANTIOQUIA` en mayúsculas sin tildes en código interno; nombre visible puede llevar tilde).
- En la app: selects que leen de esas tablas; el operador **elige**, no escribe el departamento a mano.

Opcional en el mismo paso: definir cómo registrar cargas **sin departamento** (Casa Matriz, consulados) — sede/ámbito `NACIONAL` o `departamento_id` nullable.

**Referencia acordada (seed):**


| Región     | Contratista | Departamentos                                                                                                                                                                              |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Región TPS | TPS         | Bogotá D.C., Cundinamarca, Valle, Boyacá, Caquetá, Cauca, Guainía, Guaviare, Meta, Putumayo, Quindío, Risaralda, San Andrés, Caldas, Amazonas, Arauca, Chocó, Tolima, Vaupés, Vichada (20) |
| Región ASD | ASD         | Antioquia, Atlántico, Bolívar, Santander, Casanare, La Guajira, Norte de Santander, Nariño, Magdalena, Cesar, Sucre, Córdoba, Huila (13)                                                   |


### 3. Definir roles y permisos

- Matriz de permisos para `cargador`, `revisor`, `admin`.
- Reglas: quién puede subir, enviar a revisión, aprobar, devolver, exportar, editar catálogo.

### 4. Diseñar modelo de datos v1 e implementar en PostgreSQL

**4a — Modelo lógico**

- Entidades mínimas: `anexo`, `entrega`, `evidencia`, `usuario`, `usuario_departamento`, `region`, `departamento`, `revision`, `async_job`.
- Campos obligatorios de evidencia: `region`, `departamento`, `evento`, `descripcion`, `hash`, `autor`, `fecha`.
- Decisión: una `entrega` por `anexo + evento`; evidencias departamentales como filas hijas (ver `arquitectura-implementacion.md` ADR-06).

**4b — Implementación**

- Prisma (o TypeORM) + migración `001_init` + seeds (70 anexos, 33 deptos, 2 regiones).
- Tabla `async_jobs` para export/consolidado/PDF.
- OpenAPI desde gateway para generar cliente Angular.

### 5. Especificar flujo de estados 

- Flujo por anexo: `borrador → en revisión → aprobado → consolidado`.
- Reglas de transición y validaciones previas por estado.

### 6. Definir criterios de validación de carga

- Región y departamento obligatorios y consistentes (departamento ∈ región; permisos del usuario).
- Archivo + descripción obligatoria (nivel 2).
- Checklist mínimo por tipo de anexo para permitir envío a revisión.

### 7. Plan de UX mínimo (MVP)

- Pantallas base: Anexos (con resumen e indicadores), Detalle (sin pestaña), Revisión, Exportación, Redacción informe, Informe PDF.
- Confirmar qué va en cada vista para no mezclar responsabilidades (ver mock actual).

### 8. Diseñar salida contractual

- Especificar `export_paquete`: construcción ZIP idéntico a plantilla `Anexos_Preconteo_Congreso/01. … / 70. …`.
- Definir `manifest.json` (hashes, versiones, actor, timestamp).
- Regla de inclusión: solo aprobados vs todos (configurable por admin).

### 9. Diseñar módulo de Informe PDF (alcance MVP)

- Estructura de secciones del Cap. VIII (índice del PDF de referencia).
- Referencias «Ver Anexo XX» y validador de referencias huérfanas.
- Criterios de «sección lista para exportar».

### 10. Arquitectura técnica y setup (implementación)

Ver checklist detallado en `arquitectura-implementacion.md` §10.

- Monorepo: `apps/web` (Angular), `apps/api-gateway`, `apps/processing`, `libs/shared`, `libs/persistence`.
- Docker Compose: PostgreSQL, Redis, MinIO.
- Gateway: auth JWT, guards por rol y departamento.
- Processing: BullMQ + primer processor `export.package`.
- Angular: rutas alineadas al mock; interceptor JWT; servicios por feature.

### 11. Plan de pruebas inicial

- Casos críticos: permisos, subida por región/depto, revisión, consolidado, export ZIP.
- Pruebas de regresión para estructura `01..70` y referencias en PDF.

### 12. Plan de implementación por fases


| Fase       | Alcance                                                 |
| ---------- | ------------------------------------------------------- |
| **Fase 1** | Catálogo + carga + revisión + export ZIP básico         |
| **Fase 2** | Consolidado por anexo + validaciones avanzadas          |
| **Fase 3** | Informe PDF + endurecimiento de auditoría + performance |


---

## Primer sprint sugerido (1–2 semanas)

**Infra**

- Monorepo + Docker Compose (Postgres, Redis, MinIO).
- Prisma schema v1 + seed catálogo y territorio.

**API Gateway**

- Auth JWT + roles.
- Endpoints catálogo / entregas / evidencias (upload metadata + presigned URL).
- Revisión: listar, aprobar, devolver.
- `POST /exports` encola job.

**Processing MS**

- Worker `export.package` (ZIP mínimo 3–5 anexos + `manifest.json`).

**Angular**

- Shell + login + listado anexos + detalle con modal subida (región/depto).
- Pantalla exportación con polling de estado del job.

---

## Entregables finales del proyecto (recordatorio)

1. **ZIP** `Anexos_Preconteo_Congreso_*.zip` — carpetas 01–70.
2. **PDF** Informe Cap. VIII — Preconteo y Comunicaciones.
3. **Manifiesto** de trazabilidad (hashes, versiones) — recomendado.

---

## Preguntas abiertas antes de codificar


| #   | Tema                                                            |
| --- | --------------------------------------------------------------- |
| Q9  | Rol exacto de la carpeta en disco vs canal RNEC                 |
| Q3  | Medio de firma de actas (si aplica integración)                 |
| —   | Nomenclatura de archivos dentro de cada carpeta `NN.`           |
| —   | Formato físico del consolidado por anexo (carpeta vs PDF único) |


Ver detalle en `analisis-recolector-anexos-preconteo.md` §4 y §1.5.