"use strict";
const fs = require("fs"),
  path = require("path"),
  argv = require("minimist")(process.argv.slice(2));

if (argv._.length > 1)
  throw new Error(
    `sofe-deplanifester expects only a single argument, which is the configuration file`
  );

let config = {
  urlSafeList: [
    "https://unpkg.com/",
    "https://pkgs.dev.azure.com/if-it/Baltics/_packaging/baltic/npm/registry/",
  ],
  manifestFormat: "importmap",
  username: "admin",
  password: process.env.IMPORT_MAP_DEPLOYER_PASSWORD,
  locations: {
    dev: {
      azureContainer: "$web",
      azureBlob: "importmap.json",
      azureConnectionString: process.env.AZURE_STORAGE_ACCOUNT_CONN_STRING,
      azureAccount: process.env.AZURE_STORAGE_ACCOUNT,
      azureAccessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
    },
  },
};
if (argv._.length === 1) {
  config = require(path.join(process.cwd(), argv._[0]));
}

if (argv._.length === 0) {
  //see if the default config.json exists
  if (fs.existsSync(path.resolve(__dirname, "../config.json"))) {
    config = require("../config.json");
  }
}

exports.setConfig = (newConfig) => (config = newConfig);
exports.getConfig = () => config;
