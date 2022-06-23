import { readLines } from "https://deno.land/std@0.144.0/io/mod.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.144.0/testing/asserts.ts";

Deno.test("hello world", async () => {
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

      const checkStatus = async (path: string, status: number) => {
        const response = await fetch(host + path);
        await response.text();
        assertEquals(response.status, status);
      };

      const checkMessage = async (path: string, text: string | undefined) => {
        const response = await fetch(host + path);
        const json = await response.json();
        assertEquals(json.message, text);
      };

      await checkStatus("/", 200);
      await checkMessage("/", "Mobius API");

      await checkStatus("/not_exist", 404);
      await checkMessage("/not_exist", undefined);

      const createURL = "/create/" + encodeURIComponent("https://github.com");
      await checkStatus(createURL, 200);
      await checkMessage(createURL, "created");

      break;
    }
  }

  process.stdout.close();
  process.close();
});
