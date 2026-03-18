# Le Pan - E-commerce

Este repositorio contiene el código fuente para el e-commerce, incluyendo tanto el frontend (React) como el backend (Node.js/Express con MongoDB Atlas).

## Estructura del Proyecto

El proyecto está dividido en dos carpetas principales: `client` (Frontend) y `server` (Backend).

### 🎨 Client (Frontend - React)

El frontend está estructurado para ser escalable, con la siguiente organización dentro de `client/src`:

- **`assets/`**: Archivos estáticos como imágenes, iconos y hojas de estilo globales.
- **`components/`**: Componentes reutilizables de la interfaz de usuario (ej. Botones, Tarjetas de Productos, Navbar, Footer).
- **`pages/`**: Vistas completas que representan cada ruta de la aplicación (ej. `Home`, `ProductDetails`, `Cart`, `AdminDashboard`).
- **`context/`**: Contextos de React para el manejo de estado global (ej. `AuthContext` para usuarios y admin, `CartContext` para el carrito).
- **`hooks/`**: Custom hooks de React para reutilizar lógica.
- **`services/`**: Archivos encargados de realizar las peticiones HTTP (Axios/Fetch) a la API del backend.
- **`utils/`**: Funciones auxiliares y formateadores (ej. formatear moneda, validaciones).

### ⚙️ Server (Backend - Node.js + Express)

El backend expone una API REST y se conecta a MongoDB Atlas, con la siguiente organización dentro de `server/src`:

- **`config/`**: Archivos de configuración (ej. conexión a MongoDB, configuración de variables de entorno).
- **`controllers/`**: La lógica de negocio real para cada ruta (ej. crear producto, registrar usuario, procesar orden).
- **`middlewares/`**: Funciones que se ejecutan antes del controlador (ej. verificar token de autenticación, validar roles como Administrador).
- **`models/`**: Esquemas de Mongoose que dictan la estructura de datos en MongoDB (ej. `User.js`, `Product.js`, `Order.js`).
- **`routes/`**: Definición de los endpoints de la API, asociando cada ruta con su respectivo controlador (ej. `productRoutes.js`, `userRoutes.js`).
- **`utils/`**: Utilidades compartidas (ej. generador de JWT, envío de emails, manejo de errores).

---

¡Listo para empezar a codificar!
