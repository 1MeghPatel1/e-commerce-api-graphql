import { mergeTypeDefs } from "@graphql-tools/merge";
import { constraintDirectiveTypeDefs } from "graphql-constraint-directive";

// typeDefs
import userTypeDefs from "./user.typeDefs";
import productTypeDefs from "./product.typeDefs";
import hidePasswordDirectiveTypeDefs from "./hidePasswordDirective.typeDefs";
import orderTypeDefs from "./order.typeDefs";
import permissionTypeDefs from "./permission.typeDefs";
import cartTypeDefs from "./cart.typeDefs";

export default mergeTypeDefs([
  hidePasswordDirectiveTypeDefs,
  constraintDirectiveTypeDefs,
  userTypeDefs,
  permissionTypeDefs,
  productTypeDefs,
  orderTypeDefs,
  cartTypeDefs
]);
