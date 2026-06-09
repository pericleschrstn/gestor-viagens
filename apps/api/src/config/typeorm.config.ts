import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'gestor',
    password: process.env.DB_PASSWORD ?? 'G3st0r_V1ag3ns_D3v!2026',
    database: process.env.DB_DATABASE ?? 'gestor',
    autoLoadEntities: true,
    synchronize: false,
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: process.env.NODE_ENV === 'production',
  }),
);
