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
      const quran = new Quran();
      const ayat = await quran.get();
      expect(ayat).to.be.equal('ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
    });
  });
});
