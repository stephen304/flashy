#!/usr/bin/env node
var p = require('path');

var routers = require('require.all')({
  dir: './routers',
  map: (name, path, isFile) => isFile ? p.basename(name, p.extname(name)).toLowerCase() : name.toLowerCase()
});

var program = require('commander');

program.command('devices')
  .description('List the supported devices')
  .option('-b, --brand [brand]', 'filter devices by brand')
  .action(devices);

program.command('flash')
  .description('Initiate the flashing process for a specific router')
  .option('-b, --brand <brand>', 'specify the router brand to flash')
  .option('-m, --model <model>', 'specify the router model to flash')
  .option('--ip <ip>', 'specify the router ip to flash')
  .option('-f, --firmware <file>', 'specify the firmware to flash')
  .action(flash);

program.on('--help', function(){
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ flashy devices');
  console.log('    $ flashy devices Ubiquiti');
  console.log('    $ flashy flash -b Xiaomi -m mir3');
  console.log('');
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}

function devices(brand) {
  // Filter if brand was specified
  brand = typeof brand === "string" ? brand.toLowerCase() : null;
  var selection = routers;
  if (brand && routers[brand]) {
    selection = {};
    selection[brand] = routers[brand];
  }

  // Output all applicable rouuter models
  for (var oneBrand in selection) {
    console.log(oneBrand + ":");
    var output = "   ";
    for (var router in routers[oneBrand]) {
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
