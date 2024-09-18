import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.client";
import { throwError } from "../utils/throwError";
import { CartItemInput } from "../generated/graphqlCodegen";

const create = async (cartItemData: CartItemInput & { userId: number }) => {
  try {
    const cartItem = await prisma.cartItem.create({
      data: cartItemData,
      include: { product: true }
    });
    return cartItem;
  } catch (error) {
    throwError(error);
  }
};

const read = async (cartItemId: number) => {
  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true }
    });
    return cartItem;
  } catch (error) {
    throwError(error);
  }
};

const update = async (
  cartItemId: number,
  cartItemData: Prisma.CartItemUpdateInput
) => {
  try {
    const cartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      include: { product: true },
      data: cartItemData
    });
    return cartItem;
  } catch (error) {
    throwError(error);
  }
};

const remove = async (cartItemId: number) => {
  try {
    const deletedCartItem = await prisma.cartItem.delete({
      where: { id: cartItemId },
      include: { product: true }
    });
    return deletedCartItem;
  } catch (error) {
    throwError(error);
  }
};

const readAllCartItemsByUserId = async (userId: number) => {
  try {
    const cartItems = await prisma.cartItem.findMany({ where: { userId } });
    return cartItems;
  } catch (error) {
    throwError(error);
  }
};

export { create, read, update, remove, readAllCartItemsByUserId };
