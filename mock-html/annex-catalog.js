// Catálogo oficial — Anexos Preconteo Congreso (70 carpetas)
const ANNEX_CATALOG = [
  {
    "num": 1,
    "name": "Acta de aprobación CRT - OSD",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 2
  },
  {
    "num": 2,
    "name": "Acta de verificación de implementación CRT - OSD",
    "state": "Revisión",
    "pill": "warn",
    "evidences": 3
  },
  {
    "num": 3,
    "name": "Acta de verificación de implementación Sala de Prensa",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 4
  },
  {
    "num": 4,
    "name": "Protocolo de Recepción - Transmisión",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 5
  },
  {
    "num": 5,
    "name": "Plan de capacitación",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 1
  },
  {
    "num": 6,
    "name": "Plan de recapacitación",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 2
  },
  {
    "num": 7,
    "name": "Kit de capacitación",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 3
  },
  {
    "num": 8,
    "name": "Plano de distribución CRT - OSD",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 4
  },
  {
    "num": 9,
    "name": "Plano de distribución Salas de Prensa",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 5
  },
  {
    "num": 10,
    "name": "Planos eléctricos y de datos CRT - OSD",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 1
  },
  {
    "num": 11,
    "name": "Planos eléctricos y de datos Salas de Prensa",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 2
  },
  {
    "num": 12,
    "name": "Certificación eléctrica y de datos CRT - OSD",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 3
  },
  {
    "num": 13,
    "name": "Certificación eléctrica y de datos Sala de Prensa",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 4
  },
  {
    "num": 14,
    "name": "Plano ruta de evacuación CRT - OSD",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 5
  },
  {
    "num": 15,
    "name": "Plano ruta de evacuación Sala de Prensa",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 1
  },
  {
    "num": 16,
    "name": "Plan de emergencias",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 2
  },
  {
    "num": 17,
    "name": "Matriz de equipos CRT y Sala de Prensa",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 3
  },
  {
    "num": 18,
    "name": "Acta de visita Datacenter",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 4
  },
  {
    "num": 19,
    "name": "Certificación de seguridad CRT",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 5
  },
  {
    "num": 20,
    "name": "Registro de derechos de autor software",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 1
  },
  {
    "num": 21,
    "name": "Manuales de aplicación",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 2
  },
  {
    "num": 22,
    "name": "Certificación del Datacenter",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 3
  },
  {
    "num": 23,
    "name": "Evidencias capacitaciones funcionarios",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 4
  },
  {
    "num": 24,
    "name": "Evidencias capacitación personal RNEC",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 5
  },
  {
    "num": 25,
    "name": "Evidencias capacitación brigada de emergencias",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 1
  },
  {
    "num": 26,
    "name": "Acta de entrega de Software con datos de prueba",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 2
  },
  {
    "num": 27,
    "name": "Acta prueba de Casa Matriz",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 3
  },
  {
    "num": 28,
    "name": "Entregables prueba Casa Matriz",
    "state": "Revisión",
    "pill": "warn",
    "evidences": 4
  },
  {
    "num": 29,
    "name": "Acta prueba técnica 10 % CRT",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 5
  },
  {
    "num": 30,
    "name": "Entregables prueba técnica 10 % CRT",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 1
  },
  {
    "num": 31,
    "name": "Acta prueba de Carga y Estrés",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 2
  },
  {
    "num": 32,
    "name": "Acta prueba de comunicaciones",
    "state": "Aprobado",
    "pill": "ok",
    "evidences": 3
  },
  {
    "num": 33,
    "name": "Acta prueba técnica Robot 100%",
    "state": "Revisión",
    "pill": "warn",
    "evidences": 2
  },
  {
    "num": 34,
    "name": "Entregables prueba técnica Robot 100%",
    "state": "Revisión",
    "pill": "warn",
    "evidences": 3
  },
  {
    "num": 35,
    "name": "Relación de personal simulacro I",
    "state": "Revisión",
    "pill": "warn",
    "evidences": 4
  },
  {
    "num": 36,
    "name": "Malla de comunicación simulacro I",
    "state": "Revisión",
    "pill": "warn",
    "evidences": 1
  },
  {
    "num": 37,
    "name": "Acta Simulacro Preconteo I",
    "state": "Revisión",
    "pill": "warn",
    "evidences": 2
  },
  {
    "num": 38,
    "name": "Entregables Simulacro Preconteo I",
    "state": "Revisión",
    "pill": "warn",
    "evidences": 3
  },
  {
    "num": 39,
    "name": "Acta prueba técn. rendimiento 100% - I Simulacro",
    "state": "Revisión",
    "pill": "warn",
    "evidences": 4
  },
  {
    "num": 40,
    "name": "Entregables prueba técn. rendimiento 100% - I Simulacro",
    "state": "Revisión",
    "pill": "warn",
    "evidences": 1
  },
  {
    "num": 41,
    "name": "Acta Exposición Código Fuente y funcionalidad SW Preconteo",
    "state": "En proceso",
    "pill": "",
    "evidences": 2
  },
  {
    "num": 42,
    "name": "Acta prueba técn. Contingencia CRT",
    "state": "En proceso",
    "pill": "",
    "evidences": 0
  },
  {
    "num": 43,
    "name": "Entregables prueba técn. Contingencia CRT",
    "state": "En proceso",
    "pill": "",
    "evidences": 1
  },
  {
    "num": 44,
    "name": "Acta prueba Consolidación Nacional (Archivos Básicos Definitivos)",
    "state": "En proceso",
    "pill": "",
    "evidences": 2
  },
  {
    "num": 45,
    "name": "Entregables prueba Consolidación Nacional (Archivos Básicos Definitivos)",
    "state": "En proceso",
    "pill": "",
    "evidences": 0
  },
  {
    "num": 46,
    "name": "Acta prueba técn. Contingencia Servidores",
    "state": "En proceso",
    "pill": "",
    "evidences": 1
  },
  {
    "num": 47,
    "name": "Entregables prueba técn. Contingencia Servidores",
    "state": "En proceso",
    "pill": "",
    "evidences": 2
  },
  {
    "num": 48,
    "name": "Relación de personal simulacro II",
    "state": "En proceso",
    "pill": "",
    "evidences": 0
  },
  {
    "num": 49,
    "name": "Malla de comunicación simulacro II",
    "state": "En proceso",
    "pill": "",
    "evidences": 1
  },
  {
    "num": 50,
    "name": "Acta Simulacro Preconteo II",
    "state": "En proceso",
    "pill": "",
    "evidences": 2
  },
  {
    "num": 51,
    "name": "Entregables Simulacro Preconteo II",
    "state": "En proceso",
    "pill": "",
    "evidences": 0
  },
  {
    "num": 52,
    "name": "Acta Simulacro de Evacuación",
    "state": "En proceso",
    "pill": "",
    "evidences": 1
  },
  {
    "num": 53,
    "name": "Acta prueba técn. rendimiento 100% - II Simulacro",
    "state": "En proceso",
    "pill": "",
    "evidences": 2
  },
  {
    "num": 54,
    "name": "Entregables prueba técn. rendimiento 100% - II Simulacro",
    "state": "En proceso",
    "pill": "",
    "evidences": 0
  },
  {
    "num": 55,
    "name": "Acta de destrucción papeleria Simulacros",
    "state": "En proceso",
    "pill": "",
    "evidences": 1
  },
  {
    "num": 56,
    "name": "Acta prueba Robot 100% Archivos Definitivos",
    "state": "En proceso",
    "pill": "",
    "evidences": 2
  },
  {
    "num": 57,
    "name": "Entregables prueba Robot 100% Archivos Definitivos",
    "state": "En proceso",
    "pill": "",
    "evidences": 0
  },
  {
    "num": 58,
    "name": "Prueba sincronización archivos basicos",
    "state": "En proceso",
    "pill": "",
    "evidences": 1
  },
  {
    "num": 59,
    "name": "Acta prueba Verificación de plantillas y candidatos",
    "state": "En proceso",
    "pill": "",
    "evidences": 2
  },
  {
    "num": 60,
    "name": "Entregables Verificación de plantillas y candidatos",
    "state": "En proceso",
    "pill": "",
    "evidences": 0
  },
  {
    "num": 61,
    "name": "Acta entrega, registro y custodia del SW de Preconteo",
    "state": "Pendiente",
    "pill": "bad",
    "evidences": 0
  },
  {
    "num": 62,
    "name": "Malla de comunicación evento electoral",
    "state": "Pendiente",
    "pill": "bad",
    "evidences": 0
  },
  {
    "num": 63,
    "name": "Relación de personal evento electoral",
    "state": "Pendiente",
    "pill": "bad",
    "evidences": 0
  },
  {
    "num": 64,
    "name": "Acta prueba Sala de Prensa",
    "state": "Pendiente",
    "pill": "bad",
    "evidences": 0
  },
  {
    "num": 65,
    "name": "Acta Registro del software de Preconteo",
    "state": "Pendiente",
    "pill": "bad",
    "evidences": 0
  },
  {
    "num": 66,
    "name": "Acta día electoral",
    "state": "Pendiente",
    "pill": "bad",
    "evidences": 0
  },
  {
    "num": 67,
    "name": "Entregables día electoral",
    "state": "Pendiente",
    "pill": "bad",
    "evidences": 0
  },
  {
    "num": 68,
    "name": "Evid. monitoreo infraestructura y BD evento electoral",
    "state": "Pendiente",
    "pill": "bad",
    "evidences": 0
  },
  {
    "num": 69,
    "name": "Evid. pruebas y certificaciones de Ciberseguridad",
    "state": "Pendiente",
    "pill": "bad",
    "evidences": 0
  },
  {
    "num": 70,
    "name": "Licenciamiento de la BD transaccional y componentes del HW",
    "state": "Pendiente",
    "pill": "bad",
    "evidences": 0
  }
];
