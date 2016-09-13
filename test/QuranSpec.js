/**
 * quran-promise
 *
 * Copyright © 2016 Axis, the Information Professionals. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import Quran from '../src/Quran';

describe('Quran', () => {

  describe('Quran.get(...)', () => {

    it('should return a numbered verse of a numbered ayat', async () => {
      // Fetch verse 1 of Al Fatiha via get
      const quran = new Quran();
      const verses = await quran.get(1, 3);

      // TEST: Surah Fatiha has 7 ayahs, of which we are fetching only the 3rd
      expect(verses.length === 1);

      // TEST: Arabic text of the 3rd ayah of Surah Fatiha matches
      expect(verses[0]).to.be.equal('ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
    });

    it('should return a full numbered ayat', async () => {
      // Fetch Al Fatiha via get
      const quran = new Quran();
      const verses = await quran.get(1);

      // TEST: Surah Fatiha has 7 ayahs
      expect(verses.length === 7);

      // TEST: Arabic text of the 3rd ayah of Surah Fatiha matches
      expect(verses[2]).to.be.equal('ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
    });
  });
});
