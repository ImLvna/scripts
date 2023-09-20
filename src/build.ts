import { mkdir, readdir, rm, stat } from "fs/promises";
import iife from "./iife";
const dirs = await readdir("src");

await rm("dist", { recursive: true });
await mkdir("dist", { recursive: true });

for (const dir of dirs) {
  if (!(await stat(`src/${dir}`)).isDirectory()) continue;
  const files = await readdir(`src/${dir}`);

  const built = await Bun.build({
    entrypoints: files.map((f) => `src/${dir}/${f}`),
    outdir: `dist/${dir}`,
    target: "browser",
    minify: true,

    plugins: [iife],
  });

  if (!built.success) {
    console.error(built.logs);
    console.error("Build failed");
    process.exit(1);
  }

  for (const _file of files) {
    const fileContents = await Bun.file(
      `./dist/${dir}/${_file.replace(".ts", "")}.js`
    ).text();

    const outFile = Bun.file(
      `./dist/${dir}/${_file.replace(".ts", "")}.bookmarklet.js`
    );

    await Bun.write(outFile, `javascript:${encodeURIComponent(fileContents)}`);
  }
}
