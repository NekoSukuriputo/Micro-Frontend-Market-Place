const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const config = withModuleFederationPlugin({

  name: 'remote_user',
  library: { type: 'var', name: 'remote_user' },

  exposes: {
    './mount': './src/mount.ts',
  },

  remotes: {
    "shared_store": `script shared_store@${process.env.NODE_ENV === 'production' ? '/shared-store/' : 'http://localhost:3001/'}shared_store.js`,
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

config.output.library = { type: 'var', name: 'remote_user' };
config.output.scriptType = 'text/javascript';
config.output.publicPath = "auto";

module.exports = config;
