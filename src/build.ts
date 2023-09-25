import { mkdir, readdir, rm, stat } from "fs/promises";
import cssPlugin from "./cssPlugin";
const dirs = await readdir("src");

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

for (const group of dirs) {
  if (!(await stat(`src/${group}`)).isDirectory()) continue;
  const projects = await readdir(`src/${group}`);

  for (const proj of projects) {
    let entrypoint: string;
    if (await Bun.file(`src/${group}/${proj}/index.ts`).exists())
      entrypoint = `src/${group}/${proj}/index.ts`;
    else if (await Bun.file(`src/${group}/${proj}/index.tsx`).exists())
      entrypoint = `src/${group}/${proj}/index.tsx`;
    else continue;
    const success = await Bun.build({
      entrypoints: [entrypoint],
      minify: true,
      outdir: `dist/${group}/${proj}`,
      target: "browser",
      plugins: [cssPlugin],
    });

    if (!success.success) {
      console.error("Error building", group, proj);
      console.error(success.logs);
    }
  }
}
