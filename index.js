const getOptions = require('loader-utils').getOptions;
const validateOptions = require('schema-utils');

const defaultMarker = "@#";

const schema = {
  type: 'object',
  marker: { type: 'string' },
  stripDev: { type: 'string' },
  stripNonDev: { type: 'string' },
};

function cleanup(source){
  
  console.log("\n\n\n---------------------------------------");
  // console.log(this._compilation.compiler.options.mode);
  const devmode = (this._compilation.compiler.options.mode === "development");
  
  var options = getOptions(this);
  options = options || {};
  options.marker = options.marker || defaultMarker;
  options.stripDev = options.stripDev || '+';
  options.stripNonDev = options.stripNonDev || '-';

  validateOptions(schema, options, 'Clenup Debug Loader');
  console.log(options);

  
  const devmatch    = options.marker + '[' + options.stripDev    + ']';
  const nondevmatch = options.marker + '[' + options.stripNonDev + ']';

  const stripLineRegex = RegExp(`^\s*(${devmatch})|(${nondevmatch})`);
  // const stripLineRegex = RegExp(`^\s*${options.marker}[${options.stripDev}${options.stripNonDev}]\s`);
  console.log("regex: ", stripLineRegex);

  var lines = source.split("\n");
  var i = 0;
  while(i < lines.length){
    if(stripLineRegex.test(lines[i])){
      console.log("1: '" + RegExp.$1 + "';2: '" + RegExp.$2 + "'");
      if(RegExp.$1){
        console.log("match 1");
        if(devmode) {
          lines.splice(i, 1);
          console.log("splice dev");
        } else {
          lines[i] = lines[i].replace(options.marker + options.stripDev, '');
          console.log("replace nondev" + options.marker + options.stripDev);
          i++;
        }
      } else {
        console.log("match 2");
        if(devmode) {
          lines[i] = lines[i].replace(options.marker + options.stripNonDev, '');
          console.log("replace dev" + options.marker + options.stripNonDev);
          console.log(lines[i]);
          i++;
        } else {
          lines.splice(i, 1);
          console.log("splice nondev");
        }
      }
    } else {
      i++;
    }
  }
  // console.log("afterwhile");
  console.log("---------------------------------------\n\n\n");

  return lines.join("\n");
}



module.exports = cleanup;
