
# Finflow

![Finflow Placeholder Image](https://github.com/user-attachments/assets/91bc7556-c92f-4ddb-9750-a5470c8a3bf5)

**Finflow** is a powerful expense tracker that helps you monitor your expenses and manage your income effectively. Choose between default categories or create your own for a personalized experience.

## Features

- **Expense/Income Addition**: Easily add and categorize your expenses and income.
- **Customized Reports**: Generate detailed reports for your transactions.
- **Graphs and Charts**: Visualize your spending with graph comparisons and pie charts.
- **Data Export**: Export your transaction data for external use.

### Upcoming Features

- **Recurring Transactions**: Automate frequent expenses or income.
- **Budget Management**: Set and track spending limits for specific categories.
- **Multi-Currency Support**: Handle expenses and income in different currencies.
- **Mobile App Integration**: Access Finflow on the go with a companion mobile app.

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgREST](https://img.shields.io/badge/Postgres-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

---

## Local Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **PostgreSQL** database

### Steps to Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/finflow.git
   cd finflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database using Prisma:
   ```bash
   npx prisma migrate dev
   ```

4. Copy the environment file and configure:
   ```bash
   cp .env.example .env
   ```
   Fill in the necessary details in the `.env` file, such as your database connection string and other configurations.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open the app in your browser at `http://localhost:3000`.

---

## Contributing

We welcome contributions! Please open an issue or submit a pull request to suggest features or fixes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.