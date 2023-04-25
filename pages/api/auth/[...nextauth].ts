import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDatabase } from "../../../lib/mongodb";

export const authOptions: NextAuthOptions = {
  //using jwt auth
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  //using only email/password auth for this application, assuming user will provide valid email so no verification added
  providers: [
    CredentialsProvider({
      name: "link-shortener",
      credentials: {},
      async authorize(credentials: any) {
        //Connect to DB
        const { db } = await connectToDatabase();
        try {
          //Get all the users
          const users = await db.collection("users");
          //Find user with the email
          console.log("users", users);
          const result: any = await users.findOne({
            email: credentials.email,
          });
          //Not found - send error res
          if (!result) {
            throw new Error("No user found with the email");
            // return { error: "No user found" };
          }
          //Check hased password with DB password
          const checkPassword = await compare(
            credentials.password,
            result.password
          );
          //Incorrect password - send response
          if (!checkPassword) {
            throw new Error("Password doesn't match");
          }
          //Else send success response
          return result;
        } catch (err) {
          console.log(err);
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
