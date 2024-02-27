import { PgTable,integer,pgTable,serial,text,timestamp,varchar } from "drizzle-orm/pg-core";



export const users = pgTable("users",{
    id:serial('id').primaryKey(),
    fullName:text('full_name'),
    phone:varchar('phone',{length:256})
})

export const posts = pgTable("posts",{
    id:serial('id').primaryKey(),
    title:varchar('title',{length:256}),
    content:text('content'),    
    createdAt:timestamp('created_at').notNull().defaultNow(),
    createdBy:integer('created_by').references(()=>users.id)
})

export const comments = pgTable("comments",{
    id:serial('id').primaryKey(),
    postId:integer('post_id').references(()=>posts.id),
    content:text('content')
})