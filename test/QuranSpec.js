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

  describe('Quran.chapter(...)', () => {

    it('should return info about a chapter', async () => {
      // Fetch info about chapter 1
      const quran = new Quran();
      const chapters = await quran.chapter(1);

      // TEST: We are getting metadata for 1 chapter
      expect(chapters.length === 1);

      // TEST: Surah Fatiha is Meccan
      expect(chapters[0].type).to.be.equal('Meccan');
    });

    it('should return info about all chapters', async () => {
      // Fetch info about all chapters
      const quran = new Quran();
      const chapters = await quran.chapter();

      // TEST: There are 114 surahs
      expect(chapters.length === 115);

      // TEST: Surah Al-Nas is Meccan
      expect(chapters[chapters.length - 1].type).to.be.equal('Meccan');
    });
  });

  describe('Quran.juz(...)', () => {

    it('should return info about a juz', async () => {
      // Fetch info about juz 28
      const quran = new Quran();
      const juz = await quran.juz(28);

      // TEST: We are getting metadata for 1 juz
      expect(juz.length === 1);

      // TEST: 28rd juz starts from surah 58, ayat 1
      expect(juz[0].surah).to.be.equal(58);
      expect(juz[0].ayah).to.be.equal(1);
    });

    it('should return info about all juz', async () => {
      // Fetch info about all juz
      const quran = new Quran();
      const juz = await quran.juz();

      // TEST: There are 30 juz, but this query returns 31 entires
      // since it demarcates when the start and end
      expect(juz.length === 31);

      // TEST: Last juz starts from surah 78, ayat 1
      expect(juz[29].surah).to.be.equal(78);
      expect(juz[29].ayah).to.be.equal(1);

      // TEST: Last juz ends at the end of the quran (surah 114)
      expect(juz[30].surah).to.be.equal(115);
      expect(juz[30].ayah).to.be.equal(1);
    });

    it('should allow querying for verses in the juz', async () => {
      // Fetch info about juz 28 (i.e. where it starts)
      const quran = new Quran();
      const juz = await quran.juz(28);

      // Now fetch top 10 verses from verses in the juz
      const verses = await quran.select({ chapter: juz[0].surah },
        { offset: juz[0].ayah - 1, limit: 10 });

      // TEST: There are 10 verses fetched
      expect(juz.length === 10);

      // TEST: Arabic text of the 6th verse of the juz matches
      expect(verses[5].ar.startsWith('يَوْمَ يَبْعَثُهُمُ ٱللَّهُ'));
    });
  });

  describe('Quran.select(...)', () => {

    it('should return a full numbered chapter in arabic', async () => {
      // Fetch Al Fatiha via select
      const quran = new Quran();
      const verses = await quran.select({ chapter: 1 });

      // TEST: Surah Fatiha has 7 ayahs
      expect(verses.length === 7);

      // TEST: Arabic text of the 3rd ayah of Surah Fatiha matches
      expect(verses[2].ar).to.be.equal('ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
    });

    it('should return a full numbered chapter with a translation', async () => {
      // Fetch Al Fatiha via select with a translation
      const quran = new Quran();
      const verses = await quran.select({ chapter: 1 }, {}, ['ur']);

      // TEST: Surah Fatiha has 7 ayahs
      expect(verses.length === 7);

      // TEST: Arabic text of the 3rd ayah of Surah Fatiha matches
      expect(verses[2].ar).to.be.equal('ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');

      // TEST: Urdu text of the 3rd ayah of Surah Fatiha matches
      expect(verses[2].ur).to.be.equal('وہ عظیم اوردائمی رحمتوں والا ہے');
    });

    it('should return top ayats in arabic', async () => {
      // Fetch Al Fatiha via select with top options
      const quran = new Quran();
      const verses = await quran.select({ chapter: 1 }, { limit: 3 });

      // TEST: Surah Fatiha has 7 ayahs, of which we are fetching 3
      expect(verses.length === 3);

      // TEST: Arabic text of the 3rd ayah of Surah Fatiha matches
      expect(verses[2].ar).to.be.equal('ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
    });

    it('should return some select ayats in multiple languages', async () => {
      // Fetch Al Fatiha via select with top options
      const quran = new Quran();
      const verses = await quran.select({ chapter: 1, verse: [2, 4, 6] }, {}, ['en', 'ur']);

      // TEST: Surah Fatiha has 7 ayahs, of which we are fetching 3
      expect(verses.length === 3);

      // TEST: Urdu text of the 4th ayah of Surah Fatiha matches
      expect(verses[1].ur).to.be.equal('روزِقیامت کا مالک و مختار ہے');

      // TEST: English text of the 4th ayah of Surah Fatiha matches
      expect(verses[1].en).to.be.equal('Master of the Day of Judgment.');
    });
  });
});
