import * as permissionServices from "../../services/permission.services";
import {
  Permission,
  PermissionResolvers,
  PermissionUpdateByRoleAndResourceInput,
  PermissionUpdateInput,
  ResolversParentTypes
} from "../../generated/graphqlCodegen";
import { handleError } from "../../common/errors/handleError";

const resolvers: PermissionResolvers = {
  Query: {
    permissionsByUserId: async (
      _: ResolversParentTypes,
      args: { userId: number }
    ) => {
      try {
        const permissions = await permissionServices.findAllPermissionByUserId(
          args.userId
        );

        if (!permissions) {
          throw new Error("Permissions not found");
        }
        return permissions;
      } catch (error) {
        return handleError(error);
      }
    }
  },
  Mutation: {
    updatePermission: async (
      _: ResolversParentTypes,
      args: { id: number; input: PermissionUpdateInput }
    ) => {
      try {
        const { resource, ...rest } = args.input;
        const updateData = {
          ...(rest.create !== undefined ? { create: rest.create } : {}),
          ...(rest.read !== undefined ? { read: rest.read } : {}),
          ...(rest.update !== undefined ? { update: rest.update } : {}),
          ...(rest.delete !== undefined ? { delete: rest.delete } : {})
        } as Partial<Permission>;

        const permission = await permissionServices.updateByUserIdAndResource(
          args.id,
          resource,
          updateData
        );

        if (!permission) {
          throw new Error("Permission not found");
        }
        return permission;
      } catch (error) {
        return handleError(error);
      }
    },
    updatePermissionsByRoleAndResource: async (
      _: ResolversParentTypes,
      args: { input: PermissionUpdateByRoleAndResourceInput }
    ) => {
      try {
        const { resource, role, ...rest } = args.input;
        const updateData = {
          ...(rest.create ? { create: rest.create } : {}),
          ...(rest.read ? { read: rest.read } : {}),
          ...(rest.update ? { update: rest.update } : {}),
          ...(rest.delete ? { delete: rest.delete } : {})
        };
        const permission = await permissionServices.updateByResourceAndRole(
          resource,
          role,
          updateData
        );
        if (!permission) {
          throw new Error("Permission not found");
        }
        return permission;
      } catch (error) {
        return handleError(error);
      }
    }
  }
};

export default resolvers;
