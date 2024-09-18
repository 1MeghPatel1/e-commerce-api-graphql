// types/custom.d.ts
declare global {
  // type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

  // interface IUser {
  //   id: number;
  //   email: string;
  //   password: string;
  //   firstName: string;
  //   lastName: string;
  //   role: Role;
  //   phoneNumber?: string;
  //   address?: string;
  //   createdAt: string;
  //   updatedAt: string;
  // }

  // interface Query {
  //   user: User;
  //   users: User[];
  //   login(login: LoginInput): User;
  // }

  // interface RegisterInput {
  //   email: string;
  //   password: string;
  //   firstName: string;
  //   lastName: string;
  //   phoneNumber?: string;
  //   address?: string;
  // }

  // interface UserUpdateInput {
  //   email?: string;
  //   firstName?: string;
  //   lastName?: string;
  //   phoneNumber?: string;
  //   address?: string;
  // }

  // interface LoginInput {
  //   email: string;
  //   password: string;
  // }

  // interface Mutation {
  //   updateUser(id: number, user: UserUpdateInput): User;
  //   register(register: RegisterInput): User;
  // }

  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
