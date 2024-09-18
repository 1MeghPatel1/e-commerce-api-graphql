import { Permission } from "@prisma/client";
import { Actions } from "../common/types/types";

export const checkPermission = async (
  permission: Permission,
  action: Actions
) => {
  switch (action) {
    case Actions.CREATE:
      return permission.create;
    case Actions.READ:
      return permission.read;
    case Actions.UPDATE:
      return permission.update;
    case Actions.DELETE:
      return permission.delete;
    default:
      return false;
  }
};
