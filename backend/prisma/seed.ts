import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const url = new URL(connectionString);
const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port || '5432'),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
});

async function main() {
  const teacherId = 'user-123-456';
  const email = 'teacher@test.com';

  const client = await pool.connect();
  try {
    // Check if user exists
    const res = await client.query('SELECT id FROM "User" WHERE email = $1', [
      email,
    ]);

    if (res.rows.length === 0) {
      // Create user
      await client.query(
        `INSERT INTO "User" (id, email, password, "fullName", "phone", "createAt", "updateAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [teacherId, email, 'password123', 'Test Teacher', '0123456789'],
      );
      console.log(`Created teacher with ID: ${teacherId}`);
    } else {
      console.log(`Teacher already exists with ID: ${res.rows[0].id}`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
