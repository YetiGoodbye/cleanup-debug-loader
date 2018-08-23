# cleanup-debug-loader
It's just couple of regex in build process, intended to filter out lines or blocks of unnecessary code depending on running evironment (development or production). It allows you not to cary about cleaning out debug code from production.
Now instead of
```javascript
if(node.ENV === 'development'){
  console.log('blablabla');
}
```
you just can write
``` javascript
#- console.log('...');
```

## Installation
```
npm i --save-dev cleanup-debug-loader
```
##### webpack.config.js
It must be the last js loader in pipeline, or you get a syntax error
```javascript
{
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'any-other-js-loader',
    },{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{ loader: 'cleanup-debug-loader') }],
    }],
  },
};
```
## Configuration
Loader supports several options. To find out if this is development environment, loader use `mode` webpack option. So it should be presented in configuration file. You can also change start marker (default is #) and hallmarks for dev and nondev modes (defaults `+` and `-`).
##### little attention
All options are injected directly into regexp. So if changing defaults, do it with caution if using special regexp characters (should be wrapped with square brackets).

### Configuration example:
```javascript
{
  module: {
    mode: 'development',
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'cleanup-debug-loader',
        options: {
          marker: '@@',  // change default
          dropInDev: '[$]', // it's regexp special
          dropInProd: 'p',
        }
      }],
    }],
  },
}; 
```
## Usage
Prepend lines you wish to keep only in dev mode with `#-` (any whitespace before and after is allowed). If there is something you want to strip out from development, prepend it with with `#+`.
You can also wrap entire blocks as shown below. Nesting is not supported.
```javascript
#- console.log('This line will be keeped only in development')

#+ console.log('This line will be dropped from development')

#-[
console.log('This entire block will')
console.log('be keeped only in development')
#-]

#+[
console.log("Hello, I'm turtle")
#+]

```
## Warning!
Loader relies on `_compilation` property of loader context https://webpack.js.org/api/loaders/#this-_compilation.
Webpack is not recommending to do so. But it's still working for now, and I'm ok with that.

## Issues
If you have any issues with it please report https://github.com/YetiGoodbye/cleanup-debug-loader/issues

### Thanks and enjoy!
