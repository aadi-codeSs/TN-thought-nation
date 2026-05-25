"use server";

import { RegistrationSchema } from "../lib/validation/auth";
import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";

export interface ActionResponse {
    success: boolean;
    message: string;
}

export async function registerUser(values: unknown): Promise<ActionResponse> {
    try{
        const validatedFields = RegistrationSchema.safeParse(values);

        if(!validatedFields.success) {
            const errorMessage = validatedFields.error.issues
                .map((err) => err.message)
                .join(". ");
                return { success: false, message: errorMessage}
        }
        const { username, password } = validatedFields.data;

        const normalisedUsername = username.trim();

        const existingUser = await prisma.user.findUnique({
            where: { username: normalisedUsername },
        });

        if(existingUser) {
            return{ success: false, message: "Account with this username already exists"};
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash( password, saltRounds);

        await prisma.user.create({
            data: {
                username: normalisedUsername,
                password: hashedPassword,
                role: "USER",
            }
        })

        return {
            success: true,
            message: "Account created successfully! You can now log in.",
        };
    } catch (error) {
        console.error("CRITICAL_REGISTRATION_FAILURE:", error);

        return{
            success: false,
            message: "An internal error occured. Please try again"
        };
    } 
}