import "server-only";
import { CategoryType, Prisma } from "@prisma/client";
import {
  TUser,
  TUserCreateInput,
  TUserUpdateInput,
  ZUserCreateInput,
  ZUserUpdateInput,
} from "@/types/user";
import { validateInputs } from "../utils/validate";
import { prisma } from "../database/prisma";
import { ZId } from "@/types/common";
import { z } from "zod";
import { DatabaseError, ResourceNotFoundError } from "@/types/errors";
import { defaultCategories } from "../constants";

const responseSelection = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true,
};

// function to retrive basic information about a user's user
export const getUser = async (id: string) => {
  validateInputs([id, ZId]);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: responseSelection,
    });

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  validateInputs([email, z.string().email()]);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: responseSelection,
    });

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

// export const getUserByEmail = reactCache((email: string) =>
//   cache(async () => {
//     validateInputs([email, z.string().email()]);

//     try {
//       const user = await prisma.user.findUnique({
//         where: {
//           email,
//         },
//         select: responseSelection,
//       });

//       if (!user) {
//         return null;
//       }
//       return user;
//     } catch (error) {
//       if (error instanceof Prisma.PrismaClientKnownRequestError) {
//         throw new DatabaseError(error.message);
//       }

//       throw error;
//     }
//   })
// );

// function to update a user's user
export const updateUser = async (
  personId: string,
  data: TUserUpdateInput
): Promise<TUser> => {
  validateInputs([personId, ZId], [data, ZUserUpdateInput.partial()]);

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: personId,
      },
      data: data,
      select: responseSelection,
    });

    return updatedUser as TUser;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2016"
    ) {
      throw new ResourceNotFoundError("User", personId);
    }
    throw error; // Re-throw any other errors
  }
};

const deleteUserById = async (id: string): Promise<TUser> => {
  validateInputs([id, ZId]);

  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
      select: responseSelection,
    });

    return user as TUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const createUser = async (data: TUserCreateInput): Promise<TUser> => {
  validateInputs([data, ZUserCreateInput]);
  try {
    const user = await prisma.user.create({
      data,
      select: responseSelection,
    });

    await prisma.category.createMany({
      data: defaultCategories.map((category) => ({
        ...category,
        type: category.type as CategoryType,
        userId: user.id,
        budget: {
          create: {
            amount: category.budget.amount,
            startDate: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ),
            endDate: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ),
          },
        },
      })),
    });

    return user as TUser;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new DatabaseError("User with this email already exists");
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

// function to delete a user's user including organizations
export const deleteUser = async (id: string): Promise<TUser> => {
  validateInputs([id, ZId]);

  try {
    const deletedUser = await deleteUserById(id);

    return deletedUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};
