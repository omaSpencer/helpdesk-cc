import { PrismaClient, TicketPriority, TicketStatus } from '@prisma/client';

const prisma = new PrismaClient();

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();

  const statuses: TicketStatus[] = [
    TicketStatus.OPEN,
    TicketStatus.IN_PROGRESS,
    TicketStatus.RESOLVED,
    TicketStatus.CLOSED,
  ];
  const priorities: TicketPriority[] = [
    TicketPriority.LOW,
    TicketPriority.MEDIUM,
    TicketPriority.HIGH,
    TicketPriority.URGENT,
  ];

  for (let i = 1; i <= 15; i++) {
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: `TCK-${String(i).padStart(4, '0')}`,
        title: `Sample Ticket #${i}`,
        description: `This is a sample ticket number ${i}.`,
        status: statuses[randomInt(0, statuses.length - 1)],
        priority: priorities[randomInt(0, priorities.length - 1)],
      },
    });

    const commentsToCreate = randomInt(0, 3);
    for (let c = 0; c < commentsToCreate; c++) {
      await prisma.comment.create({
        data: {
          ticketId: ticket.id,
          author: `User ${randomInt(1, 5)}`,
          body: `Comment ${c + 1} on ticket ${i}`,
        }
      });
    }
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
