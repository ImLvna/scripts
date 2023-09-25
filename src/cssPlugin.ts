import { BunPlugin } from "bun";

const plugin: BunPlugin = {
  name: "cssPlugin",
  setup: (config) => {
    config.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = await Bun.file(args.path).text();
      return {
        loader: "js",
        contents: `export default \`${css}\``,
      };
    });
  },
};

export default plugin;
