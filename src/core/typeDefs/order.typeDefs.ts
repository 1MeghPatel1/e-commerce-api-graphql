import { gql } from "apollo-server-express";

const orderTypeDefs = gql`
  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  type Order {
    id: ID!
    userId: Int
    totalAmount: Float!
    status: OrderStatus!
    createdAt: String!
    updatedAt: String!
    items: [OrderItem!]
    user: User
  }

  type OrderItem {
    id: ID!
    orderId: Int!
    productId: Int!
    quantity: Int!
    price: Float!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    orders: [Order!]!
    order(id: ID!): Order
    ordersByUserId(userId: Int!): [Order!]!
  }

  input OrderInput {
    orderItems: [OrderItemInput!]! @constraint(format: "array", minItems: 1)
  }

  input UpdateOrderInput {
    status: OrderStatus
    editOrderItems: [OrderItemInput!] @constraint(format: "array")
    removeOrderItems: [Int] @constraint(format: "array")
    addOrderItems: [OrderItemInput!] @constraint(format: "array")
  }

  input OrderItemInput {
    productId: Int!
    quantity: Int!
  }

  type Mutation {
    createOrder(input: OrderInput!): Order!
    updateOrder(id: ID!, input: UpdateOrderInput!): Order!
    deleteOrder(id: ID!): Order!
  }
`;

export default orderTypeDefs;
