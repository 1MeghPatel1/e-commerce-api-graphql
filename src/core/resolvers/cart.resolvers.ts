import * as cartServices from "../../services/cart.services";
import { handleError } from "../../common/errors/handleError";
import { Context } from "../../common/types/types";
import {
  CartItemInput,
  CartItemResolvers,
  ResolversParentTypes,
  UpdateCartItemInput
} from "../../generated/graphqlCodegen";

const resolvers: CartItemResolvers = {
  Query: {
    cartItemsByUserId: async (
      _: ResolversParentTypes,
      _args: never,
      context: Context
    ) => {
      try {
        const { userId } = context;
        const cartItems = await cartServices.readAllCartItemsByUserId(userId);
        return cartItems;
      } catch (error) {
        return handleError(error);
      }
    }
  },
  Mutation: {
    createCartItem: async (
      _: ResolversParentTypes,
      args: { input: CartItemInput },
      context: Context
    ) => {
      try {
        const { input } = args;
        const { userId } = context;
        const createdCartItem = await cartServices.create({ ...input, userId });
        return createdCartItem;
      } catch (error) {
        return handleError(error);
      }
    },
    updateCartItem: async (
      _: ResolversParentTypes,
      args: { id: number; input: UpdateCartItemInput },
      context: Context
    ) => {
      try {
        const { input } = args;
        const { id } = args;
        const { userId } = context;
        const storedCartItem = await cartServices.read(id);
        if (!storedCartItem || storedCartItem.userId !== userId) {
          throw new Error("Cart item not found");
        }
        const updatedCartItem = await cartServices.update(id, input);
        return updatedCartItem;
      } catch (error) {
        return handleError(error);
      }
    },
    deleteCartItem: async (
      _: ResolversParentTypes,
      args: { id: number },
      context: Context
    ) => {
      try {
        const { id } = args;
        const { userId } = context;
        const storedCartItem = await cartServices.read(id);
        if (!storedCartItem || storedCartItem.userId !== userId) {
          throw new Error("Cart item not found");
        }
        const deletedCartItem = await cartServices.remove(id);
        return deletedCartItem;
      } catch (error) {
        return handleError(error);
      }
    }
  }
};

export default resolvers;
