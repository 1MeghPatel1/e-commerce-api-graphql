import { GraphQLError } from "graphql";

export const formatError = (error: GraphQLError) => {
  const code = error.extensions?.code;
  const field = error.extensions?.field;

  if (code === "BAD_USER_INPUT" && typeof field === "string") {
    const fieldName = field.split(".")[field.split(".").length - 1];

    let message = "";

    switch (fieldName) {
      case "email":
        message = "Invalid email format.";
        break;
      case "password":
        message =
          "Password must be 8-128 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.";
        break;
      case "firstName":
      case "lastName":
        message = "Name must be between 2 and 50 characters.";
        break;
      case "phoneNumber":
        message = "Invalid phone number format.";
        break;
      case "address":
        message = "Address must be between 2 and 50 characters.";
        break;
      default:
        message = `Invalid ${fieldName}: Please provide a valid ${fieldName}.`;
        break;
    }

    return new GraphQLError(message, { extensions: { code, field } });
  } else {
    return error;
  }
};
