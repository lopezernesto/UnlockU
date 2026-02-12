# 🔓 UnlockU

**Control visual de correlativas para carreras universitarias**

UnlockU es una aplicación web interactiva que te permite visualizar y gestionar el progreso de tu carrera universitaria. Marcá las materias que vas aprobando y observá cómo se desbloquean automáticamente las siguientes según sus correlatividades.

---

## ✨ Características

- 🎯 **Visualización intuitiva**: Cada materia es una carta interactiva con información detallada
- 🔗 **Correlativas automáticas**: El sistema calcula automáticamente qué materias podés cursar
- 📊 **Estados visuales**: Bloqueada, Habilitada, Cursada y Aprobada con colores distintos
- 💾 **Persistencia local**: Tu progreso se guarda automáticamente en el navegador
- 📥 **Importar/Exportar**: Respaldá o compartí tu progreso en formato JSON
- ✏️ **Totalmente editable**: Creá, editá y eliminá materias según tu plan de estudios
- 🎨 **Interfaz moderna**: Diseño dark mode con animaciones fluidas
- 📱 **Interactivo**: Arrastrá, hacé zoom y explorá tu plan de estudios libremente

---

## 🎓 Plan de Estudios Incluido

Actualmente incluye el plan de estudios completo de:

- **Licenciatura en Ciencias de la Computación** (Plan 1112/2013) - UNCo, Neuquén

_Se planean agregar más carreras en futuras versiones_

---

## 🚀 Demo

### Vista General

![Vista completa del plan](./screenshots/Bienvenida.png)
![Vista completa del plan](./screenshots/VistaGeneral.png)

### Estados y Progreso

![Diferentes estados](./screenshots/Estados.png)
![Materias bloqueadas](./screenshots/Bloqueadas.png)

### Gestión de Materias

![Modal de edición](./screenshots/ModalEditar.png)
![Sidebar de agregar materia](./screenshots/AgregarMateria.png)

---

## 🛠️ Tecnologías

- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño
- **ReactFlow** - Visualización de grafos y nodos
- **Vite** - Build tool y dev server
- **Lucide React** - Iconos
- **LocalStorage** - Persistencia de datos

---

## 📦 Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/lopezernesto/UnlockU.git
cd UnlockU
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

4. **Abrir en el navegador**

```
http://localhost:5173
```

### Comandos disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Compila para producción
npm run preview  # Preview de la build de producción
npm run lint     # Ejecuta el linter
```

---

## 💡 Uso

### Primeros pasos

1. **Cargar la carrera**: Hacé click en el botón "LCC" del menú lateral para cargar el plan completo de Licenciatura en Ciencias de la Computación

2. **Marcar progreso**: Click en las materias habilitadas para:
   - ✅ Regularizar (marcar como cursada)
   - 🏆 Aprobar final (cargar nota y año)
   - 🔄 Resetear estado

3. **Agregar materias personalizadas**: Usá el botón "+" para crear materias nuevas con sus correlativas

4. **Editar materias**: Click en el ícono de lápiz para modificar nombre, año, cuatrimestre o correlativas

5. **Exportar progreso**: Guardá tu progreso en un archivo JSON para respaldo

6. **Importar progreso**: Cargá un archivo previamente exportado

### Navegación

- **Zoom**: Usá la rueda del mouse o los controles en pantalla
- **Pan**: Arrastrá el fondo para moverte
- **Resetear posición**: Botón de grilla en los controles

### Estados de materias

- 🔒 **Bloqueada** (gris): No cumple con las correlativas
- 🔓 **Habilitada** (cyan): Podés cursarla
- 📝 **Cursada** (amarillo): Ya la regularizaste
- ✅ **Aprobada** (verde): Final aprobado

---

## 🗂️ Estructura del Proyecto

```
UnlockU/
├── front/
│   ├──src/
│   │   ├── components/          # Componentes React
│   │   │   ├── Menu.tsx         # Menú lateral con acciones
│   │   │   ├── Bienvenida.tsx     #Para cuando no hay una carrera cargada
│   │   │   ├── Header.tsx         # Nombre de la carrera + botones
│   │   │   ├── NodoMateria.tsx  # Carta de materia individual
│   │   │   ├── SidebarMateria.tsx    # Panel para agregar materias
│   │   │   ├── ModalEditarMateria.tsx
│   │   │   ├── ModalEstadoMateria.tsx
│   │   │   ├── ModalConfirmacion.tsx
│   │   │   └── Separador.tsx    # Títulos de año
│   │   ├── hooks/
│   │   │   ├── useCarrera.ts    # Lógica principal del estado
│   │   │   └── useMaterias.ts   # Lógica de cada materia
│   │   ├── types/
│   │   │   ├── Carrera.ts
│   │   │   └── Materia.ts
│   │   ├── data/
│   │   │   ├── LCC.ts           # Plan de LCC completo
│   │   │   ├── TUADYSL.ts       # Plan de TUADYSL completo
│   │   │   └── MateriasIniciales.ts  # Datos de prueba
│   │   ├── App.tsx              # Componente principal
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Estilos globales
│   ├── screenshots/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
├── back/
└── README.md
```

---

## 🤝 Contribuciones

Este es un proyecto personal educativo. Si encontrás bugs o tenés sugerencias:

1. Abrí un **Issue** describiendo el problema o mejora
2. Si querés contribuir código, hacé un **Pull Request**

---

## 📝 Roadmap

### Próximas funcionalidades planeadas:

- [ ] Estadísticas de progreso (promedio, materias aprobadas, etc.)
- [ ] Sistema de calificación de dificultad por materia
- [ ] Más planes de estudio (otras carreras de UNCo)
- [ ] Planificación de cuatrimestres futuros
- [ ] Modo presentación (vista de solo lectura)

---
