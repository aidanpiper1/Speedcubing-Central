import bcrypt from 'bcryptjs';
import { prisma } from './prisma.js';
import { getScramble } from './scramble.js';
import { EVENT_IDS } from '@scc/shared';

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminEmail = 'admin@speedcubing.central';
  const passwordHash = await bcrypt.hash('admin1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: { email: adminEmail, passwordHash, displayName: 'Admin', role: 'ADMIN' },
  });
  console.log(`  Admin user: ${adminEmail} / admin1234`);

  // Demo user with a session and some solves
  const demoHash = await bcrypt.hash('demo1234', 10);
  const demo = await prisma.user.upsert({
    where: { email: 'demo@speedcubing.central' },
    update: {},
    create: { email: 'demo@speedcubing.central', passwordHash: demoHash, displayName: 'Demo Cuber', role: 'USER' },
  });

  const existingSession = await prisma.session.findFirst({ where: { userId: demo.id } });
  if (!existingSession) {
    const session = await prisma.session.create({
      data: { userId: demo.id, eventId: '333', name: 'Main 3x3' },
    });
    const times = [12340, 11890, 13560, 10920, 14200, 12010, 11540];
    for (const t of times) {
      await prisma.solve.create({
        data: { sessionId: session.id, userId: demo.id, time: t, scramble: "R U R' U'", penalty: 'NONE' },
      });
    }
    console.log('  Demo session with sample solves created.');
  }

  // Today's daily scrambles for a few events
  const today = new Date().toISOString().slice(0, 10);
  const dateObj = new Date(`${today}T00:00:00.000Z`);
  for (const eventId of ['333', '222', '444', 'pyram']) {
    await prisma.dailyScramble.upsert({
      where: { date_eventId: { date: dateObj, eventId } },
      update: {},
      create: { date: dateObj, eventId, scramble: await getScramble(eventId) },
    });
  }
  console.log(`  Daily scrambles seeded for ${today}.`);
  void EVENT_IDS;
  void admin;

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
