const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get all vocab items
  const allVocab = await prisma.vocabularyItem.findMany();
  console.log(`Found ${allVocab.length} vocab items`);

  // Get all users
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    // Get their existing card item IDs
    const existing = await prisma.userSRSCard.findMany({
      where: { user_id: user.id },
      select: { item_id: true }
    });
    const existingIds = new Set(existing.map(c => c.item_id));
    
    // Seed missing cards
    const missing = allVocab.filter(v => !existingIds.has(v.id));
    if (missing.length > 0) {
      await prisma.userSRSCard.createMany({
        data: missing.map(item => ({
          user_id: user.id,
          item_id: item.id,
          due_date: new Date(), // All due now
        })),
      });
      console.log(`Added ${missing.length} SRS cards for user ${user.email}`);
    } else {
      console.log(`User ${user.email} already has all cards`);
    }
  }

  const total = await prisma.userSRSCard.count();
  console.log(`Total SRS cards now: ${total}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
