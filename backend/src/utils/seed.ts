import prisma from '../config/database';

const propFirms = [
  'FTMO',
  'The5ers',
  'TopStep',
  'MyForexFunds',
  'FundedNext',
  'E8 Funding',
  'Apex Trader Funding',
  'Fidelcrest',
  'SurgeTrader',
  'The Funded Trader',
  'City Traders Imperium',
  'Funded Trading Plus',
  'BluFx',
  'Lux Trading Firm',
  'Funding Pips',
];

async function seed() {
  console.log('Starting to seed prop firms...');

  for (const firmName of propFirms) {
    try {
      const existing = await prisma.propFirm.findUnique({
        where: { name: firmName },
      });

      if (!existing) {
        await prisma.propFirm.create({
          data: { name: firmName },
        });
        console.log(`Created prop firm: ${firmName}`);
      } else {
        console.log(`Prop firm already exists: ${firmName}`);
      }
    } catch (error) {
      console.error(`Error creating prop firm ${firmName}:`, error);
    }
  }

  console.log('Seeding completed!');
  await prisma.$disconnect();
}

seed()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
