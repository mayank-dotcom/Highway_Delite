import { NextAuthOptions } from "next-auth"
import connectDB from "./mongodb"
import User from "./models/User"
// JWT verification handled on server side

export const authOptions: NextAuthOptions = {
  providers: [],
  pages: {
    signIn: "/signin-otp",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client and get database user ID
      if (token && session.user) {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: session.user.email })
          if (dbUser) {
            session.user.id = dbUser._id.toString()
          }
        } catch (error) {
          console.error('Error fetching user from database:', error)
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      return token
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after successful sign-in
      return `${baseUrl}/dashboard`
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}

// Helper function to verify JWT token from Authorization header
export async function verifyAuthToken(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Import jwt dynamically for server-side use
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded || !decoded.email) {
      return null;
    }

    await connectDB();
    const user = await User.findOne({ email: decoded.email });
    
    if (!user) {
      return null;
    }

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      }
    };
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}
