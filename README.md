# Backend-ecommerce-api

Backend de una red social desarrollado con **Node.js**, **Express**, y **Mongoose**. Esta API gestiona usuarios, posts y likes.

---

## 🚀 Tecnologías

- Node.js
- Express
- Mongoose
- MongoDB
- Jest

---

## ⚙️ Instalación y configuración

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/MrCamoga/TheBridge-Backend-mongoose.git backend
   cd backend
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configuración:**

   Rellena la configuración del archivo .env.example y cambia el nombre a .env

   ```bash
   mv .env.example .env
   ```

4. **Ejecuta el servidor:**

   ```bash
   npm start
   ```

---

## Endpoints disponibles

### Usuarios

| Método | Ruta           | Descripción                             | Auth requerida |
| ------ | -------------- | --------------------------------------- | -------------- |
| POST   | `/auth/login`       | Inicia sesión                           | ❌             |
| POST   | `/users`    | Crea un nuevo usuario                   | ❌ |
| DELETE | `/auth/logout`      | Cierra sesión               | ✅     |
| GET    | `/users`     | Devuelve los datos del usuario logueado | ✅|

---

### Posts

| Método | Ruta              | Descripción              | Auth requerida |
| ------ | ----------------- | ------------------------ | -------------- |
| GET    | `/posts`       | Lista los posts más recientes y sus comentarios    | ❌             |
| GET    | `/posts/:id`        | Devuelve un post por ID  | ❌             |
| GET    | `/posts/title/:title` | Busca posts por título   | ❌             |
| POST   | `/posts`         | Crea un nuevo post       | ✅             |
| PUT    | `/posts/:id`        | Actualiza un post        | ✅             |
| DELETE   | `/posts/:id`    | Elimina un post | ✅             |
| POST   | `/posts/:id/likes`      | Da like a un post        | ✅             |
| DELETE   | `/posts/:id/likes`    | Quita el like de un post | ✅             |
| POST   | `/posts/:id/comments`      | Crea un nuevo comentario        | ✅             |
| GET   | `/posts/:id/comments`    | Obtiene los comentarios de un post | ✅             |

---

### Comentarios

| Método | Ruta              | Descripción              | Auth requerida |
| ------ | ----------------- | ------------------------ | -------------- |
| DELETE   | `/comments/:id`    | Elimina un comentario | ✅       |
| POST   | `/comments/:id/likes`      | Da like a un comentario        | ✅       |
| DELETE   | `/comments/:id/likes`    | Quita el like de un comentario | ✅       | 

---

### Media

| Método | Ruta              | Descripción              | Auth requerida |
| ------ | ----------------- | ------------------------ | -------------- |
| GET   | `/media/:id`    | Obtiene la foto mediante la ID de un post | ❌       |

---

## Autor

- [Carlos Moya](https://github.com/MrCamoga)
