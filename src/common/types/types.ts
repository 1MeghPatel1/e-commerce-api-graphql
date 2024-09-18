import { OrderStatus, User } from "@prisma/client";
import { Request } from "express";

export interface Context {
  user: User;
  req: Request;
  userId: User["id"];
}

export enum Actions {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

export interface EmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: object;
}

export type TCreateOrder = {
  order: {
    userId: number;
    status: OrderStatus;
  };
  orderItems: {
    productId: number;
    quantity: number;
    price?: number;
  }[];
};

export interface IOrderItemUpdate {
  productId: number;
  quantity: number;
}

export interface IOrderItemUpdateWithPrice extends IOrderItemUpdate {
  price: number;
}

export interface IOrderItemRemove {
  productId: number;
}

export interface IOrderItemAdd {
  productId: number;
  quantity: number;
  price: number;
}

export interface IUpdateOrderData {
  userId?: number;
  status?: OrderStatus;
  editOrderItem?: IOrderItemUpdate[];
  removeOrderItem?: IOrderItemRemove[];
  addOrderItem?: IOrderItemAdd[];
}
