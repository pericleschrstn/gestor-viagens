import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const bcrypt = require('bcrypt')
const pg = require('pg')

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Uso: node scripts/reset-password.mjs <email> <senha>')
  process.exit(1)
}

const client = new pg.Client({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USERNAME ?? 'gestor',
  password: process.env.DB_PASSWORD ?? 'G3st0r_V1ag3ns_D3v!2026',
  database: process.env.DB_DATABASE ?? 'gestor',
})

await client.connect()

const hash = await bcrypt.hash(password, 10)
const result = await client.query(
  'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email',
  [hash, email],
)

if (result.rowCount === 0) {
  console.error(`Usuário não encontrado: ${email}`)
  await client.end()
  process.exit(1)
}

const row = await client.query('SELECT password_hash FROM users WHERE email = $1', [
  email,
])
const ok = await bcrypt.compare(password, row.rows[0].password_hash)

console.log(`Senha atualizada para ${email}`)
console.log(`Verificação: ${ok ? 'ok' : 'falhou'}`)

await client.end()
