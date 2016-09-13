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
  // Helper method to get verses from a chapter
  async get(chapter, verse = undefined) {
    const response = await this.search({ chapter, verse });

    let verses;
    if (!!response && response.length > 0) {
      verses = response.map(x => x.ar);
    }

    return verses;
  }

  // Full low level search method. Allows you to specify:
  // 1. Filters: Any array to filter on, e.g. { verse: 2, chapter: 5 }
  // 2. Options for offset and limit, e.g. { limit: 10, offset: 5 }
  // 3. Translations: An array of translations to return, e.g. ['en', 'hi']
  async search(filters, options, translations = ['ar']) {
    let query = 'SELECT * FROM ar a ';
    const params = [];

    // join translations from other tables, if any are requested
    // beyond arabic
    if (translations.length !== 1 && translations[0] === 'ar') {
      translations.forEach(l => {
        query += `JOIN ${l} USING(chapter, verse)`;
      });
    }

    // add filters (where clauses)
    if (!!filters) {
      Object.keys(filters).forEach(k => {
        const f = filters[k];
        if (!!f) {
          if (util.isArray(f)) {
            params.push(`a.${k} IN (${f.join(',')}')`);
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
