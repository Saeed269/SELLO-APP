
## 1. Idea de proyecto

SELLO es una aplicación móvil que digitaliza las tarjetas de sellos físicas que utilizan los negocios para fidelizar a sus clientes. Sustituye las tarjetas de papel por una tarjeta digital siempre disponible en el móvil del cliente, actualizada en tiempo real y personalizada con la imagen de cada negocio

### ¿Qué problema resuelve?

Las tarjetas de sellos físicas son una herramienta de fidelización que muchos negocios ya utilizan hoy en día. Sin embargo, presentan tres problemas principales:

  1.Se pierden: Las tarjetas de papel se pierden, se estropean o se olvidan en casa. El cliente pierde sus sellos acumulados y el negocio pierde al cliente
  2.Sin datos: El negocio no dispone de información sobre sus clientes. No sabe cuándo vienen, cuándo dejan de venir ni cómo comunicarse con ellos
  3.Competencia cara:Las soluciones digitales existentes (WinStamp, Stamp Me, Magic Stamp, VeeCard) son demasiado caras para negocios pequeños o requieren hardware físico adicional

### ¿A quién va dirigido?

Hay dos tipos de usuarios:

       1.El negocio: cualquier establecimiento con clientes habituales que quiera fidelizarlos. Peluquerías, barberías, cafeterías, panaderías, lavanderías, car wash, clínicas de estética, gimnasios, farmacias, tintorerías, peluquerías de mascotas, entrenadores personales, etc...

       2.El cliente: cualquier persona que visite esos negocios y quiera acumular sellos para conseguir premios. El uso de SELLO es completamente gratuito para el cliente final

### ¿Cuál es su propósito principal?

Ofrecer una solución de fidelización digital simple, barata y accesible para cualquier tipo de negocio, grande o pequeño, eliminando la necesidad de tarjetas de papel sin complicaciones técnicas ni costes elevados

## 2. Requisitos funcionales

### Requisitos del negocio

#### Registro y configuración

- El negocio debe poder registrarse con email y contraseña.
- El sistema debe mostrar una guía paso a paso al abrir la app por primera vez.
- El negocio debe poder indicar su tipo (peluquería, cafetería, entrenador personal, etc.).
- El negocio debe poder subir su logo y foto de portada (opcional; si no sube nada, se muestra el nombre del negocio).
- El sistema debe detectar automáticamente los colores del logo y personalizar el diseño de la tarjeta del cliente.
- El negocio debe poder editar los colores manualmente si no le convence la detección automática.
- El negocio debe poder elegir cuántos sellos necesita el cliente para ganar el premio.
- El sistema debe sugerir automáticamente el número de sellos recomendado según el tipo de negocio.
- El negocio debe poder escribir cuál es el premio (con sugerencias automáticas editables).
- El negocio debe poder elegir la caducidad de los sellos entre 6, 12, 18 o 24 meses (mínimo 6, por defecto 12).
- El sistema debe generar automáticamente un QR único para el negocio al finalizar el registro.

#### Gestión de sellos

- El negocio debe poder escanear el QR personal del cliente para añadir un sello
- El sistema debe mostrar el nombre del cliente y un botón de confirmación antes de añadir el sello
- El sello debe aparecer en la tarjeta del cliente en tiempo real con la fecha del día
- El negocio debe poder escanear el QR de canje del cliente para confirmar el premio
- El sistema debe reiniciar el contador de sellos automáticamente tras el canje

#### Gestión de clientes y estadísticas

- El negocio debe poder ver la lista de todos sus clientes registrados
- El sistema debe mostrar los sellos acumulados y la última visita de cada cliente
- El sistema debe identificar y mostrar los clientes que llevan tiempo sin venir
- El sistema debe identificar y mostrar los clientes más fieles
- El sistema debe mostrar la frecuencia media de visitas por cliente
- El sistema debe mostrar los periodos con menor actividad (meses, estaciones)

#### Caducidad

- El negocio debe poder cambiar la caducidad de los sellos en cualquier momento
- Si el negocio aplica el cambio a clientes actuales, el sistema solo lo debe permitir si la nueva fecha es mayor que la anterior (nunca puede perjudicar al cliente)
- Si el negocio reduce la caducidad, el cambio solo debe aplicarse a nuevos clientes

#### Roles de usuario

- El negocio debe poder tener usuarios con rol de **Administrador** (acceso total) y rol de **Empleado** (solo puede escanear QR y añadir sellos).
- El administrador debe poder invitar a empleados desde su panel

