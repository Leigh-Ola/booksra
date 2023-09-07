## Source:
### https://dev.to/francescoxx/typescript-crud-rest-api-using-nestjs-typeorm-postgres-docker-and-docker-compose-33al

npm install -g @nestjs/cli
nest new booksra
npm i pg typeorm @nestjs/typeorm @nestjs/config
nest g module users
nest g controller users
nest g service users
touch src/users/user.entity.ts

Run create:db:migrations to create a new migration file with the name you provided.
Run generate:db:migrations to create a valid migration file based on the entities you created or modified since the last migration.
Run run:db:migrations to run all pending migrations.
Run revert:db:migrations to revert the last migration.
Run sync:db:migrations to synchronize the database schema with the entities (create tables, add columns, etc).
Run show:db:migrations to show all migrations and their status.

________________________
NEON.TECH:
- Free PostGres DB hosting
- Connection Help here: https://neon.tech/docs/connect/connect-from-any-app
- NOTES: 1gb size, point-in-time recovery, automated backups
__
SUPABASE:
- Free PostGres DB hosting
- Connection Help here: https://supabase.com/docs/guides/database/connecting-to-postgres
- Pricing and limits here: https://supabase.com/pricing
- NOTES: 500mb size, no point-in-time recovery, 5gb bandwidth/month, 1gb file storage (max 50mb/file)
___
RENDER.COM:
- Backend Nodejs hosting
________________________