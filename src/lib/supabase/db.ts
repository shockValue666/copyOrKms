import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { profiles } from '../../../migrations/schema'
import * as schema from '../../../migrations/schema';

const connectionString = process.env.DATABASE_URL  // Supabase connection string here
const client = postgres(connectionString as string)
export const db = drizzle(client,{schema});

const fetchUsers = async () => {
    try {
        await migrate(db,{migrationsFolder: 'migrations'})
        // const allUsers = await db.select().from(profiles);
        // console.log("All users: ", allUsers);   
    } catch (error) {
        console.log("error at migrating db: ", error)
    }
}

fetchUsers();