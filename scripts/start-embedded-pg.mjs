// Dev-only: start a throwaway embedded Postgres for verification.
import EmbeddedPostgres from 'embedded-postgres';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pg = new EmbeddedPostgres({
  databaseDir: path.resolve(__dirname, '../.pgdata'),
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  persistent: true,
});

const action = process.argv[2];

if (action === 'init') {
  await pg.initialise();
  await pg.start();
  try {
    await pg.createDatabase('speedcubing');
  } catch {
    /* already exists */
  }
  console.log('Embedded Postgres initialised + started on 5432, db "speedcubing".');
  await pg.stop();
  process.exit(0);
} else {
  // start and keep running
  await pg.start();
  console.log('Embedded Postgres running on 5432.');
  process.on('SIGINT', async () => {
    await pg.stop();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    await pg.stop();
    process.exit(0);
  });
}
