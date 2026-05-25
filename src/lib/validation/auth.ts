import { error } from "console";
import { email, z } from "zod";

const passwordSchema = z.string()
                        .min(8, {message: "Password should be of minimumn 8 characthers"})
                        .max(100, {message: "Password should be of maximumn 100 characthers"})
                        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
                        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
                        .regex(/[0-9]/, {message: "Password must contain at least one number"});

export const LoginSchema = z.object({
    username: z.string({error: "Enter a valid username"})
            .min(1, {message: "Username is required"}),
    
    password: z.string().min(1, {error: "Password is required"})         
})

export const RegistrationSchema = z.object({
    username: z.string()
                .min(8, {error: "Username should be of minimumn 8 characthers"})
                .max(100, {error: "Username should be of maximumn 100 characthers"})
                .regex( /^[a-zA-Z0-9]+$/, {error: "Username should contain only numbers and alphabets no symbols"}),
    password: passwordSchema
})

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegistrationSchema>