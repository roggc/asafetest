import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: await bcrypt.hash("password123", 10),
  },
];

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          console.log("Email and password are required");
          throw new Error("Email y contraseña son requeridos");
        }

        const user = users.find((user) => user.email === credentials.email);
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          console.log("User found and password matches");
          return { id: user.id, name: user.name, email: user.email };
        }
        console.log("User not found or password does not");
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
