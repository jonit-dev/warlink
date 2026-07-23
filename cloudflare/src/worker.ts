import type { Env } from "./env";
import { RoomObject } from "./room-object";
import { route } from "./router";

export { RoomObject };

export default {
  fetch(request: Request, _env: Env, _ctx: ExecutionContext): Response {
    return route(request);
  },
} satisfies ExportedHandler<Env>;
