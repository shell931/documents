# Lista de tareas — Recolector Anexos Preconteo (UT ILE 2026)

Lista para Jira. Referencias: `mock-html/index.html` (pantallas), `arquitectura-implementacion.md` §6 (detalle técnico de tablas).

---

## Análisis y modelo de datos (diagrama MER)

*Antes de Figma y desarrollo. Entregable principal: **diagrama MER** (entidad–relación) acordado y listo para crear la base de datos.*

1. Relevar qué debe guardar el sistema según el negocio y las pantallas del mock: catálogo de 70 anexos, eventos (simulacros, día electoral, etc.), entrega de cada anexo por evento, evidencias por departamento, usuarios y roles, revisiones, informe Cap. VIII, exportaciones ZIP/PDF y registro de auditoría.
2. Identificar las entidades principales y cómo se relacionan, por ejemplo:
  - Región y departamento (TPS / ASD, 33 territorios).
  - Anexo (catálogo 01–70) y entrega del anexo en un evento (un expediente por anexo + hito).
  - Evidencia (archivo subido con región, departamento, descripción y hash).
  - Usuario, rol y departamentos asignados al usuario.
  - Revisión (aprobar o devolver con observaciones).
  - Secciones y texto del informe; referencias «Ver Anexo XX».
  - Trabajos en segundo plano (generar ZIP, generar PDF).
3. Elaborar el **diagrama MER** (draw.io, Lucidchart, Mermaid o herramienta del equipo) con entidades, atributos clave y cardinalidades (uno a muchos, etc.).
4. Redactar un **diccionario de datos** breve: nombre de cada tabla/campo, qué significa y si es obligatorio (acompaña al MER, no sustituye el diagrama).
5. Aprobar el MER y dejarlo en el repositorio o enlace compartido (versión 1) **antes** de programar migraciones en PostgreSQL.

*Detalle de tablas sugeridas para implementación:* ver `arquitectura-implementacion.md` §6.

---

## Antes de diseñar y programar (acuerdos y base)

1. Validar con UT ILE: carpetas 01 a 70, qué anexos son por departamento vs nacionales, y cómo se arma el consolidado de cada anexo.
2. Cargar regiones TPS/ASD y los 33 departamentos (listas desplegables, sin escribir a mano).
3. Definir qué hace cada rol: cargador, revisor, administrador.
4. Montar el proyecto (aplicación, servicios, base de datos, almacenamiento de archivos) e inicio de sesión por rol.
5. **Migraciones — crear la base de datos:** implementar la primera migración en PostgreSQL según el MER aprobado (tablas de catálogo, entregas, evidencias, usuarios, revisiones, informe, trabajos de exportación y auditoría).
6. **Migraciones — aplicar en desarrollo:** ejecutar la migración en el ambiente local (Docker) y comprobar que la estructura creada coincide con el diagrama MER.
7. **Migraciones — datos iniciales (seed):** poblar regiones, departamentos, los 70 anexos (nombres desde la plantilla ZIP oficial) y eventos de prueba; verificar que la aplicación lee esas listas (ítem 2).

*Orden:* MER aprobado (sección anterior) → montar proyecto (4) → migración (5–6) → seed (7) → Figma y pantallas.

---

## Diseño de pantallas en Figma (UX / UI)

*Cada ítem es diseñar en Figma la pantalla indicada, usando el mock HTML como guía de campos y flujo. Entregable: enlace al archivo Figma + pantallas marcadas como listas para desarrollo.*

