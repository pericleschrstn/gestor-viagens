/**
 * Generates docs/openapi.json from the NestJS Swagger document.
 * Requires database connectivity (TypeORM bootstrap).
 *
 * Usage: pnpm --filter api openapi:generate
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Gestor API')
    .setDescription('API para gestão de gastos em viagens')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const docsDir = join(__dirname, '../../../docs');
  mkdirSync(docsDir, { recursive: true });
  writeFileSync(
    join(docsDir, 'openapi.json'),
    JSON.stringify(document, null, 2),
  );

  await app.close();
  console.log('OpenAPI spec written to docs/openapi.json');
}

void generate().catch((error) => {
  console.error('Failed to generate OpenAPI spec:', error);
  process.exit(1);
});
