import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!, { logger: true });

async function main() {



}


main()
