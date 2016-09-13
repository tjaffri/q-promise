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

// Defines file paths
const rootDir = appRootDir.get();
const databaseFilePath = `${rootDir}/db.sqlite`;

class Quran {
  // gets a verse in a chapter
  async get(chapter, verse) {
    const query = `SELECT ar FROM ar WHERE chapter = ${chapter} AND verse = ${verse}`;
    await db.open(databaseFilePath);
    return (await db.get(query)).ar;
  }
}

export default Quran;
