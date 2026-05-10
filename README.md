# SELLO 🟠

**Plataforma digital de fidelización de clientes**

SELLO digitaliza las tarjetas de sellos en papel. Los negocios crean su tarjeta personalizada y la gestionan desde un dashboard. Los clientes acumulan sellos y canjean premios escaneando un QR desde su móvil, sin descargar ninguna app.

🔗 **Demo:** [sello-app.vercel.app](https://sello-app.vercel.app)

---

## Índice

- [Funcionalidad](#funcionalidad)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Base de datos](#base-de-datos)
- [Detalles de código relevantes](#detalles-de-código-relevantes)
- [Dependencias](#dependencias)
- [Instalación y desarrollo local](#instalación-y-desarrollo-local)
- [Despliegue](#despliegue)

---

## Funcionalidad

### Para el negocio

- **Registro y login** con email y contraseña (Supabase Auth)
- **Onboarding** por pasos: tipo de negocio → tipo de tarjeta → configuración de sellos, premio y caducidad
- **Dashboard** con QR del negocio para que los clientes se registren
- **Mi Tarjeta**: personalización del diseño (estilo, color, efectos decorativos, iconos de sello y premio)
- **Escanear QR**: activa la cámara para añadir sellos al cliente o canjear su premio
- **Clientes**: listado con buscador y opción de añadir sellos manualmente
- **Analíticas**: clientes activos, premios canjeados, tasa de retorno, gráfica de actividad 30 días, clientes más habituales y en riesgo
- **Ajustes**: edición de nombre, email, teléfono, dirección, contraseña y eliminación de cuenta
- **Ayuda**: preguntas frecuentes y formulario de contacto

### Para el cliente

- **Registro** escaneando el QR del negocio — se crea la tarjeta automáticamente
- **Tarjeta digital** con sellos acumulados y QR personal
- **Actualización en tiempo real** — cuando el negocio añade un sello, la tarjeta se actualiza sin recargar
- **Canje de premio** — cuando la tarjeta está completa, el QR lleva directamente a la pantalla de canje
- **PWA** — se puede añadir a la pantalla de inicio del móvil sin instalar nada

---

## Tecnologías

| Tecnología | Rol | Por qué |
|---|---|---|
| **React 18 + Vite** | Frontend SPA | Componentes reutilizables, actualización reactiva de la UI, estándar del sector |
| **Supabase** | Backend + BD + Auth | PostgreSQL, autenticación, API REST automática, Realtime via WebSockets, RLS |
| **Vercel** | Hosting + Deploy | Deploy automático desde GitHub, CDN global, variables de entorno |
| **React Router v6** | Navegación | Rutas SPA sin recargar el navegador |
| **qrcode.react** | Generación de QR | Genera QRs dinámicos para negocio y cliente |
| **html5-qrcode** | Escáner de QR | Activa la cámara del dispositivo para leer QRs |
| **vite-plugin-pwa** | PWA | manifest.json + Service Worker para instalar como app nativa |

---

## Arquitectura

```
SELLO-APP/
└── client/
    ├── public/
    │   ├── manifest.json          # Configuración PWA
    │   ├── icon-192.png
    │   └── icon-512.png
    └── src/
        ├── constants/
        │   └── index.js           # Colores, paleta, estilos, efectos, darkenColor()
        ├── hooks/
        │   └── useAuth.js         # Hook: verifica sesión + carga negocio
        ├── components/
        │   ├── NavNegocio.jsx     # Sidebar de navegación del negocio
        │   ├── ui/
        │   │   └── LoadingScreen.jsx
        │   └── tarjeta/
        │       ├── Efecto.jsx     # Decoraciones visuales (blobs, líneas, ondas)
        │       ├── IconSVG.jsx    # Renderizador de iconos SVG por path
        │       ├── TarjetaBlob.jsx   # Estilo Moderno (gradiente)
        │       ├── TarjetaDark.jsx   # Estilo Clásico (color + gris oscuro)
        │       └── TarjetaPreview.jsx # Selector Blob/Dark según prop estilo
        ├── pages/
        │   ├── negocio/
        │   │   ├── onboarding/
        │   │   │   └── Onboarding.jsx
        │   │   ├── Login.jsx
        │   │   ├── Register.jsx
        │   │   ├── ResetPassword.jsx
        │   │   ├── UpdatePassword.jsx
        │   │   ├── Dashboard.jsx
        │   │   ├── MiTarjeta.jsx
        │   │   ├── Clientes.jsx
        │   │   ├── Analiticas.jsx
        │   │   ├── EscanerQR.jsx
        │   │   ├── CanjearPremio.jsx
        │   │   ├── Ajustes.jsx
        │   │   └── Ayuda.jsx
        │   ├── cliente/
        │   │   ├── LoginCliente.jsx
        │   │   ├── RegistroCliente.jsx
        │   │   └── Tarjeta.jsx
        │   ├── Terminos.jsx
        │   └── Privacidad.jsx
        ├── App.jsx                # Rutas con React Router
        ├── main.jsx               # Punto de entrada
        ├── supabase.js            # Cliente Supabase (singleton)
        └── index.css              # Reset CSS mínimo
```

### Diagrama UML — Componentes

```
App.jsx
├── /negocio/* → NavNegocio (sidebar)
│   ├── Dashboard     → useAuth, QRCodeSVG, darkenColor
│   ├── MiTarjeta     → TarjetaPreview, CARD_STYLES, COLOR_PALETTE
│   ├── Clientes      → useAuth, supabase
│   ├── Analiticas    → useAuth, supabase
│   ├── EscanerQR     → html5-qrcode, supabase
│   ├── CanjearPremio → supabase
│   ├── Ajustes       → useAuth, supabase.auth
│   └── Ayuda         → useAuth
└── /cliente/*
    ├── RegistroCliente → supabase.auth.signUp, supabase (insert clientes + tarjetas)
    ├── LoginCliente    → supabase.auth.signInWithPassword
    └── Tarjeta         → supabase (realtime), QRCodeSVG, TarjetaBlob/Dark, Efecto

TarjetaPreview
├── TarjetaBlob  → Efecto, IconSVG, QRCodeSVG, darkenColor
└── TarjetaDark  → Efecto, IconSVG, QRCodeSVG
```

---

## Base de datos

### Diagrama ER

```
auth.users (Supabase interno)
    │
    ├── negocios
    │       id              UUID  PK
    │       user_id         UUID  FK → auth.users
    │       email           TEXT
    │       nombre          TEXT
    │       tipo            TEXT
    │       tipo_tarjeta    TEXT
    │       num_sellos      INTEGER
    │       premio          TEXT
    │       premios         JSONB   → [{sellos: 5, texto: "Café gratis"}, ...]
    │       diseno          JSONB   → {estilo, efecto, color, selloIcon, premioIcon}
    │       caducidad_meses INTEGER
    │       telefono        TEXT
    │       direccion       TEXT
    │
    └── clientes
            id              UUID  PK
            user_id         UUID  FK → auth.users
            nombre          TEXT
            email           TEXT
                │
                └── tarjetas
                        id               UUID     PK
                        cliente_id       UUID     FK → clientes.id
                        negocio_id       UUID     FK → negocios.id
                        sellos_actuales  INTEGER
                        total_canjes     INTEGER
                        created_at       TIMESTAMP
                        updated_at       TIMESTAMP
```

### Seguridad — Row Level Security (RLS)

Supabase tiene activado RLS en todas las tablas. Las políticas garantizan que:

- Un negocio solo puede leer y modificar su propia fila en `negocios`
- Un cliente solo puede leer y modificar su propia fila en `clientes`
- Un negocio puede leer las tarjetas de sus clientes (`tarjetas.negocio_id = auth.uid()`)
- Un cliente puede leer su propia tarjeta (`tarjetas.cliente_id` → su `clientes.user_id`)

---

## Detalles de código relevantes

### 1. `constants/index.js` — Configuración global centralizada

Todos los colores, paleta, estilos y la función `darkenColor()` están en un único archivo. Cambiar el color principal (`#E65100`) se hace en un solo lugar y se actualiza en toda la app.

```js
export const COLORS = {
  primary:     '#E65100',
  primaryDark: '#bf360c',
  danger:      '#d4380a',
  success:     '#2D6A4F',
}

export function darkenColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)})`
}
```

### 2. `hooks/useAuth.js` — Autenticación centralizada (DRY)

En vez de repetir la lógica de "verificar sesión + cargar negocio" en cada página, se extrae a un hook reutilizable:

```js
export function useAuth() {
  const [user, setUser]       = useState(null)
  const [negocio, setNegocio] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate              = useNavigate()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/negocio/login'); return }
      const { data } = await supabase.from('negocios').select('*').eq('user_id', user.id).single()
      if (!data) { navigate('/negocio/onboarding'); return }
      setUser(user); setNegocio(data); setLoading(false)
    }
    init()
  }, [navigate])

  return { user, negocio, loading, setNegocio }
}
```

Uso en cada página: `const { user, negocio, loading } = useAuth()`

### 3. Realtime — Tarjeta del cliente en tiempo real

Cuando el negocio añade un sello, la tarjeta del cliente se actualiza automáticamente via WebSocket sin recargar:

```js
useEffect(() => {
  if (!tarjeta) return
  const channel = supabase
    .channel('tarjeta-cambios')
    .on('postgres_changes', {
      event: 'UPDATE', schema: 'public',
      table: 'tarjetas', filter: `id=eq.${tarjeta.id}`
    }, (payload) => setTarjeta(payload.new))
    .subscribe()
  return () => supabase.removeChannel(channel)
}, [tarjeta])
```

### 4. QR dinámico — Dos tipos según el estado

El QR del cliente varía según si la tarjeta está completa o no:

```js
const premioGanado = sellosActuales >= totalSellos
const qrCliente = premioGanado
  ? `${window.location.origin}/negocio/canjear?tarjeta=${tarjeta.id}`
  : `${window.location.origin}/negocio/escanear?tarjeta=${tarjeta.id}`
```

### 5. Campos JSONB — `diseno` y `premios`

El diseño de la tarjeta y la lista de premios se guardan como objetos JSON en columnas JSONB de PostgreSQL:

```js
// Guardar diseño en Supabase
await supabase.from('negocios').update({
  premios: [{ sellos: 5, texto: 'Café pequeño' }, { sellos: 10, texto: 'Menú completo' }],
  diseno:  { estilo: 'blob', efecto: 'blobs', color: '#E65100', selloIcon: 'cup', premioIcon: 'gift' }
}).eq('user_id', user.id)
```

---

## Dependencias

### `package.json` (client)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "html5-qrcode": "^2.x",
    "qrcode.react": "^3.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x",
    "vite-plugin-pwa": "^0.x"
  }
}
```

---

## Instalación y desarrollo local

### Requisitos previos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Saeed269/SELLO-APP.git
cd SELLO-APP/client

# 2. Instalar dependencias
npm install

# 3. Crear archivo de variables de entorno
cp .env.example .env
```

Editar `.env` con las credenciales de tu proyecto Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

```bash
# 4. Iniciar servidor de desarrollo
npm run dev
# → http://localhost:5173
```

### Configuración de Supabase

Crear las siguientes tablas en el SQL Editor de Supabase:

```sql
-- Tabla negocios
CREATE TABLE negocios (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users(id),
  email            TEXT,
  nombre           TEXT,
  tipo             TEXT,
  tipo_tarjeta     TEXT DEFAULT 'sellos',
  num_sellos       INTEGER DEFAULT 10,
  premio           TEXT,
  premios          JSONB,
  diseno           JSONB,
  caducidad_meses  INTEGER DEFAULT 12,
  telefono         TEXT,
  direccion        TEXT
);

-- Tabla clientes
CREATE TABLE clientes (
  id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id  UUID REFERENCES auth.users(id),
  nombre   TEXT,
  email    TEXT
);

-- Tabla tarjetas
CREATE TABLE tarjetas (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id       UUID REFERENCES clientes(id) ON DELETE CASCADE,
  negocio_id       UUID REFERENCES negocios(id) ON DELETE CASCADE,
  sellos_actuales  INTEGER DEFAULT 0,
  total_canjes     INTEGER DEFAULT 0,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activar Realtime en tarjetas
ALTER PUBLICATION supabase_realtime ADD TABLE tarjetas;
```

---

## Despliegue

La app está desplegada en **Vercel** con deploy automático desde GitHub.

Cada `git push` a la rama `main` lanza automáticamente:
1. `npm run build` (Vite compila React a HTML/CSS/JS estático)
2. Deploy en la CDN de Vercel

**Variables de entorno en Vercel:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**URL producción:** https://sello-app.vercel.app
