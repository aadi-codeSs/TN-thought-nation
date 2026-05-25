import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";



export const {handlers, auth, signIn, signOut} = NextAuth({

    adapter: PrismaAdapter(prisma),

    session: {
        strategy: "jwt",
    },

    // pages: {
    //     signIn: "/login",
    //     error:  "/login",
    // },   

    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Type your username here !" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials){

                if(!credentials?.username || !credentials?.password){
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username as string },
                });

                if (!user || !user.password){
                    return null;
                } 

                const isPasswordValid = await bcrypt.compare( credentials.password as string, user.password );
                if( !isPasswordValid ) return null;

                return { 
                    id: user.id.toString(),  
                    email: user.email 
                };
                     
            },
        }),
    ],
    callbacks: {
        async jwt({user, token, trigger, session}) {
            if(user){
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },

        async session({session, token}){
            if (token && session.user) {
            (session.user as any).id = token.id;
            (session.user as any).role = token.role;
      }
      return session;
        }

    },

    secret: process.env.NEXTAUTH_SECRET,

})