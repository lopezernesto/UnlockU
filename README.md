# 🔓 UnlockU

**Control visual de correlativas para carreras universitarias**

UnlockU es una aplicación web interactiva que te permite visualizar y gestionar el progreso de tu carrera universitaria. Marcá las materias que vas aprobando y observá cómo se desbloquean automáticamente las siguientes según sus correlatividades.

---

## ✨ Características

- 🎯 **Visualización intuitiva**: Cada materia es una carta interactiva con información detallada
- 🔗 **Correlativas automáticas**: El sistema calcula automáticamente qué materias podés cursar
- 📊 **Estados visuales**: Bloqueada, Habilitada, Cursada y Aprobada con colores distintos
- 💾 **Persistencia local**: Tu progreso se guarda automáticamente en el navegador
- ☁️ **Sincronización en servidor**: Disponible para usuarios con mail institucional `@est.fi.uncoma.edu.ar`
- 📥 **Importar/Exportar**: Respaldá o compartí tu progreso en formato JSON
- ✏️ **Totalmente editable**: Creá, editá y eliminá materias según tu plan de estudios
- 🎨 **Interfaz moderna**: Diseño dark mode con animaciones fluidas
- 📱 **Interactivo**: Arrastrá, hacé zoom y explorá tu plan de estudios libremente
- 🎭 **Modo simulación**: podés marcar materias como aprobadas para visualizar escenarios futuros, sin respetar estrictamente las correlativas

---

## 🎓 Plan de Estudios Incluido

Actualmente incluye el plan de estudios completo de:

- **Licenciatura en Ciencias de la Computación** (Plan 1112/2013) - UNCo, Neuquén
- **Licenciatura en Sistemas de Información** (Plan 1420/2013) - UNCo, Neuquén
- **Tecnicatura Universitaria en Dessarrollo WEB** - UNCo, Neuquén
- **Tecnicatura Universitaria en Administración de Sistemas y Software Libre** - UNCo, Neuquén

_Se planean agregar más carreras en futuras versiones_

---

## 🚀 Demo

### Login

![Login](./front/screenshots/Login.png)

### Vista General

![Bienvenida](./front/screenshots/Bienvenida.png)
![Vista completa del plan LCC](./front/screenshots/VistaGeneral.png)

### Estados y Progreso

![Diferentes estados](./front/screenshots/Estados.png)
![Materias bloqueadas](./front/screenshots/Bloqueadas.png)

### Gestión de Materias

![Modal de edición](./front/screenshots/ModalEditar.png)
![Sidebar de agregar materia](./front/screenshots/AgregarMateria.png)

### Gestión de Carreras

![Modal de creación](./front/screenshots/CrearCarrera.png)
![Modal de edición](./front/screenshots/EditarCarrera.png)

---

## 🛠️ Tecnologías

### Frontend

- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño
- **ReactFlow** - Visualización de grafos y nodos
- **Vite** - Build tool y dev server
- **Lucide React** - Iconos
- **TanStack Query** — fetching y sincronización de datos con el servidor
- **Zod** — validación de datos en importación/exportación

### Backend

- **Node.js + Express** — servidor REST
- **TypeScript** — tipado estático
- **Prisma** — ORM y migraciones
- **PostgreSQL** — base de datos principal
- **Passport.js + Google OAuth 2.0** — autenticación institucional
- **express-session + connect-pg-simple** — manejo de sesiones persistidas en DB
- **Zod** — validación de input en todas las rutas
- **Helmet** — headers de seguridad HTTP
- **express-rate-limit** — protección contra abuso de endpoints

---

## 📦 Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- pnpm (recomendado) o npm
- PostgreSQL corriendo localmente o en la nube
- Credenciales de Google OAuth 2.0

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/lopezernesto/UnlockU.git
cd UnlockU
```

2. **Configurar variables de entorno**

El proyecto requiere dos archivos `.env`. Nunca los commitees al repositorio.

**`back/.env`** — copiá `back/.env.example` y completá los valores:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/unlocku
SESSION_SECRET=cadena-aleatoria-larga-de-al-menos-32-caracteres
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

**`front/.env`** — copiá `front/.env.example` y completá los valores:

```env
VITE_API_URL=http://localhost:3000
```

3. **Instalar dependencias**

```bash
#Backend
pnpm install
pnpm prisma migrate deploy
```

```bash
#Frontend
pnpm install
```

4. **Ejecutar en modo desarrollo**

```bash
#Tanto en backend como en frontend
pnpm dev
```

5. **Abrir en el navegador**

```
http://localhost:5173
```

### Comandos disponibles

```bash
# Frontend
pnpm dev        # inicia el servidor de desarrollo
pnpm build      # compila para producción
pnpm preview    # preview de la build de producción
pnpm lint       # ejecuta el linter

