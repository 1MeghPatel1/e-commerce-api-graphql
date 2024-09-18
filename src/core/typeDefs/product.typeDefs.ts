import { gql } from "apollo-server-express";

const productTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  input ProductInput {
    name: String! @constraint(minLength: 3)
    description: String! @constraint(minLength: 3, maxLength: 100)
    price: Float! @constraint(min: 0, format: "float")
    stock: Int! @constraint(min: 0, format: "int")
  }

  input UpdateProductInput {
    name: String @constraint(minLength: 3)
    description: String @constraint(minLength: 3, maxLength: 100)
    price: Float @constraint(min: 0, format: "float")
    stock: Int @constraint(min: 0, format: "int")
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Product!
  }
`;

export default productTypeDefs;
