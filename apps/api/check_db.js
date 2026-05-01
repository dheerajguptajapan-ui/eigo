const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, display_name: true } });
  const vocab = await prisma.vocabularyItem.count();
  const cards = await prisma.userSRSCard.count();
  console.log('Users:', JSON.stringify(users, null, 2));
  console.log('VocabItems:', vocab);
  console.log('SRSCards:', cards);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
