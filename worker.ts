import { rest } from "https://deno.land/x/flash/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import {
  DurableObjectNamespace,
  DurableObjectState,
  DurableObjectStub,
} from "https://pax.deno.dev/skymethod/denoflare@v0.5.2/common/cloudflare_workers_types.d.ts";

type WorkerEnv = {
  readonly MOBIUS_DO: DurableObjectNamespace;
};

export default rest({
  "/": {
    GET: "Mobius API",

    POST: async ({ request }, env: WorkerEnv) => {
      const name = nanoid(8);
      const url = request.url + name;

      const id = env.MOBIUS_DO.idFromName(name);
      const stub = env.MOBIUS_DO.get(id);

      const response = await stub.fetch(url, { method: "POST" });
      if (response.status !== 201) throw Error();

      return { 201: url };
    },
  },

  "/:name": {
    GET: async ({ request, params }, env: WorkerEnv) => {
      const id = env.MOBIUS_DO.idFromName(params.name);
      const stub = env.MOBIUS_DO.get(id);

      const response = await stub.fetch(request.url, { method: "GET" });
      const json = await response.text();

      return json;
    },
  },

  404: { message: "The requested URL was not found." },
  500: ({ error }) => ({
    message: "Unexpected error occured",
    stack: error.stack,
  }),
});

export class MobiusDO implements DurableObjectStub {
  private readonly state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    const name = url.pathname.slice(1);

    if (request.method === "POST") {
      await this.state.storage.put("name", name);
      return new Response("Created", { status: 201 });
    }

    if (request.method === "GET") {
      const name = await this.state.storage.get("name") as string | undefined;
      if (!name) {
        return new Response("Not found", { status: 404 });
      } else {
        return new Response(name);
      }
    }

    return new Response("Invalid request method", { status: 400 });
  }
}
