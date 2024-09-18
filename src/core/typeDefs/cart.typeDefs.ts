import { gql } from "apollo-server-express";

const cartTypeDefs = gql`
  type CartItem {
    id: ID!
    userId: Int!
    productId: Int!
    quantity: Int!
    createdAt: String!
    updatedAt: String!
    product: Product
  }

  type Query {
    cartItemsByUserId: [CartItem!]!
  }

  input CartItemInput {
    productId: Int!
    quantity: Int!
  }

  input UpdateCartItemInput {
    quantity: Int!
  }

  type Mutation {
    createCartItem(input: CartItemInput!): CartItem!
    updateCartItem(id: Int!, input: CartItemInput!): CartItem!
    deleteCartItem(id: Int!): CartItem!
  }
`;

export default cartTypeDefs;
