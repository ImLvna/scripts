import { mkdir, readdir, rm, stat } from "fs/promises";
const dirs = await readdir("src");

await rm("dist", { recursive: true });
await mkdir("dist", { recursive: true });

for (const dir of dirs) {
  if (!(await stat(`src/${dir}`)).isDirectory()) continue;
  const files = await readdir(`src/${dir}`);

  await Bun.build({
    entrypoints: files.map((f) => `src/${dir}/${f}`),
    outdir: `dist/${dir}`,
    target: "browser",
    minify: true,
  });

  for (const _file of files) {
    const fileContents = await Bun.file(
      `./dist/${dir}/${_file.replace(".ts", "")}.js`
    ).text();

    const outFile = Bun.file(
      `./dist/${dir}/${_file.replace(".ts", "")}.bookmarklet.js`
    );

    const bookmarklet = encodeURIComponent(`(async ()=>{${fileContents}})()`);

    await Bun.write(outFile, `javascript:${bookmarklet}`);
  }
}
