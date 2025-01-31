import { getCategories } from "@/lib/transaction/service";
import TransactionList from "./components/TransactionList";

export default async function TransactionsPage() {
  const categories = await getCategories();
  return <TransactionList categories={categories} />;
}
