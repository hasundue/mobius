import { readLines } from "https://deno.land/std@0.144.0/io/mod.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.144.0/testing/asserts.ts";

Deno.test("test", async () => {
  const process = Deno.run({
    cmd: ["denoflare", "serve", "mobius"],
    stderr: "null",
    stdout: "piped",
  });

  for await (const line of readLines(process.stdout)) {
    const matched = line.match(/http:\/\/localhost:\d+/);

    if (matched) {
      const host = matched[0];
      assert(host);

      const checkStatus = async (
        path: string,
        method: string,
        status: number,
      ) => {
        const response = await fetch(host + path, { method });
        await response.text();
        assertEquals(response.status, status);
      };

      const checkMessage = async (
        path: string,
        method: string,
        text: string | undefined,
      ) => {
        const response = await fetch(host + path, { method });
        const json = await response.json();
        assertEquals(json.message, text);
      };

      await checkStatus("/", "GET", 200);
      await checkMessage("/", "GET", "Mobius API");

      await checkStatus("/create", "POST", 201);
      await checkMessage("/create", "POST", "created");

      const id = crypto.randomUUID();

      await checkStatus(`/${id}`, "GET", 200);
      await checkMessage(`/${id}`, "GET", id);

      break;
    }
  }

  process.stdout.close();
  process.close();
});
