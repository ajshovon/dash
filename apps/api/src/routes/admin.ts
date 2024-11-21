import { zValidator } from '@hono/zod-validator';
import { Pool } from '@neondatabase/serverless';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { HTTPException } from 'hono/http-exception';
import { decode } from 'hono/jwt';
import { z } from 'zod';
import * as schema from '../db/schema';
import { hashPassword, verifyPassword } from '../lib/hashPassword';
import HonoBindings from '../types/bindings';

const admin = new Hono<{ Bindings: HonoBindings }>();

// Schemas
const NewLinkSchema = z
  .object({
    destination: z.string().min(3, { message: 'This field has to be filled.' }),
    shortLink: z.string().min(3, { message: 'This field has to be filled.' }),
  })
  .strict();

// Schemas
const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(3, { message: 'This field has to be filled.' }),
    confirmNewPassword: z.string().min(3, { message: 'This field has to be filled.' }),
  })
  .strict();

const UpdateLinkSchema = NewLinkSchema.partial();

// New link route
admin.post('/new', zValidator('json', NewLinkSchema), async (c) => {
  const { destination, shortLink } = c.req.valid('json');
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const testLink = await findByShortLink(c, shortLink);
  if (testLink) throw new HTTPException(409);
  await db.insert(schema.links).values({ dest: destination, slug: shortLink }).execute();
  return c.json({ status: 'Created Successfully' }, 201);
});

// Get all links route
admin.get('/links', async (c) => {
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const allLinks = await db.select().from(schema.links);
  return c.json({ status: 'ok', data: allLinks, count: allLinks.length });
});

// Analytics route
admin.get('/analytics', async (c) => {
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });

  const { startDate, endDate } = c.req.query();
  let start;
  let end;
  if (startDate === endDate) {
    start = new Date(startDate);
    end = new Date(Date.now() + 24 * 60 * 60 * 1000);
  } else {
    start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    end = endDate ? new Date(endDate) : new Date();
  }

  const dateFilter = sql`${schema.stats.createdAt} >= ${start.toISOString()} AND ${schema.stats.createdAt} < ${end.toISOString()}`;

  // Top 5 clicked links
  const top5Clicks = await db
    .select({
      id: schema.links.id,
      slug: schema.links.slug,
      clicks: schema.links.clicks,
    })
    .from(schema.links)
    .where(sql`${schema.links.createdAt} >= ${start.toISOString()} AND ${schema.links.createdAt} < ${end.toISOString()}`)
    .orderBy(sql`${schema.links.clicks} DESC`)
    .limit(5);

  // Top 5 countries
  const top5Countries = await db
    .select({
      country: schema.stats.country,
      visits: sql`COUNT(*)`.as('visits'),
    })
    .from(schema.stats)
    .where(sql`${schema.stats.country} != 'Unknown' AND ${dateFilter}`)
    .groupBy(schema.stats.country)
    .orderBy(sql`visits DESC`)
    .limit(5);

  // Top 5 referrers
  const top5Referrers = await db
    .select({
      referrer: schema.stats.referrer,
      visits: sql`COUNT(*)`.as('visits'),
    })
    .from(schema.stats)
    .where(sql`${schema.stats.referrer} != 'Unknown' AND ${dateFilter}`)
    .groupBy(schema.stats.referrer)
    .orderBy(sql`visits DESC`)
    .limit(5);

  // Top 5 devices
  const top5Devices = await db
    .select({
      device: schema.stats.device,
      visits: sql`COUNT(*)`.as('visits'),
    })
    .from(schema.stats)
    .where(sql`${schema.stats.device} != 'Unknown' AND ${dateFilter}`)
    .groupBy(schema.stats.device)
    .orderBy(sql`visits DESC`)
    .limit(5);

  // Top 5 browsers
  const top5Browsers = await db
    .select({
      browser: schema.stats.browser,
      visits: sql`COUNT(*)`.as('visits'),
    })
    .from(schema.stats)
    .where(sql`${schema.stats.browser} != 'Unknown' AND ${dateFilter}`)
    .groupBy(schema.stats.browser)
    .orderBy(sql`visits DESC`)
    .limit(5);

  // Clicks per day for the date range (for graph)
  const clicksPerDay = await db
    .select({
      date: sql`DATE(${schema.stats.createdAt})`.as('date'),
      clicks: sql`COUNT(*)`.as('clicks'),
    })
    .from(schema.stats)
    .where(dateFilter)
    .groupBy(sql`DATE(${schema.stats.createdAt})`)
    .orderBy(sql`DATE(${schema.stats.createdAt}) ASC`);

  return c.json({
    status: 'ok',
    top5Clicks,
    top5Countries,
    top5Referrers,
    top5Devices,
    top5Browsers,
    clicksPerDay,
  });
});

