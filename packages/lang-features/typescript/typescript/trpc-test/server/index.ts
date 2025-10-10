import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./router";
import { createContext } from "./context";

const server = createHTTPServer({
  router: appRouter,
  createContext
});

server.listen(3000);