#### Planes y suscripción

- El sistema debe ofrecer un **Plan Gratuito** (hasta 30 clientes, 1 sucursal, hasta 3 usuarios, sin IA)
- El sistema debe ofrecer un **Plan Básico** a 1,99€/mes o 20,99€/año (clientes ilimitados, 1 sucursal, hasta 3 usuarios, IA incluida)
- El sistema debe ofrecer un **Plan Medium** a 4,99€/mes o 49,99€/año (hasta 3 sucursales, hasta 6 usuarios)
- El sistema debe ofrecer un **Plan Pro** a 9,99€/mes o 99,99€/año (sucursales y usuarios ilimitados)
- El negocio debe poder cancelar la suscripción y seguir con acceso hasta que expire el periodo pagado
- Al darse de baja, el sistema debe enviar una notificación a todos los clientes registrados del negocio

#### QR del negocio

- El negocio debe poder mostrar su QR desde la pantalla de su móvil o imprimirlo si lo prefiere.

### Requisitos del cliente

#### Registro e instalación

- El cliente debe poder escanear el QR del negocio con su móvil
- El sistema debe abrir una página web donde el cliente se registra con nombre, email y contraseña
- El sistema debe ofrecer al cliente añadir la aplicación a su pantalla de inicio (PWA) sin pasar por el App Store ni Google Play
- El cliente debe poder hacer login desde cualquier dispositivo con su email y contraseña y recuperar todas sus tarjetas

#### Tarjeta digital

- El cliente debe poder ver todas sus tarjetas de distintos negocios en una sola pantalla
- Cada tarjeta debe tener dos caras que el cliente puede girar tocando la pantalla:
       Cara delantera:logo y nombre del negocio, sellos acumulados con la fecha de cada uno debajo
       Cara trasera:QR personal del cliente para ese negocio y su nombre
- Cuando el cliente completa los sellos, debe aparecer un botón "Canjear premio"
- Al pulsar el botón de canje, debe aparecer un QR especial que el negocio escanea para confirmar
- Tras el canje, la tarjeta debe reiniciarse automáticamente y mostrarse actualizada en tiempo real


### Requisitos de notificaciones

- El cliente debe recibir una notificación cada vez que le añaden un sello
- El cliente debe recibir una notificación cuando tiene el premio disponible
- El cliente debe recibir una notificación si el negocio se da de baja
- El negocio debe recibir una alerta cuando un cliente habitual lleva tiempo sin venir
- El negocio debe recibir un resumen periódico de la actividad de sus clientes


### Requisitos de idioma

- La aplicación debe estar disponible en: **español, inglés, urdu, chino y ruso**.


## 3. Mockup gráfico

> Los siguientes mockups representan las pantallas principales de la aplicación. Han sido elaborados para ilustrar el flujo de usuario tanto del negocio como del cliente

### Flujo del cliente

#### Pantalla principal — Lista de tarjetas

```
┌─────────────────────────┐
│  SELLO          👤      │
├─────────────────────────┤
│                         │
│  ┌─────────────────┐    │
│  │ 🏪 Peluquería   │    │
│  │    Carlos       │    │
│  │  ● ● ● ● ●     │    │
│  │  ● ● ○ ○ ○     │    │
│  │    7 / 10       │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ ☕ Cafetería    │    │
│  │    La Plaza     │    │
│  │  ● ● ● ○ ○     │    │
│  │    3 / 5        │    │
│  └─────────────────┘    │
│                         │
│  + Añadir nueva tarjeta │
└─────────────────────────┘
```


#### Tarjeta — Cara delantera (sellos)

```
┌─────────────────────────┐
│  [LOGO]  Peluquería     │
│          Carlos         │
├─────────────────────────┤
│                         │
│   ✂️      ✂️      ✂️    │
│  12/01   19/01   02/02  │
│                         │
│   ✂️      ✂️      ✂️    │
│  15/02   01/03   10/03  │
│                         │
│   ✂️      ○       ○     │
│  14/03    ---     ---   │
│                         │
│  ████████████░░░░░░  7/10│
│                         │
│  [ Girar tarjeta → ]    │
└─────────────────────────┘
```


#### Tarjeta — Cara trasera (QR personal)

