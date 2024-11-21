import { relations, sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  hash: text().notNull(),
});

export const links = sqliteTable('links', {
  id: int().primaryKey({ autoIncrement: true }),
  slug: text().notNull().unique(),
  dest: text().notNull(),
  clicks: int().default(0),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export const stats = sqliteTable('stats', {
  id: int().primaryKey({ autoIncrement: true }),
  linkId: text()
    .notNull()
    .references(() => links.slug),
  country: text().notNull(),
  browser: text().notNull(),
  device: text().notNull(),
  referrer: text().default('Unknown'), // Add referrer field with default value
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});

// Define relations
export const linkRelations = relations(links, ({ many }) => ({
  stats: many(stats),
}));

export const statRelations = relations(stats, ({ one }) => ({
  link: one(links, {
    fields: [stats.linkId],
    references: [links.slug],
  }),
}));
