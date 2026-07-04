const isProd = process.env.NODE_ENV === "production";

export const mfConfig = {
  name: "remote_product",
  exposes: {
    "./App": "./src/App.tsx",
  },
  remotes: {
    shared_store: `shared_store@${isProd ? '/shared-store/' : 'http://localhost:3001/'}mf-manifest.json`,
  },
  shared: ["react", "react-dom"],
  dts: false,
};
