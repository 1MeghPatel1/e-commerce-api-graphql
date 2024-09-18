import * as orderServices from "../../services/order.services";
import * as productServices from "../../services/product.services";
import { handleError } from "../../common/errors/handleError";
import {
  Context,
  IOrderItemAdd,
  IOrderItemUpdateWithPrice
} from "../../common/types/types";
import {
  OrderInput,
  OrderResolvers,
  QueryOrderArgs,
  ResolversParentTypes,
  UpdateOrderInput
} from "../../generated/graphqlCodegen";

const orderResolvers: OrderResolvers = {
  Query: {
    order: async (
      _parent: ResolversParentTypes,
      args: QueryOrderArgs,
      context: Context
    ) => {
      const { userId, user } = context;
      try {
        const order = await orderServices.findOne(+args.id);
        if (!order) {
          throw new Error("Order not found");
        } else if (order.userId !== userId && user.role === "USER") {
          throw new Error("Order not found");
        }
        return order;
      } catch (error) {
        return handleError(error);
      }
    },
    ordersByUserId: async (
      _parent: ResolversParentTypes,
      _args: never,
      context: Context
    ) => {
      try {
        const { userId } = context;
        const orders = await orderServices.findAllByUserId(userId);
        if (!orders) {
          throw new Error("Orders not found");
        }
        return orders;
      } catch (error) {
        return handleError(error);
      }
    },
    orders: async () => {
      try {
        const orders = await orderServices.findAll();
        return orders;
      } catch (error) {
        return handleError(error);
      }
    }
  },
  Mutation: {
    createOrder: async (
      _parent: ResolversParentTypes,
      { input }: { input: OrderInput },
      context: Context
    ) => {
      try {
        const { userId } = context;
        const orderItems = input.orderItems;
        const products = await Promise.all(
          orderItems.map((orderItem) =>
            productServices.findById(orderItem.productId)
          )
        );
        if (
          products.some((product) => product === null) ||
          products.length !== orderItems.length
        ) {
          throw new Error("Product not found");
        }
        const orderItemsWithPrice = orderItems.map((orderItem, index) => ({
          ...orderItem,
          price: products[index]!.price
        }));

        const totalAmount = orderItemsWithPrice.reduce(
          (total, orderItem) => total + orderItem.price! * orderItem.quantity,
          0
        );
        const orderRes = await orderServices.create(
          {
            status: "PENDING",
            totalAmount,
            userId
          },
          orderItemsWithPrice
        );
        return orderRes;
      } catch (error) {
        return handleError(error);
      }
    },
    updateOrder: async (
      _parent: ResolversParentTypes,
      { id, input }: { id: string; input: UpdateOrderInput },
      context: Context
    ) => {
      try {
        const { userId, user } = context;
        const order = await orderServices.findById(+id, userId);
        if (!order && user.role === "USER") {
          throw new Error("Order not found");
        }

        const { editOrderItems, addOrderItems, removeOrderItems, status } =
          input;

        let editOrderItemsWithPrice: IOrderItemUpdateWithPrice[] = [];
        let addOrderItemsWithPrice: IOrderItemAdd[] = [];
        let removeOrderItemsWithId: { productId: number }[] = [];

        // Handle editing order items
        if (editOrderItems && editOrderItems.length > 0) {
          const editProducts = await Promise.all(
            editOrderItems.map((item) =>
              productServices.findById(item.productId)
            )
          );
          if (editProducts.some((product) => product === null)) {
            throw new Error("Product not found in edit order items");
          }
          editOrderItemsWithPrice = editOrderItems.map((item, index) => ({
            ...item,
            price: editProducts[index]!.price
          }));
        }

        // Handle adding new order items
        if (addOrderItems && addOrderItems.length > 0) {
          const addProducts = await Promise.all(
            addOrderItems.map((item) =>
              productServices.findById(item.productId)
            )
          );
          if (addProducts.some((product) => product === null)) {
            throw new Error("Product not found in add order items");
          }
          addOrderItemsWithPrice = addOrderItems.map((item, index) => ({
            ...item,
            price: addProducts[index]!.price
          }));
        }
        if (!removeOrderItems) {
          removeOrderItemsWithId = [];
        } else if (removeOrderItems && removeOrderItems.length > 0) {
          removeOrderItemsWithId = removeOrderItems.map((item) => {
            if (!item) {
              throw new Error("Order item not found in remove order items");
            }
            return { productId: item };
          });
        }

        const updatedOrder = await orderServices.update(
          +id,
          removeOrderItemsWithId,
          editOrderItemsWithPrice,
          addOrderItemsWithPrice,
          {
            userId,
            status: status || order?.status
          }
        );

        return updatedOrder;
      } catch (error) {
        return handleError(error);
      }
    },
    deleteOrder: async (
      _parent: ResolversParentTypes,
      { id }: { id: number },
      context: Context
    ) => {
      try {
        const { userId } = context;
        const order = await orderServices.findById(id, userId);
        if (!order) {
          throw new Error("Order not found");
        }
        const deletedOrder = await orderServices.remove(id);
        return deletedOrder;
      } catch (error) {
        return handleError(error);
      }
    }
  }
};

export default orderResolvers;
