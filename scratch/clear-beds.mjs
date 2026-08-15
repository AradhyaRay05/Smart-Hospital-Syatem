import pg from "pg";
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  const res1 = await client.query('DELETE FROM "BedStatusLog";');
  const res2 = await client.query('DELETE FROM "Bed";');
  const res3 = await client.query('DELETE FROM "Ward";');
  console.log(`Cleared dummy data cleanly from Neon PostgreSQL: ${res1.rowCount} logs, ${res2.rowCount} beds, ${res3.rowCount} wards deleted.`);
}

main()
  .catch(console.error)
  .finally(() => client.end());
