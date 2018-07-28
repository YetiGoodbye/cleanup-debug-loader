const getOptions = require('loader-utils').getOptions;
const validateOptions = require('schema-utils');

const defaultMarker = "@#";

const schema = {
  type: 'object',
  marker: { type: 'string' },
  dropInDev: { type: 'string' },
  dropInProd: { type: 'string' },
};

const lineStart = "(^|\n)";
const whiteSpace = "\s*";
const restLine = "\s*";

function cleanup(source){
  
  console.log("\n\n\n---------------------------------------");
  // console.log(this._compilation.compiler.options.mode);
  const devmode = (this._compilation.compiler.options.mode === "development");
  
  var options = getOptions(this);
  options = options || {};
  options.marker = options.marker || defaultMarker;
  options.dropInDev = options.dropInDev || '+';
  options.dropInProd = options.dropInProd || '-';

  validateOptions(schema, options, 'Clenup Debug Loader');
  console.log(options);

  const dropInDev  = RegExp(`((^|\n)\s*)${options.marker}[${options.dropInDev}](.*)`,  'g');
  const dropInProd = RegExp(`((^|\n)\s*)${options.marker}[${options.dropInProd}](.*)`, 'g');

  // /((^|\n)\s*)@@[$](.*)/g

  if(devmode){
    return source.replace(dropInDev, '').replace(dropInProd,'$1$3');
  } else {
    return source.replace(dropInProd, '').replace(dropInDev,'$1$3');
  }
}


module.exports = cleanup;
