import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text().notNull().unique(),
  hash: text().notNull(),
});

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  slug: text().notNull().unique(),
  dest: text().notNull(),
  clicks: integer().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const stats = pgTable('stats', {
  id: serial('id').primaryKey(),
  linkId: text()
    .notNull()
    .references(() => links.slug),
  country: text().notNull(),
  browser: text().notNull(),
  device: text().notNull(),
  referrer: text().default('Unknown'), // Add referrer field with default value
  createdAt: timestamp('created_at').notNull().defaultNow(),
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
