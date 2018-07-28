# cleanup-debug-loader
It's just couple of regex in build process. Depending on environment running, strips out from source code lines marked in special way, alowing you not to cary about cleaning out debugging code from production.
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
```javascript
{
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{ loader: 'cleanup-debug-loader') }],
    }],
  },
};
```
## Configuration
Loader supports several options. To recognize if this is development environment, `mode` option should be presented in webpack configuration. You can also change start marker (default is #) and hallmarks for dev and nondev modes (defaults `+` and `-`) with a
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
          marker: '@@',
          dropInDev: '[$]',
          dropInProd: 'p',
        }
      }],
    }],
  },
}; 
```
## Usage
Prepend lines you wish to keep only in dev mode with `#-` (any whitespace allowed). If there is something you want to strip out from development, prepend it with with `#+`.
Or wrap entire blocks as shown below. Nesting is not supported.

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
Webpack is not recommending to do so. But it's still working for now, and I'm ok with that. If you know more 	
righteous way to solve this problem, please leave a comment or contact me!

### Thanks and enjoy!
