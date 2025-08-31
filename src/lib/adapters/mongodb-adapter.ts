import { Adapter, AdapterUser } from "next-auth/adapters";
import connectDB from "../mongodb";
import User from "../models/User";

export default function MongoDBAdapter(): Adapter {
  return {
    async createUser(user) {
      await connectDB();
      const newUser = await User.create({
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      });
      return {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        emailVerified: newUser.emailVerified,
      } as AdapterUser;
    },

    async getUser(id) {
      await connectDB();
      const user = await User.findById(id);
      if (!user) return null;
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      } as AdapterUser;
    },

    async getUserByEmail(email) {
      await connectDB();
      const user = await User.findOne({ email });
      if (!user) return null;
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      } as AdapterUser;
    },

    async getUserByAccount({ providerAccountId }) {
      await connectDB();
      // For simplicity, we'll use email as the primary identifier
      // In a production app, you might want to create a separate Account model
      const user = await User.findOne({ email: providerAccountId });
      if (!user) return null;
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      } as AdapterUser;
    },

    async updateUser(user) {
      await connectDB();
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        {
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        },
        { new: true }
      );
      if (!updatedUser) throw new Error("User not found");
      return {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        emailVerified: updatedUser.emailVerified,
      } as AdapterUser;
    },

    async deleteUser(userId) {
      await connectDB();
      await User.findByIdAndDelete(userId);
    },

    async linkAccount(account) {
      // For simplicity, we'll skip account linking
      // In a production app, you might want to create a separate Account model
      return account;
    },

    async unlinkAccount() {
      // For simplicity, we'll skip account unlinking
    },

    async createSession(session) {
      // For JWT strategy, sessions are handled by NextAuth
      return session;
    },

    async getSessionAndUser() {
      // For JWT strategy, sessions are handled by NextAuth
      return null;
    },

    async updateSession(session) {
      // For JWT strategy, sessions are handled by NextAuth
      return session;
    },

    async deleteSession() {
      // For JWT strategy, sessions are handled by NextAuth
    },

    async createVerificationToken(verificationToken) {
      // For simplicity, we'll skip verification tokens
      return verificationToken;
    },

    async useVerificationToken() {
      // For simplicity, we'll skip verification tokens
      return null;
    },
  };
}
