# [quran-promise](https://github.com/tjaffri/quran-promise)

[![NPM version](http://img.shields.io/npm/v/quran-promise.svg?style=flat-square)](https://www.npmjs.com/package/quran-promise)
[![NPM downloads](http://img.shields.io/npm/dm/quran-promise.svg?style=flat-square)](https://www.npmjs.com/package/quran-promise)
[![Build Status](http://img.shields.io/travis/tjaffri/quran-promise/master.svg?style=flat-square)](https://travis-ci.org/tjaffri/quran-promise)
[![Coverage Status](https://img.shields.io/coveralls/tjaffri/quran-promise.svg?style=flat-square)](https://coveralls.io/github/tjaffri/quran-promise)
[![Dependency Status](http://img.shields.io/david/tjaffri/quran-promise.svg?style=flat-square)](https://david-dm.org/tjaffri/quran-promise)

> ES2016 async/await (promise) enabled node module for the Holy Quran. Uses the Tanzil corpus: http://tanzil.net.

## Using this Module

For detailed documentation, and code samples for how to use this module in your app or service please visit: https://tjaffri.github.io/quran-promise/.

## Developing this Module

The rest of this `README` describes how you can clone this repo to get the source to develop/test locally. Contributions are very welcome!

### Environment Setup

First, set up your dev tools and node.js:

1. Set up your favourite IDE. We use VSCode: https://code.visualstudio.com/ and you can configure this IDE as follows:
  1. Follow this useful article about JavaScript development in VSCode [here](https://code.visualstudio.com/docs/languages/javascript), including how to debug.
  2. Set up linting in VSCode. You can install eslint globally via `npm install -g eslint` and then install the VSCode `eslint` extension. See [here](http://stackoverflow.com/questions/36327096/vscode-linter-es6-es7-babel-linter) for more info.
2. Install Node.js (version 6.x or higher)
3. Install Git: https://git-scm.com/download

Next, clone the repo and install dependencies.

```sh
$ git clone https://github.com/tjaffri/quran-promise
$ cd quran-promise
$ npm install
```

The quran data is in a sqllite database, and a known good version is checked in. Optionally, ff you want to re-generate it, please run:

```sh
npm run gendb
```

Finally, if you're new to Next Generation JavaScript you might want to brush up on the following resources:

1. [ES6 Training Course](https://es6.io/friend/konstantin) by Wes Bos
2. [You Don't Know JS: ES6 & Beyond](http://amzn.to/2bzvV51) by Kyle Simpson (Dec, 2015)
3. [Understand promises before you start using async/await](https://medium.com/@bluepnume/learn-about-promises-before-you-start-using-async-await-eb148164a9c8#.q2u0j68wd)

### Testing, Running and Publishing

Run one, or a combination of the following commands to lint and test your code:

```sh
$ npm run lint          # Lint the source code with ESLint (runs as part of CI build)
$ npm run lint:fix      # Lint the source code with ESLint, using the --fix option to auto-fix some issues
$ npm test              # Run unit tests with Mocha
$ npm run test:watch    # Run unit tests with Mocha, and watch files for changes
$ npm run test:cover    # Run unit tests with code coverage by Istanbul (runs as part of CI build)
$ npm run coveralls     # Report code coverage to coveralls.io (runs as part of CI build)
```

To launch the documentation site, run:

```sh
$ npm install -g easystatic
$ npm run start:docs    # Launches the docs site locally for testing
$ npm run publish:docs  # Optionally, publishes the doc site to GitHub pages (runs as part of CI build)
```

Finally, to build and publish to npm, you need to run:

```sh
npm run build           # Builds the source, transpiling via babel (runs as part of CI build)
cd dist                 # Publish from the dist folder
npm publish             # Requires credentials allowed to publish to npm
```

## Credits

With thanks, this module acknowledges and depends on the following resources:

1. Tanzil project: http://tanzil.net/
2. EveryAyah: http://everyayah.com/data/status.php
3. The Babel Starter Kit, used to scaffold the initial version of this module: https://github.com/kriasoft/babel-starter-kit/

Finally, a HUGE callout to the  similar npm module https://www.npmjs.com/package/quran. We ended up completely rewriting it,
to support ES2016 async/await (promises), but got inspired by it. We also tried to keep the calling semantics as compatible as possible
to aid anyone who might be migrating from that module.

### License

MIT © 2016 Axis, the Information Professionals.
