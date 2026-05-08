# Parte 2: Reflexión - Prisma ORM

## 1. ¿Qué ventajas concretas ofrece Prisma frente a escribir SQL en crudo en este proyecto?

Prisma te da autocompletado en el IDE: escribes `prisma.pelicula.` y ya ves todos los métodos disponibles. Con SQL crudo estás tirando comandos a ciegas y rezando porque no haya typos.

También maneja las relaciones con un simple `include: { director: true }` —en SQL crudo estarías escribiendo JOINs hasta el infinito.

## 2. ¿Qué hace `prisma.$transaction([query1, query2])`? ¿En qué se diferencia de `prisma.$transaction(async (tx) => { ... })`?

El primero (`[query1, query2]`) ejecuta todo en paralelo. Útil cuando las consultas no se necesitan entre sí.

El segundo (`async (tx) => {...}`) ejecuta paso a paso, usando el resultado de una operación en la siguiente. Lo necesitas cuando creas un director y luego usas su ID para la película.

## 3. ¿Qué archivo NO deberías commitear nunca al repositorio de tu schema de Prisma? ¿Y cuáles sí deben estar en el repositorio?

**Nunca commitear:** `.env` — ahí viven tus contraseñas y URLs de base de datos. Ese archivo es solo tuyo.

**Sí commitear:** `schema.prisma` (la estructura de tu BD), `package.json` y el `.gitignore`.

## Reflexiones Adicionales

### Beneficios observados durante la migración:

1. **Menos código repetitivo**: No necesitamos escribir SQL manualmente para CRUD básico
2. **Manejo automático de errores**: Prisma lanza errores descriptivos para constraint violations
3. **Migraciones versionadas**: Prisma trackea automáticamente los cambios en el schema
4. **Seed data**: Facilidad para poblar la base de datos con datos de prueba
5. **Studio**: Interface visual para explorar y modificar datos

### Consideraciones de rendimiento:

1. **N+1 queries**: Prisma ayuda a evitar este problema con `include` y `select`
2. **Conexión pool**: Prisma maneja automáticamente el pool de conexiones
3. **Query optimization**: Las queries generadas son optimizadas automáticamente

### Conclusión

Prisma ORM simplifica significativamente el desarrollo de APIs con bases de datos relacionales, proporcionando type safety, mejor mantenibilidad y herramientas de desarrollo que aceleran el proceso de desarrollo.
