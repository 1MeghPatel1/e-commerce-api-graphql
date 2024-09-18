import bcrypt from "bcrypt";
import * as userServices from "../../services/user.services";
import * as permissionServices from "../../services/permission.services";
import * as refreshTokenServices from "../../services/refershToken.services";
import { Context } from "../../common/types/types";
import sendEmail from "../../utils/sendEmail";
import { defaultPermissionsUser } from "../../common/constants/constants";
import { omitPassword } from "../../utils/omitPassword";
import { handleError } from "../../common/errors/handleError";
import { generateToken } from "../../utils/generateToken";
import {
  LoginInput,
  RegisterAdminInput,
  RegisterInput,
  ResolversParentTypes,
  UserResolvers
} from "../../generated/graphqlCodegen";
import { Prisma, Role } from "@prisma/client";

const resolvers: UserResolvers = {
  Query: {
    users: async (
      _parent: ResolversParentTypes,
      _args: null,
      _context: Context
    ) => {
      try {
        const users = await userServices.findAll();
        return users;
      } catch (error) {
        if (error instanceof Error) {
          return handleError(error);
        }
      }
    },
    login: async (
      _parent: ResolversParentTypes,
      args: { login: LoginInput },
      _context: Context
    ) => {
      try {
        const user = await userServices.findOne(args.login.email);
        if (
          !user ||
          !(await bcrypt.compare(args.login.password, user.password))
        ) {
          throw new Error("Invalid credentials");
        }

        const jwtPayload = {
          userId: user.id,
          role: user.role,
          email: user.email
        };

        const accessToken = generateToken(
          jwtPayload,
          process.env.ACCESS_SECRET as string,
          process.env.ACCESS_EXPIRES as string
        );
        const refreshToken = generateToken(
          jwtPayload,
          process.env.REFRESH_SECRET as string,
          process.env.REFRESH_EXPIRES as string
        );

        await refreshTokenServices.upsert(refreshToken, user.id);

        return {
          user: omitPassword(user),
          accessToken,
          refreshToken
        };
      } catch (error) {
        return handleError(error);
      }
    }
  },
  Mutation: {
    register: async (
      _parent: ResolversParentTypes,
      { register }: { register: RegisterInput },
      _context: Context
    ) => {
      try {
        const { password, ...userData } = register;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userServices.create({
          ...userData,
          password: hashedPassword
        });

        const userWithoutPassword = omitPassword(user);

        if (user) {
          // Create default permissions for the user
          await Promise.all(
            defaultPermissionsUser.map(async (permission) => {
              return permissionServices.create({
                ...permission,
                userId: user.id
              });
            })
          );

          // Send welcome email to the user
          await sendEmail({
            to: user.email,
            subject: "Welcome to E-Commerce",
            templateName: "welcomeTemplate",
            templateData: {
              title: "Welcome to E-Commerce",
              heading: "Welcome to E-Commerce store app",
              message: `Hi ${user.firstName}, thank you for joining us. We are thrilled to have you on board.`
            }
          });
        }
        return userWithoutPassword;
      } catch (error) {
        if (error instanceof Error) {
          return handleError(error);
        }
      }
    },
    updateUser: async (
      _parent: ResolversParentTypes,
      { id, user }: { id: number; user: Prisma.UserUpdateInput },
      _context: Context
    ) => {
      try {
        const storedUser = await userServices.update(id, user);
        return storedUser;
      } catch (error) {
        if (error instanceof Error) {
          return handleError(error);
        }
      }
    },
    registerAdmin: async (
      _parent: ResolversParentTypes,
      { registerAdmin }: { registerAdmin: RegisterAdminInput },
      _context: Context
    ) => {
      try {
        const { adminData, permission } = registerAdmin;
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        const admin = await userServices.create({
          ...adminData,
          password: hashedPassword,
          role: Role.ADMIN
        });
        if (!admin) {
          throw new Error("Failed to create admin user");
        }
        const permissionData = permission.map((p) => ({
          ...p,
          userId: admin.id
        }));

        await permissionServices.createMany(permissionData);

        return admin;
      } catch (error) {
        return handleError(error);
      }
    }
  }
};

export default resolvers;
