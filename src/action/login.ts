"use server";

import { LoginSchema } from "../lib/validation/auth";
import { AuthError } from "next-auth";

export interface LoginActionResponse {
    success: boolean;
    message: string;
}

export async function loginUser(values: unknown): Promise<LoginActionResponse>{
    try{
        const validatedFields = LoginSchema.safeParse(values);

        if(!validatedFields.success){
            return{
                success: false,
                message: "Invalid input fields provided. Please verify your data entry."
            };
        }

        return {
            success: true,
            message: "Credentials verified successfully."
        };
    }
    catch(error){
        console.error("CRITICAL_LOGIN_ACTION_FAILURE", error);
        return {
            success: false,
            message: "An unexpected error occurred during authetication processing."
        }
    }
}