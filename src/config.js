"use strict";
const fs = require("fs"),
  path = require("path"),
  argv = require("minimist")(process.argv.slice(2));

if (argv._.length > 1)
  throw new Error(
    `sofe-deplanifester expects only a single argument, which is the configuration file`
  );

function createLocations(sites) {
  let locations = {}
  sites.forEach(site => {
    const devLocation = site + "-dev";
    const stageLocation = site + "-stage";
    const prodLocation = site;

    locations[devLocation] = {
      azureContainer: "$web",
      azureBlob: "importmap/" + devLocation + "/importmap.json",
      azureAccount: "nginxstaticstorepdev",
      azureAccessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY_DEV,
    }
    locations[stageLocation] = {
      azureContainer: "$web",
      azureBlob: "importmap/" + stageLocation + "/importmap.json",
      azureAccount: "nginxstaticstorepdev",
      azureAccessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY_DEV,
    }
    locations[prodLocation] = {
      azureContainer: "$web",
      azureBlob: "importmap/" + prodLocation + "/importmap.json",
      azureAccount: "nginxstaticstoreprod",
      azureAccessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY_PROD,
    }
  });

  return locations;
}

const locations = createLocations(["app", "swarm"]);

let config = {
  manifestFormat: "importmap",
  username: "admin",
  password: process.env.IMPORT_MAP_DEPLOYER_PASSWORD,
  locations
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
