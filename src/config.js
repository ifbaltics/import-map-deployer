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
    "https://unpkg.com",
    "https://importmap.balticit.ifint.biz",
    "https://nginxstaticstorepdev.z6.web.core.windows.net",
    "https://nginxstaticstoreprod.z6.web.core.windows.net",
  ],
  manifestFormat: "importmap",
  username: "admin",
  password: process.env.IMPORT_MAP_DEPLOYER_PASSWORD,
  locations: {
    "app-dev": {
      azureContainer: "$web",
      azureBlob: "importmap/app-dev/importmap.json",
      azureAccount: "nginxstaticstorepdev",
      azureAccessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY_DEV,
    },
    "app-stag": {
      azureContainer: "$web",
      azureBlob: "importmap/app-stag/importmap.json",
      azureAccount: "nginxstaticstorepdev",
      azureAccessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY_DEV,
    },
    "app-prod": {
      azureContainer: "$web",
      azureBlob: "importmap/app-prod/importmap.json",
      azureAccount: "nginxstaticstoreprod",
      azureAccessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY_PROD,
    }
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
