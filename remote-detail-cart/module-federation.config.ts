export const mfConfig = {
  name: "remote_detail_cart",
  exposes: {
    "./mount": "./src/mount.ts",
  },
  remotes: {
    shared_store: "shared_store@http://localhost:3001/mf-manifest.json",
  },
  shared: ["vue"],
  dts: false,
};
