import { gql } from "apollo-server-express";

const permissionTypeDefs = gql`
  enum Resource {
    PRODUCT
    ORDER
  }

  type Permission {
    id: ID!
    role: Role!
    userId: Int!
    resource: Resource!
    create: Boolean!
    read: Boolean!
    update: Boolean!
    delete: Boolean!
  }

  type Query {
    permissionsByUserId(userId: Int!): [Permission!]!
  }

  type Mutation {
    updatePermission(userId: Int!, input: PermissionUpdateInput!): Permission
    updatePermissionsByRoleAndResource(
      input: PermissionUpdateByRoleAndResourceInput!
    ): [Permission!]!
  }

  input PermissionUpdateByRoleAndResourceInput {
    role: Role!
    resource: Resource!
    create: Boolean
    read: Boolean
    update: Boolean
    delete: Boolean
  }

  input PermissionInput {
    resource: Resource!
    role: Role!
    create: Boolean!
    read: Boolean!
    update: Boolean!
    delete: Boolean!
  }

  input PermissionUpdateInput {
    resource: Resource!
    create: Boolean
    read: Boolean
    update: Boolean
    delete: Boolean
  }
`;

export default permissionTypeDefs;
