// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// library imports
import express, { Application, Request } from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// local imports
import { schemaWithMiddleware, plugins } from "./core/graphQLSchema&Plugins";
import { formatError } from "./common/errors/formatError";
import { authenticateUser } from "./middlewares/authenticate.middleware";

async function startApolloServer() {
  const app: Application = express();

  app.use(cors());
  app.use(helmet());
  app.use(rateLimit({ max: 2000, windowMs: 15 * 60 * 1000 }));
  app.use(authenticateUser);

  const server = new ApolloServer({
    schema: schemaWithMiddleware,
    plugins,
    formatError,
    context: ({ req }: { req: Request }) => ({
      req,
      userId: req.user?.id || null,
      user: req.user || null
    })
  });

  await server.start();

  server.applyMiddleware({ app: app as any });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(
      `Server running at http://localhost:${port}${server.graphqlPath}`
    );
  });
}

startApolloServer().catch((err) => {
  console.error("Error starting server: ", err);
});