// Change password
admin.patch('/change-password', zValidator('json', changePasswordSchema), async (c) => {
  const jwtPayload = c.req.header('Authorization');
  if (!jwtPayload) throw new HTTPException(401, { message: 'Authorization header is missing' });
  const token = jwtPayload.split(' ')[1];
  const decoded = decode(token);
  const username = decoded.payload.sub as string;
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const { oldPassword, confirmNewPassword } = c.req.valid('json');
  // const user = await db.select().from(schema.users).where(eq(schema.users.id, 1)).get();
  const user = await db.query.users.findFirst({
    where: (users) => eq(users.username, username),
  });

  if (!user) throw new HTTPException(404);
  const isMatch = await verifyPassword(user.hash, oldPassword);
  if (!isMatch) throw new HTTPException(401);
  const newHash = await hashPassword(confirmNewPassword);
  await db.update(schema.users).set({ hash: newHash }).where(eq(schema.users.id, 1)).execute();
  return c.json({ status: 'Password Changed Successfully' });
});

// Get one link route
admin.get('/link/:id', async (c) => {
  const id = c.req.param('id');
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const targetLink = await db.query.links.findFirst({
    where: (links) => eq(links.id, +id),
    with: {
      stats: true,
    },
  });
  if (!targetLink) throw new HTTPException(404);
  return c.json({ status: 'ok', data: targetLink, count: targetLink.stats.length });
});

// Update a link route
admin.patch('/link/:id', zValidator('json', UpdateLinkSchema), async (c) => {
  const { destination, shortLink } = c.req.valid('json');
  const id = c.req.param('id');
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const kv = env(c).KV;
  const targetLink = await findById(c, +id);
  if (!targetLink) throw new HTTPException(404);
  await kv.delete(targetLink.slug);
  await db.update(schema.links).set({ dest: destination, slug: shortLink }).where(eq(schema.links.id, +id)).execute();
  return c.json({ status: 'Updated Successfully' });
});

// Delete a link route
admin.delete('/link/:id', async (c) => {
  const id = c.req.param('id');
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const kv = env(c).KV;
  const targetLink = await findById(c, +id);
  if (!targetLink) throw new HTTPException(404);
  await kv.delete(targetLink.slug);
  await db.delete(schema.stats).where(eq(schema.stats.linkId, targetLink.slug)).execute();
  await db.delete(schema.links).where(eq(schema.links.id, +id)).execute();
  return c.json({ status: 'Deleted Successfully' });
});

// Events route
admin.get('/clicks', async (c) => {
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const allStats = await db
    .select()
    .from(schema.stats)
    .orderBy(sql`created_at DESC`);
  return c.json({ status: 'ok', data: allStats, count: allStats.length });
});

export default admin;

// Helper functions
// find by short link
async function findByShortLink(c: any, shortLink: string) {
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  // const link = await db.select().from(schema.links).where(eq(schema.links.slug, shortLink)).get();
  const link = await db.query.links.findFirst({
    where: (links) => eq(links.slug, shortLink),
  });
  return link;
}
// find by id
async function findById(c: any, id: number) {
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  // const link = await db.select().from(schema.links).where(eq(schema.links.id, id)).get();
  const link = await db.query.links.findFirst({
    where: (links) => eq(links.id, id),
  });
  return link;
}
