"use server";

import { getAdminData, getUsers } from "@/lib/admin/service";

export async function fetchAdminData() {
  try {
    const adminData = await getAdminData();
    return adminData;
  } catch {
    return {
      totalUsers: 0,
      totalTransactions: 0,
      totalExpense: 0,
      totalIncome: 0,
    };
  }
}

export async function fetchUsers() {
  try {
    const users = await getUsers();
    return users;
  } catch {
    return [];
  }
}
