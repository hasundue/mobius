import { flare } from "https://pax.deno.dev/hasundue/sift@flare/mod.ts";

export default flare({
  "/": () => new Response("Mobius.js"),
  404: () => new Response("Not Found"),
});
