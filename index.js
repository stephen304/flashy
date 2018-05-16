#!/usr/bin/env node
// require('yargs')
//   .command('devices [brand]', 'list supported devices', (yargs) => {
//     yargs
//       .positional('brand', {
//         describe: 'filter devices by brand'
//       })
//   }, (argv) => {
//     devices(argv.brand)
//   })
//   .command('flash [brand] [model] --ip [ip-address]', 'flash the specified device', (yargs) => {
//     yargs
//       .positional('brand', {
//         describe: 'specify the brand'
//       })
//       .positional('model', {
//         describe: 'specify the model'
//       })
//       .default('ip', '192.168.1.1')
//
//   }, (argv) => {
//     flash(argv.brand, argv.model, argv.ip)
//   })
//   .argv
var p = require('path');

var routers = require('require.all')({
  dir: './routers',
  map: (name, path, isFile) => isFile ? p.basename(name, p.extname(name)).toLowerCase() : name.toLowerCase()
});

var program = require('commander');
program
  .command('devices [brand]')
  .description('List the supported devices; specify brand to filter')
  .action((brand) => devices(brand));

program
  .command('flash [brand] [model] [ip]')
  .description('Initiate the flashing process for a specific router')
  .action(flash);

program
  .parse(process.argv);

function devices(selectedBrand) {
  var selection = routers;
  if (selectedBrand && routers[selectedBrand.toLowerCase()]) {
    selection = {};
    selection[selectedBrand.toLowerCase()] = routers[selectedBrand.toLowerCase()];
  }

  for (var brand in selection) {
    console.log(brand + ":");
    var output = "   ";
    for (var router in routers[brand]) {
      output += " " + router;
    }
    if (output.trim()) {
      console.log(output);
    }
  }
}

function flash(brand, model, ip) {
  if ( ! (brand && model && ip) ) {
    console.log("Required parameters missing:" + (brand ? "" : " [brand]") + (model ? "" : " [model]") + (ip ? "" : " [ip]"));
    return false;
  }
  console.log("flashing the " + brand + " " + model + " at: " + ip);
}