```
┌─────────────────────────┐
│  [LOGO]  Peluquería     │
│          Carlos         │
├─────────────────────────┤
│                         │
│     ┌─────────────┐     │
│     │ ▄▄▄  ▄ ▄▄▄ │     │
│     │ █  █ ▄ █  █ │     │
│     │ ▀▀▀  ▄ ▀▀▀ │     │
│     │ ▄▄ ▄▄▄▄▄ ▄▄│     │
│     │ ▄▄▄  ▄ ▄▄▄ │     │
│     │ █  █   █  █ │     │
│     │ ▀▀▀  ▄ ▀▀▀ │     │
│     └─────────────┘     │
│                         │
│      Carlos García      │
│   ID: A3F9K2            │
│                         │
│  [ ← Girar tarjeta ]    │
└─────────────────────────┘
```

#### Tarjeta — Premio disponible

```
┌─────────────────────────┐
│  [LOGO]  Peluquería     │
│          Carlos         │
├─────────────────────────┤
│                         │
│  🎉 ¡PREMIO DISPONIBLE! │
│                         │
│   ✂️  ✂️  ✂️  ✂️  ✂️   │
│   ✂️  ✂️  ✂️  ✂️  ✂️   │
│                         │
│  ████████████████ 10/10 │
│                         │
│  ┌─────────────────┐    │
│  │  CANJEAR PREMIO │    │
│  │    1 corte gratis│   │
│  └─────────────────┘    │
└─────────────────────────┘
```


### Flujo del negocio

#### Panel principal — App del negocio

```
┌─────────────────────────┐
│  SELLO Business  ⚙️     │
│  Peluquería Carlos      │
├─────────────────────────┤
│  📊 Resumen hoy         │
│  Sellos: 8  Canjes: 1   │
├─────────────────────────┤
│                         │
│  ┌─────────────────┐    │
│  │  📷 ESCANEAR QR │    │
│  │   del cliente   │    │
│  └─────────────────┘    │
│                         │
├─────────────────────────┤
│  👥 Clientes (47)       │
│                         │
│  Carlos G.    ● 7/10    │
│  Ana M.       ● 3/10    │
│  Luis P.      🎉 listo  │
│  María S.     ⚠️ 45 días│
│                         │
└─────────────────────────┘
```

#### Onboarding del negocio — Configuración inicial

```
┌─────────────────────────┐
│  Configura tu negocio   │
│  Paso 2 de 5            │
│  ████████░░░░░░░░       │
├─────────────────────────┤
│                         │
│  ¿Cuántos sellos para   │
│  el premio?             │
│                         │
│  Sugerido para          │
│  peluquería: 10 sellos  │
│                         │
│  [ -  ]  [ 10 ]  [ +  ] │
│                         │
│  ¿Cuál es el premio?    │
│                         │
│  ┌─────────────────┐    │
│  │ 1 corte gratis  │    │
│  └─────────────────┘    │
│  (sugerencia editable)  │
│                         │
│       [ Siguiente → ]   │
└─────────────────────────┘
```

#### Pantalla de estadísticas

```
┌─────────────────────────┐
│  ← Estadísticas         │
├─────────────────────────┤
│  Frecuencia media       │
│  de visita: 3,2 semanas │
│                         │
│  Clientes activos: 41   │
│  Clientes perdidos:  6  │
│  Premios canjeados: 12  │
├─────────────────────────┤
│  ⚠️ Sin venir +30 días  │
│                         │
│  María S.    45 días    │
│  Pedro L.    38 días    │
│  Laura F.    31 días    │
├─────────────────────────┤
│  ⭐ Más fieles          │
│                         │
│  Carlos G.   17 visitas │
│  Ana M.      14 visitas │
└─────────────────────────┘
```

### Diagrama de flujo general

```
NEGOCIO                          CLIENTE
   │                                │
   │ 1. Descarga app                │
   │ 2. Registra negocio            │
   │ 3. Configura tarjeta           │
   │ 4. Obtiene QR único            │
   │         │                      │
   │         ▼                      │
   │    [QR del negocio] ──────────►│ 5. Escanea QR
   │                                │ 6. Se registra
   │                                │ 7. Instala PWA
   │                                │ 8. Recibe tarjeta
   │                                │
   │◄── 9. Cliente muestra QR ──────│
   │ 10. Escanea QR cliente         │
   │ 11. Confirma sello             │──► Notificación
   │                                │    "Nuevo sello"
   │         [... visitas ...]      │
   │                                │
   │◄── 12. QR de canje ───────────│ Premio disponible
   │ 13. Escanea y confirma         │
   │ 14. Contador se reinicia  ─────►│ Tarjeta reiniciada
```

## 4. Arquitectura y tecnología

