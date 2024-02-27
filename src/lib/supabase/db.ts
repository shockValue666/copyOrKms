import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users } from './schema'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

const connectionString = process.env.DATABASE_URL  // Supabase connection string here
const client = postgres(connectionString as string)
export const db = drizzle(client);

const fetchUsers = async () => {
    try {
        await migrate(db,{migrationsFolder: 'migrations'})
        const allUsers = await db.select().from(users);
        console.log("All users: ", allUsers);   
    } catch (error) {
        console.log("error at migrating db: ", error)
    }
}

fetchUsers();