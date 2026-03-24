import { prisma } from "../index.ts";
import { authService } from "./authService.ts";
import { AppError } from "../utils/errorHandler.ts";
import type { IUserInput, IUser } from "../types/user.ts";

export const userService = {
  // Create a user record
  createUser: async (data: IUserInput): Promise<IUser> => {
    // Ensure the email is unused
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(400, "User already exists with this email", true);
    }

    // Encrypt the incoming password
    const hashedPassword = await authService.hashPassword(data.password);

    // Persist the new user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });

    return user as unknown as IUser;
  },

  // Find a user by numeric id
  getUserById: async (id: number): Promise<IUser | null> => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user as unknown as IUser;
  },

  // Find a user by email address
  getUserByEmail: async (email: string): Promise<IUser | null> => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user as unknown as IUser;
  },

  // Update basic profile fields
  updateUser: async (id: number, data: Partial<IUserInput>): Promise<IUser> => {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
      },
    });
    return user as unknown as IUser;
  },

  // List all users (admin only)
  getAllUsers: async (): Promise<IUser[]> => {
    const users = await prisma.user.findMany();
    return users as unknown as IUser[];
  },
};
