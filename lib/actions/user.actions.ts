"use server";

import { signInFormSchema, signUpFormSchema } from "@/lib/validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import type { UpdateUser } from "@/types";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "@/lib/constants";

export async function signInWithCredentials(
  previousState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);
    return { success: true, message: "Sign in success." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid credentials" };
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}

export async function getUserCount() {
  try {
    const userCount = await prisma.user.count();

    return { success: true, userCount };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getUserById(userId: string | undefined) {
  if (!userId) throw new Error("No id passed");
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { name: user.name },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    };
  }
}

export async function updateUser(user: UpdateUser) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    };
  }
}
