---
id: home
title: quran-promise ∙ ES2016 async/await (promise) enabled node module for the Holy Quran.
---

# Welcome!

ES2016 async/await (promise) enabled node module for the Holy Quran.

> **Note:** This module is still a work in progress, so these usage docs are not great
> yet. In the meantime, you can check out our [automated tests](https://github.com/axis-tip/quran-promise/tree/master/test) 
> for reference if you want to get started. Contributions to these docs very welcome!

## Getting Started

Here's how you get started with using this library.

```bash
$ npm install quran-promise --save
```

Once installed, here's how you can call it with ES2016 async/await syntax:

```js
import Quran from 'quran-promise';

const quran = new Quran();
let chapters = await quran.chapters();  // metadata about all chapters (surahs)
```

Ofcourse, since await is just short-hand for promises you can also use your favorite promise library
instead.
