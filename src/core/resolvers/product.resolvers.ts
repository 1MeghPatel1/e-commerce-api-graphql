import { Prisma } from "@prisma/client";
import { handleError } from "../../common/errors/handleError";
import {
  ProductInput,
  ProductResolvers,
  QueryProductArgs,
  ResolversParentTypes
} from "../../generated/graphqlCodegen";
import * as productsServices from "../../services/product.services";

const resolvers: ProductResolvers = {
  Query: {
    products: async () => {
      try {
        const products = await productsServices.findAll();
        return products;
      } catch (error) {
        if (error instanceof Error) {
          return handleError(error);
        }
      }
    },
    product: async (
      _parent: ResolversParentTypes,
      { id }: QueryProductArgs
    ) => {
      try {
        const product = await productsServices.findById(+id);
        if (!product) {
          throw new Error("Product not found");
        }
        return product;
      } catch (error) {
        if (error instanceof Error) {
          return handleError(error);
        }
      }
    }
  },
  Mutation: {
    createProduct: async (
      _parent: ResolversParentTypes,
      { input }: { input: ProductInput }
    ) => {
      try {
        const product = await productsServices.create(input);
        return product; // return created product
      } catch (error) {
        if (error instanceof Error) {
          return handleError(error);
        }
      }
    },
    updateProduct: async (
      _parent: ResolversParentTypes,
      { id, input }: { id: number; input: Prisma.ProductUpdateInput }
    ) => {
      try {
        const product = await productsServices.update(id, input);
        if (!product) {
          throw new Error("Product not found");
        }
        return product; // return updated product
      } catch (error) {
        if (error instanceof Error) {
          return handleError(error);
        }
      }
    },
    deleteProduct: async (
      _parent: ResolversParentTypes,
      { id }: QueryProductArgs
    ) => {
      try {
        const product = await productsServices.remove(+id);
        if (!product) {
          throw new Error("Product not found");
        }
        return product; // return deleted product
      } catch (error) {
        if (error instanceof Error) {
          return handleError(error);
        }
      }
    }
  }
};

export default resolvers;
