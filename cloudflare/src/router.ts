export interface Health {
  service: "warlink-control-plane";
  status: "ok";
}

export function route(request: Request): Response {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/health") {
    const health: Health = {
      service: "warlink-control-plane",
      status: "ok",
    };

    return Response.json(health, {
      headers: {
        "cache-control": "no-store",
      },
    });
  }

  return Response.json(
    {
      error: {
        code: "not_implemented",
        message: "This control-plane route has not been implemented.",
      },
    },
    {
      status: 501,
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
