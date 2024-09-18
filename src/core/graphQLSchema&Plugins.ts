import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { hidePasswordDirective } from "../common/directives/hidePasswordDirective";
import { permissions } from "../common/permissions/permissions";
import { createApolloQueryValidationPlugin } from "graphql-constraint-directive";

let schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const applyHidePasswordDirectiveTransform =
  hidePasswordDirective("hidePassword");

schema = applyHidePasswordDirectiveTransform(schema);

const schemaWithMiddleware = applyMiddleware(schema, permissions);

const plugins = [
  createApolloQueryValidationPlugin({
    schema: schemaWithMiddleware
  })
];

export { schemaWithMiddleware, plugins };
