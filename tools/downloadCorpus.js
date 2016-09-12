/**
 * quran-promise
 *
 * Copyright © 2016 Axis, the Information Professionals. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const request = require('request-promise');
const fs = require('fs-promise');
const del = require('del');

// defines the output directory
const corpusDir = `${__dirname}/../corpus`;

// defines data to download from tanzil
const translations = ['en.shakir', 'ur.jawadi', 'hi.hindi'];
const quranType = 'uthmani';

// helper method to download a file via GET to a url, overwriting on any conflicts
async function getFile(url, filePath) {
  console.log(`${url} >> ${filePath}`);

  // download
  const contents = await request.get(url);

  // write file
  await fs.writeFile(filePath, contents);
}

// helper method to download the arabic corpus
async function downloadArabic() {
  console.log('downloading Arabic corpus...');

  // download the arabic metadata from tanzil

  await getFile('http://tanzil.net/res/text/metadata/quran-data.js', `${corpusDir}/quran-data.js`);

  // append the module export to the downloaded metadata file
  await fs.appendFile(`${corpusDir}/quran-data.js`, 'module.exports = QuranData;');

  // download the arabic corpus from tanzil
  const url = 'http://tanzil.net/pub/download/download.php';
  const filePath = `${corpusDir}/quran-${quranType}.txt`;

  const options = {
    method: 'POST',
    uri: url,
    form: {
      quranType,
      marks: true,
      sajdah: true,
      alef: true,
      outType: 'txt-2',
      agree: true,
    },
  };

  const contents = await request.post(options);
  console.log(`${url} >> ${filePath}`);
  await fs.writeFile(filePath, contents);
}

// helper method to download the translation corpus for a language
async function downloadTranslation(language) {
  console.log(`downloading Translation corpus for: ${language}`);

  // download the translation from tanzil
  await getFile(`http://tanzil.net/trans/${language}`, `${corpusDir}/${language}.txt`);
}

// execute helper methods
(async function main() {
  try {
    // delete contents of output directory
    del([`${corpusDir}/*`]);

    // Download Arabic Corpus from tanzil
    await downloadArabic();

    // Download Translations from tanzil
    for (const translation of translations) {
      await downloadTranslation(translation);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}());
