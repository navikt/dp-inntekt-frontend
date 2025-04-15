import { setupServer, SetupServerApi } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

export function startMockServer(server: SetupServerApi) {
  server.listen({
    onUnhandledRequest(request, print) {
      print.warning();
    },
  });

  process.once("SIGINT", () => server.close());
  process.once("SIGTERM", () => server.close());

  console.log("MSW server startet 🔶");
}
