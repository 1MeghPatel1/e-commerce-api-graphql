import { mergeResolvers } from "@graphql-tools/merge";

// resolvers
import authResolvers from "./auth.resolvers";
import productResolvers from "./product.resolvers";
import orderResolvers from "./order.resolvers";
import permissionResolvers from "./permission.resolvers";
import cartResolvers from "./cart.resolvers";

export default mergeResolvers([
  authResolvers,
  productResolvers,
  orderResolvers,
  permissionResolvers,
  cartResolvers
]);