# Backend
pnpm dev                          # inicia el servidor con hot reload
pnpm build                        # compila TypeScript
```

---

## 💡 Uso

### Modos de acceso

**Cuenta institucional** (`@est.fi.uncoma.edu.ar`):

- El progreso se guarda en el servidor y es accesible desde cualquier dispositivo
- Las posiciones de los nodos en el canvas también se sincronizan
- Podés gestionar múltiples carreras

  **Modo invitado**:

- No requiere cuenta
- El progreso se guarda únicamente en el localStorage de este navegador
- No es accesible desde otros dispositivos ni navegadores
- Se conserva mientras no hagas logout ni limpies los datos del navegador
- Podés exportar tu progreso en cualquier momento para respaldarlo

  > ⚠️ Si usás el modo invitado y querés crear una cuenta después, **exportá tu progreso antes de iniciar sesión**. La migración automática de datos no está implementada.

### Primeros pasos

1. **Cargar la carrera**: Hacé click en el botón de tu carrera en el menú lateral (LCC, LSI, TUASSL, TUDW) o creá una propia

2. **Marcar progreso**: Click en las materias habilitadas para:
   - ✅ Regularizar (marcar como cursada)
   - 🏆 Aprobar final (cargar nota y año)
   - 🔄 Resetear estado

3. **Agregar materias personalizadas**: Usá el botón "+" para crear materias nuevas con sus correlativas

4. **Editar materias**: Click en el ícono de lápiz para modificar nombre, año, cuatrimestre o correlativas

5. **Exportar progreso**: Guardá tu progreso en un archivo JSON para respaldo o para compartir

6. **Importar progreso**: Cargá un archivo previamente exportado

### Navegación

- **Zoom**: Usá la rueda del mouse o los controles en pantalla
- **Pan**: Arrastrá el fondo para moverte
- **Mover nodos**: arrastrá las cartas para reorganizar el canvas
- **Resetear posición**: Botón de grilla en los controles

### Estados de materias

| Estado            | Color    | Descripción                    |
| ----------------- | -------- | ------------------------------ |
| 🔒 **Bloqueada**  | Gris     | No cumple con las correlativas |
| 🔓 **Habilitada** | Cyan     | Podés cursarla                 |
| 📝 **Cursada**    | Amarillo | Ya la regularizaste            |
| ✅ **Aprobada**   | Verde    | Final aprobado                 |

### Importar / Exportar progreso

El archivo exportado es un JSON con estructura validada. Incluye la carrera completa con todas las materias, correlativas, estados, notas y años registrados. Este archivo puede importarse en otra cuenta o en otro dispositivo.

---

## ⚠️ Limitaciones conocidas

- El progreso del modo invitado solo existe en el navegador donde fue creado. No es accesible desde otros dispositivos.
- Limpiar los datos del navegador (historial, caché, storage) elimina el progreso invitado de forma permanente.
- El modo incógnito no conserva datos entre sesiones.
- No existe migración automática de datos del modo invitado a una cuenta registrada. El usuario debe exportar manualmente antes de crear una cuenta.
- El sistema no calcula ni advierte sobre vencimientos de regularidades (3 años según el reglamento académico).

---

## 🗂️ Estructura del Proyecto

```
UnlockU/
├── front/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas.tsx              # Todo lo relacionado con ReactFlow
│   │   │   ├── Header.tsx              # Nombre de la carrera + botón exportar
│   │   │   ├── Menu.tsx                # Menú lateral con acciones
│   │   │   ├── NodoMateria.tsx         # Carta de materia individual
│   │   │   ├── SidebarMateria.tsx      # Panel para agregar materias
│   │   │   ├── Bienvenida.tsx          # Pantalla sin carrera cargada
│   │   │   ├── Login.tsx               # Pantalla de inicio de sesión
│   │   │   ├── PanelUsuario.tsx        # Avatar y menú de usuario
│   │   │   ├── Separador.tsx           # Títulos de año
│   │   │   ├── ModalEditarMateria.tsx
│   │   │   ├── ModalEditarCarrera.tsx
│   │   │   ├── ModalEstadoMateria.tsx
│   │   │   ├── ModalConfirmacion.tsx
│   │   │   ├── ModalCrearCarrera.tsx
│   │   │   └── ModalCarreras.tsx       # Panel para mostrar las carreras guardadas
│   │   ├── hooks/
│   │   │   ├── useAuth.ts              # Lógica de autenticación
│   │   │   ├── useCarrera.ts           # Lógica principal del estado de carrera
│   │   │   ├── useCarreraCustom.ts     # Carreras guardadas en el backend
│   │   │   └── useMaterias.ts          # Lógica de nodos y arcos de ReactFlow
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── CarreraContext.tsx
│   │   ├── types/
│   │   │   ├── Auth.ts
│   │   │   ├── Carrera.ts
│   │   │   └── Materia.ts
│   │   ├── services/
│   │   │   └── api.ts                  # Cliente HTTP hacia el backend
│   │   ├── utils/
│   │   │   └── utils.ts                # RecalcularEstados y funciones compartidas
│   │   ├── data/
│   │   │   ├── LCC.ts
│   │   │   ├── LSI.ts
│   │   │   ├── TUASSL.ts
│   │   │   └── TUDW.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── screenshots/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── vite.config.ts
├── back/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   └── validate.ts             # Helpers de validación con Zod
│   │   ├── middleware/
│   │   │   └── requireAuth.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── carreras.ts
│   │   │   ├── posiciones.ts
│   │   │   └── progreso.ts
│   │   ├── types/
│   │   │   └── express.d.ts            # Augmentation de tipos de Express
│   │   ├── index.ts
│   │   └── passport.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 📝 Decisiones de diseño

