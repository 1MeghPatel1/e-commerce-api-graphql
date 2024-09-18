import { gql } from "apollo-server-express";

const hidePasswordDirectiveTypeDefs = gql`
  directive @hidePassword on FIELD_DEFINITION
`;

export default hidePasswordDirectiveTypeDefs;
