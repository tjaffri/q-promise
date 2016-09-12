# [quran-promise](https://github.com/axis-tip/quran-promise)

[![NPM version](http://img.shields.io/npm/v/quran-promise.svg?style=flat-square)](https://www.npmjs.com/package/quran-promise)
[![NPM downloads](http://img.shields.io/npm/dm/quran-promise.svg?style=flat-square)](https://www.npmjs.com/package/quran-promise)
[![Build Status](http://img.shields.io/travis/axis-tip/quran-promise/master.svg?style=flat-square)](https://travis-ci.org/axis-tip/quran-promise)
[![Coverage Status](https://img.shields.io/coveralls/axis-tip/quran-promise.svg?style=flat-square)](https://coveralls.io/axis-tip/quran-promise)
[![Dependency Status](http://img.shields.io/david/axis-tip/quran-promise.svg?style=flat-square)](https://david-dm.org/axis-tip/quran-promise)

> ES6 promise enabled node module for the Holy Quran. Uses the Tanzil corpus: http://tanzil.net.

## Using this Module

For detailed documentation, and code samplesm for how to use this module in your app or service please visit: https://axis-tip.github.io/quran-promise/.

## Developing this Module

The rest of this `README` describes how you can clone this repo to get the source to develop/test locally. Contributions are
very welcome!

### Environment Setup

```sh
$ git clone https://github.com/axis-tip/quran-promise
$ cd quran-promise
$ npm install
```

### How to Test

Run one, or a combination of the following commands to lint and test your code:

```sh
$ npm run lint          # Lint the source code with ESLint (runs as part of CI build)
$ npm run lint:fix      # Lint the source code with ESLint, using the --fix option to auto-fix some issues
$ npm test              # Run unit tests with Mocha
$ npm run test:watch    # Run unit tests with Mocha, and watch files for changes
$ npm run test:cover    # Run unit tests with code coverage by Istanbul (runs as part of CI build)
```

To launch the documentation site, run:

```sh
$ npm install -g easystatic
$ npm start
```

## Credits

With thanks, this module acknowledges and depends on the following resources:

1. Tanzil project: http://tanzil.net/
2. EveryAyah: http://everyayah.com/data/status.php
3. The Babel Starter Kit, used to scaffold the initial version of this module: https://github.com/kriasoft/babel-starter-kit/

Also, there is a similar npm module https://www.npmjs.com/package/quran which is great, but does not currently support
ES6 promises. The purposes of this module is to add this capability, and since this will be a significant breaking changes
it is being done as a new module.

### License

MIT © 2016 Axis, the Information Professionals.
