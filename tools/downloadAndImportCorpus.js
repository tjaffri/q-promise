/**
 * quran-promise
 *
 * Copyright © 2016 Axis, the Information Professionals. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import appRootDir from 'app-root-dir';
import db from 'sqlite';
import del from 'del';
import fs from 'fs-promise';
import request from 'request-promise';
import QuranData from '../corpus/quran-data';

// defines data to download from tanzil
const translations = ['en.shakir', 'ur.jawadi', 'hi.hindi'];
const quranType = 'uthmani';

// defines the file paths
const rootDir = appRootDir.get();
const corpusDir = `${rootDir}/corpus`;
const arabicCorpusFilePath = `${corpusDir}/quran-${quranType}.txt`;
const databaseFilePath = `${rootDir}/src/db.sqlite`;

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
  console.log('Downloading Arabic corpus...');

  // download the arabic metadata from tanzil
  await getFile('http://tanzil.net/res/text/metadata/quran-data.js', `${corpusDir}/quran-data.js`);

  // append the module export to the downloaded metadata file
  await fs.appendFile(`${corpusDir}/quran-data.js`, 'module.exports = QuranData;');

  // download the arabic corpus from tanzil
  const url = 'http://tanzil.net/pub/download/download.php';

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
  console.log(`${url} >> ${arabicCorpusFilePath}`);
  await fs.writeFile(arabicCorpusFilePath, contents);
}

// helper method to download the translation corpus for a language
async function downloadTranslation(language) {
  console.log(`Downloading Translation corpus for: ${language}`);

  // download the translation from tanzil
  await getFile(`http://tanzil.net/trans/${language}`, `${corpusDir}/${language}.txt`);
}

// helper method to import the arabic corpus into the database
async function importArabic() {
  console.log(`Importing Arabic corpus from: ${arabicCorpusFilePath}`);

  // read the raw corpus text file into in-memory rows
  // Each row is an array of chapter, verse and arabic text,
  // e.g. [ 1, 1, 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' ]
  const rows = [];
  const contents = await fs.readFile(arabicCorpusFilePath);

  const lines = contents.toString().split('\n');

  for (let line of lines) {
    line = line.trim();
    if (!line || line.match(/^#/)) {
      continue;
    }

    const row = line.split('|');
    rows.push(row);
  }

  // now that we have parsed out rows, create the sqlite database and 'ar' table
  const tableName = 'ar';
  await db.open(databaseFilePath);
  await db.exec(`CREATE TABLE ${tableName} (chapter INTEGER, verse INTEGER, ${tableName} TEXT)`);

  // Insert the arabic text into the 'ar' table, 1k rows at a time
  const insertArabicStatementCommand = `INSERT INTO ${tableName} VALUES (?,?,?)`;
  let insertStatement = await db.prepare(insertArabicStatementCommand);
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // skip invalid rows
    if (!row || row.length !== 3) continue;

    await insertStatement.run(row);
    if (i % 1000 === 0) {
      // after every 1k statements, execute and the re-initialize the statement
      await insertStatement.finalize();
      insertStatement = await db.prepare(insertArabicStatementCommand);
    }
  }

  // Create the chapters table, using the surahs metadata in QuranData.js
  await db.exec('CREATE TABLE chapters (id INTEGER, start INTEGER, ayas INTEGER, ord INTEGER, ' +
    'rukus INTEGER, arname TEXT, tname TEXT, enname TEXT, type TEXT);');

  // Build and run the statement to insert surah metadata into the chapters table
  const insertChaptersStatement = await db.prepare('INSERT INTO chapters ' +
    'VALUES (?,?,?,?,?,?,?,?,?)');

  for (let i = 0; i < QuranData.Sura.length; i++) {
    const surahInfo = QuranData.Sura[i];

    // Add the ID field at the beginning and run the statement
    surahInfo.unshift(i);

    // skip invalid rows
    if (!surahInfo || surahInfo.length !== 9) continue;

    // run
    await insertChaptersStatement.run(surahInfo);
  }

  // execute insert chapters
  await insertChaptersStatement.finalize();

  // Create the juz table, using the juz metadata in QuranData.js
  await db.exec('CREATE TABLE juz (id INTEGER, surah INTEGER, ayah INTEGER)');

  // Build and run the statement to insert juz metadata into the juz table
  const insertJuzStatement = await db.prepare('INSERT INTO juz VALUES (?,?,?)');
  for (let i = 0; i < QuranData.Juz.length; i++) {
    const juzInfo = QuranData.Juz[i];

    // Add the ID field at the beginning and run the statement
    juzInfo.unshift(i);

    // skip invalid rows
    if (!juzInfo || juzInfo.length !== 3) continue;

    // run
    await insertJuzStatement.run(juzInfo);
  }

  // execute insert juz
  await insertJuzStatement.finalize();

  // Create the page table, using the page metadata in QuranData.js
  await db.exec('CREATE TABLE page (page INTEGER, ayah INTEGER)');

  // Build and run the statement to insert page metadata into the page table
  const insertPageStatement = await db.prepare('INSERT INTO page values (?,?)');
  for (let i = 0; i < QuranData.Page.length; i++) {
    const pageInfo = QuranData.Page[i];

    // skip invalid rows
    if (!pageInfo || pageInfo.length !== 2) continue;

    // run
    await insertPageStatement.run(pageInfo);
  }

  // execute insert page
  await insertPageStatement.finalize();
}


// helper method to import a translation into the database
async function importTranslation(translation) {
  console.log(`Importing Translation: ${translation}`);

  // read the raw corpus text file into in-memory rows
  // Each row is an array of chapter, verse and english text,
  // e.g. [ 1, 1, In the name of Allah, the Beneficent, the Merciful ]
  const rows = [];
  const contents = await fs.readFile(`${corpusDir}/${translation}.txt`);

  const lines = contents.toString().split('\n');

  for (let line of lines) {
    line = line.trim();
    if (!line || line.match(/^#/)) {
      continue;
    }

    const row = line.split('|');
    if (row.length > 3) {
      // some translations span two columns, so we append them.
      row[2] += row.pop();
    }

    rows.push(row);
  }

  // now that we have parsed out rows, create the sqlite database and translation table
  const tableName = translation.split('.')[0];
  await db.open(databaseFilePath);
  await db.exec(`CREATE TABLE ${tableName} (chapter INTEGER, verse INTEGER, ${tableName} TEXT)`);

  // Insert the translation text into the translation table, 1k rows at a time
  const insertTranslationStatementCommand = `INSERT INTO ${tableName} VALUES (?,?,?)`;
  let insertStatement = await db.prepare(insertTranslationStatementCommand);
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // skip invalid rows
    if (!row || row.length !== 3) continue;

    await insertStatement.run(row);
    if (i % 1000 === 0) {
      // after every 1k statements, execute and the re-initialize the statement
      await insertStatement.finalize();
      insertStatement = await db.prepare(insertTranslationStatementCommand);
    }
  }
}

// execute as an IIFE: Immediately-Invoked Function Expression (IIFE)
(async function main() {
  try {
    // delete contents of output directory
    del([`${corpusDir}/*`]);

    // Download Arabic corpus from tanzil
    await downloadArabic();

    // Import downloaded corpus into the database
    await importArabic();

    // Download and Import Translations from tanzil
    for (const language of translations) {
      // Download translation for language
      await downloadTranslation(language);

      // Import translation for language
      await importTranslation(language);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}());