1. Lineamientos visuales del producto (colores, tipografía, botones, tablas, estados OK / alerta / pendiente) alineados a imagen institucional si UT ILE lo define.
2. Figma — Inicio de sesión y menú principal con las 5 pestañas (y qué ve cada rol).
3. Figma — **1) Anexos** (indicadores resumen, catálogo 01–70, filtro por estado, buscador, Abrir).
4. Figma — **Detalle de anexo** (ficha, tabla por departamento, lista de archivos; sin pestaña en el menú).
5. Figma — Ventanas del detalle: **Subir evidencia** (región, departamento, archivo, descripción) y **Ver evidencia** (revisor).
6. Figma — **5) Revisión** (cola y botón Revisar; decisión en detalle del anexo).
7. Figma — **3) Exportación Zip** (alcance, validaciones previas, generar y descargar).
8. Figma — **2) Redacción informe** (selector de sección, editor de texto, guardar / enviar a revisión).
9. Figma — **4) Informe PDF** (resumen, sección ↔ anexos, validación «Ver Anexo XX», índice Cap. VIII, exportar PDF).
10. Revisión y aprobación de las pantallas Figma con UT ILE (o responsable de producto) antes de pasar a desarrollo Angular.

---

## Desarrollo pantalla por pantalla (implementar según Figma + mock)

### Ingreso y menú principal

1. Pantalla de inicio de sesión y menú con las 5 pestañas; ocultar **Revisión** según rol si aplica.

---

### 1) Anexos

1. Resumen con indicadores: anexos aprobados, en revisión, en proceso, pendientes.
2. Vista de catálogo completo (01 a 70) con filtro por estado y buscador sobre la tabla; botón **Abrir** al detalle.

---

### Detalle de anexo (se abre desde Anexos o Revisión — no es pestaña)

1. Encabezado del anexo: número, nombre, estado, evento; botones para volver; **Enviar anexo a revisión**.
2. Ficha del anexo (descripción general del catálogo, nivel 1).
3. Tabla de avance por departamento (región TPS/ASD, cantidad de archivos, estado por territorio).
4. Tabla de archivos cargados (región, departamento, descripción de la evidencia, quién subió, fecha).
5. Botón **Subir archivos** y ventana modal: elegir región, departamento, archivo y descripción obligatoria (nivel 2).
6. Ver detalle de un archivo ya cargado (descripción, y aprobar evidencia si el rol es revisor).
7. Si entra desde **Revisión**: aprobar el anexo o devolverlo con observaciones (uno por uno).

---

### 5) Revisión (rol revisor / admin)

1. Cola de anexos pendientes de revisión (quién envió, fecha, evento).
2. Botón **Revisar** abre el detalle del anexo (sin bloque de decisión en esta pantalla).

---

### 4) Exportación Zip

1. Pantalla para elegir alcance (todo el proyecto o un evento) y botón **Generar ZIP**.
2. Lista de validaciones previas antes de exportar (estructura 01–70, anexos aprobados, advertencias si algo sigue en proceso).
3. Mostrar avance de la generación y permitir descargar el ZIP final (misma estructura que la plantilla *Anexos Preconteo Congreso*).

---

### 3) Redacción informe

1. Selector de sección del Capítulo VIII y editor de texto narrativo por sección (nivel 3).
2. Guardar borrador y enviar sección a revisión.
3. En el texto, permitir citas del tipo «Ver Anexo XX» (guardadas para validar después).

---

### 4) Informe PDF

1. Resumen de cómo va el armado del informe: versión, estado borrador.
2. Tabla sección ↔ anexos vinculados y estado de evidencias.
3. Validación de referencias «Ver Anexo XX» (OK o alerta si falta evidencia).
4. Índice del Capítulo VIII con estado por apartado (listo, en curso, pendiente).
5. Botón para exportar el PDF del informe Capítulo VIII.
6. Enlace a la pestaña de redacción para editar el texto de una sección.

---

## Por detrás de las pantallas (mismo sprint o inmediatamente después)

1. Guardar y consultar datos de anexos, entregas, evidencias y cambios de estado en base de datos.
2. Generar el ZIP y el archivo de trazabilidad (hashes, quién exportó, cuándo) al usar la pantalla de exportación.
3. Generar el PDF del informe al usar la pantalla Informe PDF (cuando el texto y las referencias estén listos).

---

## Pruebas y cierre

1. Recorrido completo con los tres roles: cargar en detalle → enviar a revisión → aprobar en revisión → exportar ZIP.
2. Recorrido informe: redactar sección → validar «Ver Anexo XX» → exportar PDF.

---

