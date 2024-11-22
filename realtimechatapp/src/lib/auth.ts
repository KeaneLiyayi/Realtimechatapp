import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"




export const authConfig: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        })
    ],
    session: {
        strategy: "jwt",

    },
    callbacks: {
        async redirect({ url, baseUrl }) {


            return `${baseUrl}/dashboard`;
        },
    },
    secret: process.env.NEXTAUTH_SECRET as string,
    pages: {
        signIn: "/auth/signin",

    }

}