### Estados derivados vs persistidos

Los estados **Bloqueada** y **Habilitada** no se guardan en la base de datos porque se calculan dinámicamente a partir de los estados persistidos. Solo **Cursada** y **Aprobada** se persisten, ya que representan hechos reales del progreso académico del usuario.

Esto evita inconsistencias: si se guardara el estado derivado y luego cambiara el progreso de una correlativa, habría que actualizar en cascada todos los estados afectados. El recálculo dinámico garantiza que el estado siempre refleja la realidad actual.

### Modo de simulación

El sistema permite marcar materias como cursadas o aprobadas aunque no se cumplan estrictamente todas las correlativas. Esto es una decisión intencional para permitir simular escenarios futuros: "¿qué materias podría cursar si aprobara esta?".

Esta decisión implica que el sistema no es un validador estricto del reglamento académico, sino una herramienta de planificación y visualización.

---

## 📝 Roadmap

### Próximas funcionalidades planeadas:

- [ ] Estadísticas de progreso (promedio, materias aprobadas, porcentaje de carrera, etc.)
- [ ] Perfil de usuario (nombre, foto, configuraciones)
- [ ] Sistema de calificación de dificultad por materia
- [ ] Más planes de estudio (otras carreras de UNCo)
- [ ] Modo presentación (vista de solo lectura)
- [ ] Migración automática de progreso de modo invitado a cuenta registrada
- [ ] Notificaciones de error de sincronización en lugar de alerts del navegador

---

### Deuda técnica conocida

- El formato de exportación JSON no tiene número de versión, lo que puede generar incompatibilidades en versiones futuras
- No hay tests automatizados (unitarios ni de integración)
- Las posiciones de nodos se persisten en base de datos; en el futuro podrían manejarse solo en localStorage con sincronización eventual

---

## 🤝 Contribuciones

Este es un proyecto personal educativo. Si encontrás bugs o tenés sugerencias:

1. Abrí un **Issue** describiendo el problema o mejora
2. Si querés contribuir código, hacé un **Pull Request**
