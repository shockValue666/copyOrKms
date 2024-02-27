import * as dotenv from 'dotenv';
import {Config} from 'drizzle-kit'
dotenv.config({path:'.env'});

if(!process.env.DATABASE_URL){
    console.log("DATABASE_URL not found in .env file")
}

export default {
    schema:"./src/lib/supabase/schema.ts",
    out:"./migrations",
    driver:'pg',
    dbCredentials:{
        connectionString:process.env.DATABASE_URL || ""
    }
} satisfies Config;