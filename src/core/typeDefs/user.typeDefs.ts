import { gql } from "apollo-server-express";

const userTypeDefs = gql`
  enum Role {
    USER
    ADMIN
    SUPER_ADMIN
  }

  type User {
    id: Int!
    email: String!
    password: String! @hidePassword
    firstName: String!
    lastName: String!
    role: Role!
    phoneNumber: String
    address: String
    createdAt: String! # Assuming DateTime is serialized as String
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    login(login: LoginInput): LoginResponse!
  }

  input RegisterInput {
    email: String! @constraint(format: "email")
    password: String!
      @constraint(
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)(?=.*[@$!%*?&])[A-Za-z\\\\d@$!%*?&]{8,128}$"
      )
    firstName: String! @constraint(minLength: 2, maxLength: 50)
    lastName: String! @constraint(minLength: 2, maxLength: 50)
    phoneNumber: String @constraint(format: "phone")
    address: String @constraint(minLength: 2, maxLength: 50)
  }

  input UserUpdateInput {
    email: String @constraint(format: "email")
    firstName: String @constraint(minLength: 2, maxLength: 50)
    lastName: String @constraint(minLength: 2, maxLength: 50)
    phoneNumber: String @constraint(format: "phone")
    address: String @constraint(minLength: 2, maxLength: 50)
  }

  input LoginInput {
    email: String! @constraint(format: "email")
    password: String!
      @constraint(
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)(?=.*[@$!%*?&])[A-Za-z\\\\d@$!%*?&]{8,128}$"
      )
  }

  input RegisterAdminInput {
    adminData: AdminInput!
    permission: [PermissionInput!]! @constraint(format: "array", minItems: 1)
  }

  input AdminInput {
    email: String! @constraint(format: "email")
    password: String!
      @constraint(
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)(?=.*[@$!%*?&])[A-Za-z\\\\d@$!%*?&]{6,}$"
      )
    firstName: String! @constraint(minLength: 2, maxLength: 50)
    lastName: String! @constraint(minLength: 2, maxLength: 50)
    phoneNumber: String @constraint(format: "phone")
    address: String @constraint(minLength: 2, maxLength: 50)
  }

  type LoginResponse {
    user: User!
    accessToken: String!
    refreshToken: String!
  }

  type Mutation {
    updateUser(id: Int!, user: UserUpdateInput!): User
    register(register: RegisterInput): User
    registerAdmin(registerAdmin: RegisterAdminInput): User
  }
`;

export default userTypeDefs;