### Estructura general de la aplicación

La aplicación se divide en tres partes principales:

```
┌─────────────────────────────────────────────────────┐
│                    SELLO                            │
├───────────────┬─────────────────┬───────────────────┤
│  PWA Cliente  │  App Negocio    │     Backend       │
│   (React)     │ (React Native)  │   (Supabase)      │
└───────────────┴─────────────────┴───────────────────┘
```

### Tecnologías utilizadas

#### Frontend — PWA del cliente


React: Interfaz de usuario de la PWA 
Web App Manifest: Permite instalar la PWA desde el navegador 
Service Worker: Funcionamiento offline básico y caché 
QRCode.js:  Generación del QR personal del cliente 

La aplicación del cliente es una **Progressive Web App (PWA)**. Cuando el cliente escanea el QR del negocio, se abre una página web en su navegador. El navegador le ofrece instalarla en su pantalla de inicio como si fuera una app descargada, sin pasar por el App Store ni Google Play


#### Frontend — App del negocio

React Native: App nativa para iOS y Android desde un solo código 
Expo: Herramienta de desarrollo y build para React Native 
React Native Camera: Escáner de QR para añadir sellos y canjear premios 


#### Backend y base de datos


Supabase: Backend completo en la nube 
PostgreSQL: Base de datos relacional (incluida en Supabase) 
Supabase Auth: Autenticación de usuarios (negocio y cliente) 
Supabase Storage: Almacenamiento de logos y fotos de los negocios 
Supabase Realtime: Actualización en tiempo real de los sellos en la tarjeta 

Supabase proporciona toda la infraestructura del servidor sin necesidad de configurar un backend desde cero. Los datos de negocios, clientes y sellos se guardan en PostgreSQL y están disponibles desde cualquier dispositivo en tiempo real


#### Pagos

Stripe: Gestión de suscripciones y pagos recurrentes 


#### Notificaciones

Firebase Cloud Messaging: Notificaciones push para iOS, Android y navegadores web 

Servicio gratuito de Google para enviar notificaciones en tiempo real tanto a la app del negocio como a la PWA del cliente.


#### Inteligencia artificial y utilidades

ColorThief: Librería open source para detectar los colores del logo automáticamente 
Gemini API (Google): Sugerencias de número de sellos, tipo de premio y análisis de clientes 
Groq: Alternativa gratuita a Gemini basada en modelos open source 
QRCode.js: Generación de códigos QR para negocios y clientes 

La mayoría de las funciones de análisis (clientes inactivos, frecuencia de visitas, clientes habituales) se resuelven directamente con consultas a la base de datos, sin depender de ninguna API externa. La IA externa solo se usa para sugerencias de texto y mensajes personalizados


### Estructura de la base de datos

Las tablas principales de la aplicación son:

```
negocios
├── id
├── nombre
├── tipo_negocio
├── email
├── logo_url
├── foto_url
├── color_primario
├── color_secundario
├── num_sellos_premio
├── descripcion_premio
├── meses_caducidad
└── plan_activo

clientes
├── id
├── nombre
├── email
└── fecha_registro

tarjetas
├── id
├── cliente_id → clientes.id
├── negocio_id → negocios.id
├── sellos_actuales
├── total_canjes
└── fecha_caducidad

sellos
├── id
├── tarjeta_id → tarjetas.id
├── fecha
└── empleado_id → usuarios.id

usuarios_negocio
├── id
├── negocio_id → negocios.id
├── email
└── rol  (admin / empleado)
```

### Diagrama de arquitectura

```
┌──────────────┐      ┌──────────────┐
│  PWA Cliente │      │ App Negocio  │
│   (React)    │      │(React Native)│
└──────┬───────┘      └──────┬───────┘
       │                     │
       │     HTTPS / REST     │
       ▼                     ▼
┌─────────────────────────────────────┐
│              Supabase               │
│  ┌──────────┐  ┌──────────────┐    │
│  │PostgreSQL│  │  Auth + JWT  │    │
│  └──────────┘  └──────────────┘    │
│  ┌──────────┐  ┌──────────────┐    │
│  │ Storage  │  │  Realtime    │    │
│  └──────────┘  └──────────────┘    │
└─────────────────────────────────────┘
       │                     │
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│    Stripe    │      │   Firebase   │
│   (Pagos)   │      │   (Notif.)   │
└──────────────┘      └──────────────┘
       │
       ▼
┌──────────────┐
│ Gemini / Groq│
│     (IA)     │
└──────────────┘
```



