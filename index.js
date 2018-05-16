#!/usr/bin/env node
var p = require('path');

var routers = require('require.all')({
  dir: './routers',
  map: (name, path, isFile) => isFile ? p.basename(name, p.extname(name)).toLowerCase() : name.toLowerCase()
});

var program = require('commander');

program
  .command('devices')
  .description('List the supported devices')
  .option('-b, --brand <brand>')
  .action((brand) => devices(brand));

program
  .command('flash')
  .description('Initiate the flashing process for a specific router')
  .option('-b, --brand <brand>')
  .option('-m, --model <model>')
  .action(flash);

  program.on('--help', function(){
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ flashy devices Ubiquiti');
    console.log('    $ flashy flash -b Xiaomi -m mir3');
    console.log('');
  });

program
  .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.help();
  }

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
