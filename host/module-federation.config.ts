const isProd = process.env.NODE_ENV === "production";

export const mfConfig = {
  name: "host",
  exposes: {},
  remotes: {
    shared_store: `shared_store@${isProd ? '/shared-store/' : 'http://localhost:3001/'}mf-manifest.json`,
    remote_product: `remote_product@${isProd ? '/remote-product/' : 'http://localhost:3002/'}mf-manifest.json`,
    remote_detail_cart: `remote_detail_cart@${isProd ? '/remote-detail-cart/' : 'http://localhost:3003/'}mf-manifest.json`,
    remote_checkout: `remote_checkout@${isProd ? '/remote-checkout/' : 'http://localhost:3004/'}mf-manifest.json`,
    remote_user: `remote_user@${isProd ? '/remote-user/' : 'http://localhost:3005/'}remoteEntry.js`,
  },
  shared: ["react", "react-dom"],
  dts: false,
};
