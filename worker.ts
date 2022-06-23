import { flare, json } from "https://pax.deno.dev/hasundue/sift@flare/mod.ts";

export default flare({
  "/": () => json({ message: "Mobius API" }),

  "/create/:url": ({ params }) => {
    if (!params?.url) {
      return notFound();
    }
    return create(params.url);
  },

  404: () => notFound(),
});

const notFound = () => json({}, { status: 404 });

const create = (url: string) => {
  return json({ message: "created", url });
};
