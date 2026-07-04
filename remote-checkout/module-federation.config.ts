const isProd = process.env.NODE_ENV === "production";

export const mfConfig = {
  name: "remote_checkout",
  exposes: {
    "./mount": "./src/mount.ts",
  },
  remotes: {
    shared_store: `shared_store@${isProd ? '/shared-store/' : 'http://localhost:3001/'}mf-manifest.json`,
  },
  shared: ["svelte"],
  dts: false,
};
