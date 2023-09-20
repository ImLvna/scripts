import { BunPlugin } from "bun";

const plugin: BunPlugin = {
  name: "Async iife",
  setup(build) {
    build.onLoad({ filter: /ts/ }, async (args) => {
      const file = await Bun.file(args.path).text();
      return {
        contents: `(async()=>{${file}})()`,
      };
    });
  },
};

export default plugin;
