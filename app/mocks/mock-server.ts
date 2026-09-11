import { setupServer } from "msw/node";

import { handlers } from "./handlers";

export const server = setupServer(...handlers);

type MockServer = ReturnType<typeof setupServer>;

export function startMockServer(server: MockServer) {
  server.listen({
    onUnhandledRequest(request, print) {
      print.warning();
    },
  });

  process.once("SIGINT", () => server.close());
  process.once("SIGTERM", () => server.close());

  console.log("MSW server startet 🔶");
}