import type { Env } from "./env";

export class RoomObject implements DurableObject {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env,
  ) {}

  fetch(): Response {
    // Keep bindings observable to type checking while room behavior is
    // intentionally deferred to reviewed PRD slices.
    void this.state;
    void this.env;

    return Response.json(
      {
        error: {
          code: "not_implemented",
          message: "Room behavior has not been implemented.",
        },
      },
      { status: 501 },
    );
  }
}
