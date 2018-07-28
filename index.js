const validateOptions = require('schema-utils');

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

  const devmode = (this._compilation.compiler.options.mode === "development");
  
  var options = this.query;
  options = options || {};
  const m = options.marker = options.marker || '@#';
  const dd = options.dropInDev = options.dropInDev || '[+]';
  const dp = options.dropInProd = options.dropInProd || '[-]';

  validateOptions(schema, options, 'Clenup Debug Loader');

  const dropInDev  =     RegExp(`(^\s*)${m}${dd}(.*)`,  'gm');

  const dropBlockInDev  = RegExp(
    '^\\s*' + m + dd + '\\[\\s*' +
    '(\\n(.*\\n)*)\\s*' + m + dd + '\\]\\s*\\n',
    'gm');

  const dropInProd =      RegExp(`(^\s*)${m}${dp}(.*)`, 'gm');

  const dropBlockInProd = RegExp(
    '^\\s*' + m + dp + '\\[\\s*' +
    '(\\n(.*\\n)*)\\s*' + m + dp + '\\]\\s*\\n',
    'gm');

  if(devmode){
    return source
      .replace(dropBlockInDev, '')
      .replace(dropBlockInProd, '$1')
      .replace(dropInDev, '')
      .replace(dropInProd,'$1$2');
  } else {
    return source
      .replace(dropBlockInDev, '$1')
      .replace(dropBlockInProd, '')
      .replace(dropInDev,'$1$2')
      .replace(dropInProd, '');
  }
}


module.exports = cleanup;
