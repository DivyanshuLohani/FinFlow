export async function createTransaction(data: any) {
  try {
    const newTransaction = await fetch("/api/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return newTransaction.json();
  } catch (error) {
    throw error;
  }
}

export async function updateTransaction(id: string, data: any) {
  try {
    const updatedTransaction = await fetch(`/api/v1/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return updatedTransaction.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteTransaction(id: string) {
  try {
    await fetch(`/api/v1/transactions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
}
