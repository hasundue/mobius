import { assert, assertEquals } from "testing/asserts.ts";
import { readLines } from "io/mod.ts";

Deno.test("hello world", async () => {
  const process = Deno.run({
    cmd: ["denoflare", "serve", "./examples/05_denoflare.ts"],
    stderr: "null",
    stdout: "piped",
  });

  for await (const line of readLines(process.stdout)) {
    const matched = line.match(/http:\/\/localhost:\d+/);

    if (matched) {
      const host = matched[0];
      assert(host);

      const checkResponse = async (path: string, text: string) => {
        const response = await fetch(host + path);
        assertEquals(await response.text(), text);
      };

      await checkResponse("/", "Hello World!");
      await checkResponse("/not_exist", "Not Found");

      break;
    }
  }

  process.stdout.close();
  process.close();
});
