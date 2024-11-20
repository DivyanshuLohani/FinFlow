import "server-only";
export const EMAIL_VERIFICATION_DISABLED =
  process.env.EMAIL_VERIFICATION_DISABLED === "true" ? true : false;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GITHUB_ID = process.env.GITHUB_ID;
export const GITHUB_SECRET = process.env.GITHUB_SECRET;

export const GITHUB_AUTH_ENABLED = GITHUB_ID && GITHUB_SECRET ? true : false;
export const GOOGLE_AUTH_ENABLED =
  GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET ? true : false;

export const defaultCategories = [
  {
    name: "Groceries",
    type: "EXPENSE",
    budget: {
      amount: 8000, // Average monthly grocery expense
    },
  },
  {
    name: "Transportation",
    type: "EXPENSE",
    budget: {
      amount: 3000, // Local transport, fuel, or cab expenses
    },
  },
  {
    name: "Rent",
    type: "EXPENSE",
    budget: {
      amount: 15000, // Average monthly rent
    },
  },
  {
    name: "Electricity & Utilities",
    type: "EXPENSE",
    budget: {
      amount: 3000, // Electricity, water, and gas bills
    },
  },
  {
    name: "Internet & Phone",
    type: "EXPENSE",
    budget: {
      amount: 1500, // Broadband and mobile bills
    },
  },
  {
    name: "Healthcare",
    type: "EXPENSE",
    budget: {
      amount: 2000, // Doctor visits, medicines
    },
  },
  {
    name: "Education",
    type: "EXPENSE",
    budget: {
      amount: 5000, // Tuition fees, books, or school expenses
    },
  },
  {
    name: "Shopping",
    type: "EXPENSE",
    budget: {
      amount: 3000, // Clothing and accessories
    },
  },
  {
    name: "Dining Out",
    type: "EXPENSE",
    budget: {
      amount: 2000, // Eating out or ordering in
    },
  },
  {
    name: "Travel",
    type: "EXPENSE",
    budget: {
      amount: 5000, // Vacations or long-distance travel
    },
  },
  {
    name: "Miscellaneous",
    type: "EXPENSE",
    budget: {
      amount: 1000, // Unplanned or one-off expenses
    },
  },
  {
    name: "Salary",
    type: "INCOME",
    budget: {
      amount: 50000, // Monthly salary
    },
  },
  {
    name: "Freelancing",
    type: "INCOME",
    budget: {
      amount: 15000, // Earnings from freelance work
    },
  },
  {
    name: "Investments",
    type: "INCOME",
    budget: {
      amount: 5000, // Returns on investments
    },
  },
  {
    name: "Gifts",
    type: "INCOME",
    budget: {
      amount: 2000, // Monetary gifts from family/friends
    },
  },
];
