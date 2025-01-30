import { getCategories } from "@/lib/transaction/service";
import TransactionList from "./components/TransactionList";
import AddIncomeDialog from "../components/AddIncomeDialog";

export default async function TransactionsPage() {
  const categories = await getCategories();
  return <TransactionList categories={categories} />;
}
