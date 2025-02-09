/* eslint-disable @typescript-eslint/no-require-imports */
const {
  PrismaClient,
  TransactionType,
  RecurringType,
} = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await hash("password", 12);

  // Create 5 users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `User ${i}`,
        password: hashedPassword,
        isAdmin: i === 1, // First user is admin
      },
    });
    users.push(user);
  }

  // Categories for each user
  const categoryNames = [
    "Food",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Shopping",
  ];
  const categories = [];

  for (const user of users) {
    for (const name of categoryNames) {
      const category = await prisma.category.create({
        data: {
          name,
          userId: user.id,
          special: false,
        },
      });
      categories.push(category);
    }
  }

  // Generate random date within the last year
  const getRandomDate = () => {
    const end = new Date();
    const start = new Date(
      end.getFullYear() - 1,
      end.getMonth(),
      end.getDate()
    );
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };

  // Generate random amount between 1 and 1000
  const getRandomAmount = () => Math.floor(Math.random() * 1000) + 1;

  // Create 100 transactions for each user
  for (const user of users) {
    const userCategories = categories.filter((cat) => cat.userId === user.id);

    for (let i = 0; i < 100; i++) {
      const isRecurring = Math.random() < 0.2; // 20% chance of being recurring
      const recurringType = isRecurring
        ? Object.values(RecurringType)[
            Math.floor(Math.random() * Object.values(RecurringType).length)
          ]
        : null;

      const nextDate = isRecurring
        ? new Date(getRandomDate().getTime() + 7 * 24 * 60 * 60 * 1000)
        : null; // Add 7 days for recurring

      await prisma.transaction.create({
        data: {
          amount: getRandomAmount(),
          type:
            Math.random() < 0.7
              ? TransactionType.EXPENSE
              : TransactionType.INCOME,
          description: `Transaction ${i + 1}`,
          date: getRandomDate(),
          userId: user.id,
          categoryId:
            userCategories[Math.floor(Math.random() * userCategories.length)]
              .id,
          recurring: isRecurring,
          recurringType,
          nextDate,
          isAddedByRecurring: false,
        },
      });
    }

    // Create a budget for each category
    for (const category of userCategories) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await prisma.budget.create({
        data: {
          amount: 1000,
          startDate,
          endDate,
          userId: user.id,
          categoryId: category.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
