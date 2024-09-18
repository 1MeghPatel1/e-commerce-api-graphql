// src/common/permissions.ts
import { rule, shield, and, allow } from "graphql-shield";
import { Resource, Role } from "@prisma/client";
import { Actions, Context } from "../types/types";
import {
  findPermissionByUserIdAndResource,
  findRolesByResourceAndAction
} from "../../services/permission.services";
import { checkPermission } from "../../utils/checkPermission";

// Rule: Check if user is authenticated
const isAuthenticated = rule()((parent, args, context: Context) => {
  const { user } = context;
  return !!user;
});

// Rule: Check if user has specific permission
const hasPermission = (
  roles: Role[] | "DYNAMIC",
  resource?: Resource,
  action?: Actions
) =>
  rule()(async (parent, args, context: Context) => {
    const { user } = context;
    if (!user) {
      return false;
    }

    let allowedRoles: Role[] | undefined = [];
    if (roles === "DYNAMIC" && resource && action) {
      allowedRoles = await findRolesByResourceAndAction(resource, action);
      if (!allowedRoles || allowedRoles.length === 0) {
        return false;
      }
    } else if (Array.isArray(roles) && !resource && !action) {
      allowedRoles = roles;
    } else {
      return false;
    }

    // Super Admin has all permissions
    if (user.role === Role.SUPER_ADMIN) {
      return true;
    } else if (user.role === Role.USER && allowedRoles.includes(Role.USER)) {
      return true;
    }

    // Check if user's role is allowed for this resource/action
    if (allowedRoles.includes(user.role) && resource && action) {
      const userPermission = await findPermissionByUserIdAndResource(
        user.id,
        resource
      );
      if (!userPermission) {
        return false;
      }
      return checkPermission(userPermission, action);
    }

    return false;
  });

// Define your permissions schema
export const permissions = shield({
  Query: {
    //user
    users: and(isAuthenticated, hasPermission([Role.ADMIN, Role.SUPER_ADMIN])),
    login: allow,
    //permissions
    permissionsByUserId: and(
      isAuthenticated,
      hasPermission([Role.SUPER_ADMIN])
    ),
    //product
    products: and(
      isAuthenticated,
      hasPermission("DYNAMIC", Resource.PRODUCT, Actions.READ)
    ),
    product: and(
      isAuthenticated,
      hasPermission("DYNAMIC", Resource.PRODUCT, Actions.READ)
    ),
    //order
    order: and(
      isAuthenticated,
      hasPermission("DYNAMIC", Resource.ORDER, Actions.READ)
    ),
    orders: and(isAuthenticated, hasPermission([Role.SUPER_ADMIN])),
    ordersByUserId: and(
      isAuthenticated,
      hasPermission("DYNAMIC", Resource.ORDER, Actions.READ)
    ),
    //cart
    cartItemsByUserId: and(isAuthenticated, hasPermission([Role.USER])),
    "*": and(isAuthenticated)
  },
  Mutation: {
    //user
    updateUser: and(
      isAuthenticated,
      hasPermission([Role.ADMIN, Role.SUPER_ADMIN, Role.USER])
    ),
    registerAdmin: and(isAuthenticated, hasPermission([Role.SUPER_ADMIN])),
    register: allow,
    //permissions
    updatePermission: and(isAuthenticated, hasPermission([Role.SUPER_ADMIN])),
    updatePermissionsByRoleAndResource: and(
      isAuthenticated,
      hasPermission([Role.SUPER_ADMIN])
    ),
    //product
    createProduct: and(
      isAuthenticated,
      hasPermission("DYNAMIC", Resource.PRODUCT, Actions.CREATE)
    ),
    updateProduct: and(
      isAuthenticated,
      hasPermission("DYNAMIC", Resource.PRODUCT, Actions.UPDATE)
    ),
    deleteProduct: and(
      isAuthenticated,
      hasPermission("DYNAMIC", Resource.PRODUCT, Actions.DELETE)
    ),
    //order
    createOrder: and(
      isAuthenticated,
      hasPermission("DYNAMIC", Resource.ORDER, Actions.CREATE)
    ),
    updateOrder: and(
      isAuthenticated,
      hasPermission("DYNAMIC", Resource.ORDER, Actions.UPDATE)
    ),
    deleteOrder: and(
      isAuthenticated,
      hasPermission("DYNAMIC", Resource.ORDER, Actions.DELETE)
    ),
    //cart
    createCartItem: and(isAuthenticated, hasPermission([Role.USER])),
    updateCartItem: and(isAuthenticated, hasPermission([Role.USER])),
    deleteCartItem: and(isAuthenticated, hasPermission([Role.USER])),
    //user
    "*": and(isAuthenticated)
  }
});
