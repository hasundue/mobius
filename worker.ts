import { flare, json } from "https://pax.deno.dev/hasundue/sift@flare/mod.ts";

export default flare({
  "/": () => json({ message: "Mobius API" }),

  "/create": ({ request }) => {
    if (request.method !== "POST") {
      return notFound();
    }
    return create();
  },

  "/:id": ({ request, params }) => {
    if (!params?.id) {
      return notFound();
    }
    if (request.method === "GET") {
      return info(params.id);
    }
    if (request.method === "POST") {
      return put(params.id);
    }
    else {
      return notFound();
    }
  },

  404: () => notFound(),
});

const create = () => {
  return json({ message: "created" }, { status: 201 });
};

const info = (id: string) => {
  return json({ message: id });
};

const put = (id: string) => {
  return json({ message: id });
}

const notFound = () => json({ message: "Not Found" }, { status: 404 });
