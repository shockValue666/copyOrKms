import { PgTable,integer,pgTable,uuid,text,timestamp,varchar } from "drizzle-orm/pg-core";
import { users } from "../../../migrations/schema";



export const profiles = pgTable("profiles",{
    id:uuid('id').defaultRandom().primaryKey().notNull(),//edw einai to provilma me to id lol
    referenceId:varchar('reference_id',{length:256}),
    fullName:text('full_name'),
    phone:varchar('phone',{length:256})
})

export const folders = pgTable("folders",{
    id:uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt:timestamp("created_at",{
        withTimezone:true,
        mode:"string"        
    }).defaultNow().notNull(),
    title:text('title').notNull(),
    iconId:text('icon_id').notNull(),
    data:text('data'),
    inTrash:text("in_trash"),
    bannerUrl:text("banner_url"),
    folderOwner:uuid('folder_owner').notNull().references(()=>users.id,{onDelete:"cascade"}),
});


export const files = pgTable("files",{
    id:uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt:timestamp("created_at",{
        withTimezone:true,
        mode:"string"        
    }).defaultNow().notNull(),
    title:text('title').notNull(),
    iconId:text('icon_id').notNull(),
    data:text('data'),
    inTrash:text("in_trash"),
    bannerUrl:text("banner_url"),
    folderId:uuid('folder_id').notNull().references(()=>folders.id,{onDelete:"cascade"}),
})


export const collaborators = pgTable('collaborators', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    folderId: uuid('folder_id')
        .notNull()
        .references(() => folders.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', {
        withTimezone: true,
        mode: 'string',
    })
        .defaultNow()
        .notNull(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
});