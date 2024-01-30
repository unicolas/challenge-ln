## LN challenge - Contacts API

NestJS + TypeORM/PostgreSQL + Jest

Se provee dev container con Node.js, TypeScript y PostgreSQL.

Dotenv para los valores de conexión.

```bash
# add .env
$ cp .env.example .env

# install deps
$ npm install

# run migrations
$ npm run typeorm migration:run

# run
$ npm run start
$ npm run start:dev

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```
La API de contactos está en un único módulo `contacts` con controlador, servicio, DTOs, entidades y modelos (`types.ts`) y transformaciones (`mappers.ts`). Unit tests y end to end.

- `POST /contacts` para crear un contacto
- `GET /contacts/{id}` para obtener un contacto
- `PATCH /contacts/{id}` para actualizar un contacto
- `DELETE /contacts` para borrar un contacto
- `GET /contacts` para buscar/filtrar contactos por email, número, ciudad o estado.

Swagger/OpenAPI está disponible en la ruta `/docs`.

El único valor que se consideró obligatorio para un contacto es el nombre, para la persistencia se separan  del resto del contacto la imagen de perfil, la dirección y los teléfonos (se considera que podrían agregarse otros tipos de teléfono).
