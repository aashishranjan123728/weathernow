import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { createSupabaseServerClient } from "@/lib/supabase";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "you@example.com" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Please enter both email and password");
      }

      const supabase = createSupabaseServerClient();

      // Fetch user (password is stored hashed in a custom users table)
      const { data: user, error } = await supabase
        .from("users")
        .select("id, name, email, password")
        .eq("email", credentials.email.toLowerCase())
        .single();

      if (error || !user) {
        throw new Error("No user found with this email");
      }

      if (!user.password) {
        throw new Error("This account was created with Google Sign-In. Please sign in with Google.");
      }

      const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordMatch) {
        throw new Error("Invalid password");
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const supabase = createSupabaseServerClient();
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", user.email.toLowerCase())
            .maybeSingle();

          if (!existingUser) {
            const { data: newUser } = await supabase
              .from("users")
              .insert({
                name: user.name || "Weather Explorer",
                email: user.email.toLowerCase(),
                password: null,
              })
              .select("id")
              .single();

            if (newUser) {
              (user as any).supabaseId = newUser.id;
            }
          } else {
            (user as any).supabaseId = existingUser.id;
          }
        } catch (err) {
          console.error("Error syncing Google user with Supabase:", err);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).supabaseId || user.id;
      }
      if ((!token.id || typeof token.id !== "string" || token.id.length < 10) && token.email) {
        try {
          const supabase = createSupabaseServerClient();
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", (token.email as string).toLowerCase())
            .maybeSingle();
          if (existingUser) {
            token.id = existingUser.id;
          }
        } catch (err) {
          console.error("Error resolving Supabase user in jwt callback:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "weathernow_fallback_secret_32_chars_long",
};
