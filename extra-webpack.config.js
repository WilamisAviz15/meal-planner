const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /type-graphql$|@typegoose\/typegoose$/,
      (resource) => {
        resource.request = resource.request.replace(
          /type-graphql/,
          "type-graphql/dist/browser-shim.js"
        );
        resource.request = resource.request.replace(
          /@typegoose\/typegoose/,
          "@typegoose/../../config/typegoose-browser-shim.js"
        );
      }
    ),
  ],
};
