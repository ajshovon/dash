import { Pool } from '@neondatabase/serverless';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import * as schema from './db/schema';
import admin from './routes/admin';
import auth from './routes/auth';
import HonoBindings from './types/bindings';

const app = new Hono<{ Bindings: HonoBindings }>();
app.use(logger());
app.use(secureHeaders());
app.use('/*', cors());

// Auth routes
app.route('/api/auth', auth);

// JWT middleware
app.use('/api/admin/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: env(c).JWT_SECRET,
  });
  return jwtMiddleware(c, next);
});

app.route('/api/admin', admin);

app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const kv = env(c).KV;
  const kvData = await kv.get(id);
  if (kvData) {
    console.log('Served from KV');
    c.executionCtx.waitUntil(addStat(c, link.slug));
    return c.redirect(kvData);
  }

  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  // const link = await db.select().from(links).where(eq(links.slug, id)).execute().get();
  const link = await db.query.links.findFirst({
    where: (links) => eq(links.slug, id),
  });
  if (!link) {
    throw new HTTPException(404);
  } else {
    console.log('Served from database');
    await kv.put(id, link.dest, { expirationTtl: 60 * 60 * 24 * 30 });

    c.executionCtx.waitUntil(addStat(c, link.slug));

    return c.redirect(link.dest);
  }
});

async function addStat(c: any, linkId: string) {
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const userAgent = c.req.header('user-agent') || 'Unknown';
  const country = c.req.header('CF-IPCountry') || 'Unknown';
  const referrer = c.req.header('referer') || 'Unknown';
  const deviceType = getDeviceType(userAgent);
  const browserName = getBrowserName(userAgent);

  // Insert a new stat with referrer information
  await db
    .insert(schema.stats)
    .values({
      linkId,
      country,
      device: deviceType,
      browser: browserName,
      referrer,
    })
    .execute();

  // Increment the click count for the link
  await db
    .update(schema.links)
    .set({
      clicks: sql`${schema.links.clicks} + 1`,
    })
    .where(eq(schema.links.slug, linkId))
    .execute();
}

// Function to detect device type from user-agent
const getDeviceType = (userAgent: any) => {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'Tablet';
  return 'Desktop'; // Default to Desktop if no match
};

// Function to detect browser name from user-agent
const getBrowserName = (userAgent: any) => {
  if (/chrome|chromium|crios/i.test(userAgent)) return 'Chrome';
  if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent) && !/chrome|chromium|crios/i.test(userAgent)) return 'Safari';
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/opr\//i.test(userAgent)) return 'Opera';
  return 'Other'; // Default if no specific match
};

export default app;
