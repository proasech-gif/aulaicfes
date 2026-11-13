# Direcciones (URL) de AULA360

## Para los usuarios
- Aplicación (la que aparece en los registros de acceso): https://aulaicfes-llevameq.vercel.app
- Otra dirección que se había mencionado antes (no confirmada, puede no estar en uso): https://aulaicfes.vercel.app
- La aplicación es de una sola página: no tiene rutas como /rector o /docente; todo se abre dentro de la misma dirección según el rol de la cuenta.

## Base de datos y servicios (Supabase, proyecto pmigzkhhqxzhspqmkbvf)
- Servicio principal: https://pmigzkhhqxzhspqmkbvf.supabase.co
- Acceso y registro de cuentas: https://pmigzkhhqxzhspqmkbvf.supabase.co/auth/v1
- Datos (API): https://pmigzkhhqxzhspqmkbvf.supabase.co/rest/v1
- Funciones de IA y auditoría:
  - https://pmigzkhhqxzhspqmkbvf.supabase.co/functions/v1/banco-ia
  - https://pmigzkhhqxzhspqmkbvf.supabase.co/functions/v1/ver-como
  - https://pmigzkhhqxzhspqmkbvf.supabase.co/functions/v1/preparar-clase
  - https://pmigzkhhqxzhspqmkbvf.supabase.co/functions/v1/taller-ia
- Archivos públicos: .../storage/v1/object/public/school-logos/ y .../storage/v1/object/public/question-images/
- Archivos privados (solo con sesión): formatos-colegio, guias, mensajes, planeador-formatos, planes-area, virtual-entregas, virtual-material, banco-icfes

## Archivos de la aplicación (dentro de la dirección principal)
/manifest.json · /sw.js · /styles.css · /aula360-ui.css · /aula360-logo-vertical.png · /aula360-logo-horizontal.png · /icon-192.png · /icon-512.png · y los módulos .js (dashboard, saberimp, icfes, informes, periodos, auditor, etc.)

## Librerías externas que usa
cdn.jsdelivr.net (pdf.js, jszip, xlsx, mammoth, chart.js, supabase-js) · meet.google.com (reuniones) · wa.me (WhatsApp)

## Configuración que debe coincidir (Supabase → Authentication → URL Configuration)
- Site URL: https://aulaicfes-llevameq.vercel.app
- Redirect URLs: https://aulaicfes-llevameq.vercel.app/** 
