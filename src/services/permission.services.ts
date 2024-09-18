import { Permission, Prisma, Resource, Role } from "@prisma/client";
import { prisma } from "../db/prisma.client";
import { throwError } from "../utils/throwError";
import { Actions } from "../common/types/types";
import { PermissionInput } from "../generated/graphqlCodegen";

const create = async (
  permission: Partial<Permission> & {
    role: Role;
    resource: Resource;
    userId: number;
  }
) => {
  try {
    const newPermission = await prisma.permission.create({ data: permission });
    return newPermission;
  } catch (error) {
    throwError(error);
  }
};

const createMany = async (
  permissions: (PermissionInput & { userId: number })[]
) => {
  try {
    if (!permissions || permissions.length === 0) {
      throw new Error("permissions array is undefined, null, or empty");
    }
    const newPermissions = await prisma.permission.createMany({
      data: permissions
    });
    return newPermissions;
  } catch (error) {
    console.error("Error in permissionServices.createMany:", error);
    throwError(error);
  }
};

const findPermissionByUserIdAndResource = async (
  userId: number,
  resource: Resource
) => {
  try {
    const permission = await prisma.permission.findFirst({
      where: {
        userId,
        resource
      }
    });
    return permission;
  } catch (error) {
    throwError(error);
  }
};

const findAllPermissionByUserId = async (userId: number) => {
  try {
    const permissions = await prisma.permission.findMany({
      where: {
        userId
      },
      include: {
        user: true
      }
    });
    return permissions;
  } catch (error) {
    throwError(error);
  }
};

const findDistictRoles = async (whereCondition: any) => {
  return await prisma.permission.findMany({
    where: whereCondition,
    distinct: ["role"],
    select: {
      role: true
    }
  });
};

const findRolesByResourceAndAction = async (
  resource: Resource,
  action: Actions
) => {
  try {
    let distinctPermissions: { role: Role }[] = [];

    switch (action) {
      case Actions.CREATE:
        distinctPermissions = await findDistictRoles({
          resource,
          create: true
        });
        break;
      case Actions.READ:
        distinctPermissions = await findDistictRoles({ resource, read: true });
        break;
      case Actions.UPDATE:
        distinctPermissions = await findDistictRoles({
          resource,
          update: true
        });
        break;
      case Actions.DELETE:
        distinctPermissions = await findDistictRoles({
          resource,
          delete: true
        });
        break;
      default:
        distinctPermissions = [];
        break;
    }

    return distinctPermissions.map((permission) => permission.role);
  } catch (error) {
    throwError(error);
  }
};

const update = async (id: number, permission: Prisma.PermissionUpdateInput) => {
  try {
    const newPermission = await prisma.permission.update({
      where: { id },
      data: permission
    });
    return newPermission;
  } catch (error) {
    throwError(error);
  }
};

const updateByResourceAndRole = async (
  resource: Resource,
  role: Role,
  permission: Partial<Omit<Permission, "id">>
) => {
  try {
    const newPermission = await prisma.permission.updateMany({
      where: { resource, role },
      data: permission
    });
    return newPermission;
  } catch (error) {
    throwError(error);
  }
};

const updateByUserIdAndResource = async (
  userId: number,
  resource: Resource,
  permission: Partial<Omit<Permission, "id" | "userId" | "role">>
) => {
  try {
    const storedPermission = await prisma.permission.findFirst({
      where: { userId, resource }
    });
    if (!storedPermission) throw new Error("Permission not found");
    const updatedPermission = await prisma.permission.update({
      where: { id: storedPermission?.id },
      data: permission
    });
    return updatedPermission;
  } catch (error) {
    throwError(error);
  }
};

const remove = async (id: number) => {
  try {
    const deletedPermission = await prisma.permission.delete({
      where: { id }
    });
    return deletedPermission;
  } catch (error) {
    throwError(error);
  }
};

export {
  create,
  createMany,
  findPermissionByUserIdAndResource,
  remove,
  update,
  updateByResourceAndRole,
  findRolesByResourceAndAction,
  findAllPermissionByUserId,
  updateByUserIdAndResource
};
