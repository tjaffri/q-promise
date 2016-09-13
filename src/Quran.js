/**
 * quran-promise
 *
 * Copyright © 2016 Axis, the Information Professionals. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import appRootDir from 'app-root-dir';
import db from 'sqlite';
import util from 'util';

// Defines file paths
const rootDir = appRootDir.get();
const databaseFilePath = `${rootDir}/db.sqlite`;

class Quran {
  // Helper method to get arabic verses from a chapter
  async get(chapterId, verseId = undefined) {
    // use the low level select function to query the verses
    const response = await this.select({ chapter: chapterId, verse: verseId });

    // return arabic strings only (map from array)
    let verses;
    if (!!response && response.length > 0) {
      verses = response.map(x => x.ar);
    }

    return verses;
  }

  // Helper method to get information about a chapter
  // Note: If no chapterId is specified then this method returns information
  //       about all chapters.
  async chapter(chapterId) {
    let query = 'SELECT * FROM chapters ';

    if (chapterId && chapterId > 114) {
      throw new Error(`chapterId specified is out of bounds: ${chapterId}.`);
    }

    if (!!chapterId) {
      if (!util.isNumber(chapterId)) {
        throw new Error(`Invalid chapterId: ${chapterId}`);
      }

      query += `WHERE id=${chapterId}`;
    }

    return await db.all(query);
  }

  // Helper method to get information about a juz
  // Note: If no juzId is specified then this method returns information
  //       about all juz.
  async juz(juzId) {
    let query = 'SELECT * FROM juz ';

    if (juzId && juzId > 30) {
      throw new Error(`JuzId specified is out of bounds: ${juzId}.`);
    }

    if (!!juzId) {
      if (!util.isNumber(juzId)) {
        throw new Error(`Invalid juzId: ${juzId}`);
      }

      query += `WHERE id=${juzId}`;
    }

    return await db.all(query);
  }

  // Helper method to do a free-form text search of the Quran
  async search(language, text) {
    const query = `SELECT chapter, verse, ${language} FROM ${language}` +
      `WHERE ${language} LIKE "%${text}%";`;

    return db.all(query);
  }

  // Full low level select method. Allows you to specify:
  // 1. Filters: Any array to filter on, e.g. { verse: 2, chapter: 5 }
  // 2. Options for offset and limit, e.g. { limit: 10, offset: 5 }
  // 3. Translations: An array of translations to return, e.g. ['en', 'hi']
  async select(filters, options, translations = ['ar']) {
    let query = 'SELECT * FROM ar a ';
    const params = [];

    // join translations from other tables, if any are requested
    // beyond arabic
    if (!(translations.length === 1 && translations[0] === 'ar')) {
      translations.forEach(l => {
        query += `JOIN ${l} USING(chapter, verse) `;
      });
    }

    // add filters (where clauses)
    if (!!filters) {
      Object.keys(filters).forEach(k => {
        const f = filters[k];

        if (!!f) {
          if (util.isArray(f)) {
            params.push(`a.${k} IN (${f.join(',')})`);
          } else {
            params.push(`a.${k}=${f}`);
          }
        }
      });

      query += `WHERE ${params.join(' AND ')}`;
    }

    // apply sorting, offset and limit options
    query += ' ORDER BY chapter, verse ';
    if (!!options) {
      ['limit', 'offset'].forEach(x => {
        if (options[x]) {
          query += `${x} ${options[x]} `;
        }
      });
    }

    await db.open(databaseFilePath);
    return await db.all(query);
  }
}

export default Quran;
