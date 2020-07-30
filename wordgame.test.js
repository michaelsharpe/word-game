const WordGame = require('./wordgame');
const fs = require('fs');

describe('word game', () => {
  describe('constructor', () => {
    it('sets the dictionary property', () => {
      const dictionary = "I am a dictionary of words";

      const wordGame = new WordGame("", dictionary);

      expect(wordGame.dictionary).toEqual(dictionary.split(' ').sort());
    })

    it('starts with an empty high score list', () => {
      const dictionary = "I am a dictionary of words";

      const wordGame = new WordGame();

      expect(wordGame.highScoreList.length).toBe(0);
    });

    it('stores the initial string as a letter count object', () => {
      const dictionary = "I am a dictionary of words";
      const startingString = "aabbbc";

      const wordGame = new WordGame(startingString, dictionary);

      expect(wordGame.letterCount["a"]).toBe(2);
      expect(wordGame.letterCount["b"]).toBe(3);
      expect(wordGame.letterCount["c"]).toBe(1);
    })

    it('defaults to the full word text file', () => {
      const wordList = fs.readFileSync('./wordlist.txt', 'utf-8');

      const wordGame = new WordGame();

      expect(wordGame.dictionary).toEqual(wordList.split(/\n| /).sort());
    })
  });

  describe('submitWord', () => {
    it('accepts a word that does use the letters in the initial string', () => {
      const dictionary = "testing words here ing";
      const initialWord = "testing";
      const testWord = "ing";
      const wordGame = new WordGame(initialWord, dictionary);

      wordGame.submitWord(testWord);

      expect(wordGame.highScoreList[0].word).toBe(testWord);
    });

    it("rejects a word that isn't in the dictionary", () => {
      const dictionary = "";
      const initialWord = "testing";
      const testWord = "testing";
      const wordGame = new WordGame(initialWord, dictionary);

      wordGame.submitWord(testWord);

      expect(wordGame.highScoreList[0]).toBe(undefined);
    });

    it('rejects words that do not use characters from the initial string', () => {
      const dictionary = "testinng";
      const testWord = "blarf";
      const initialWord = "testing";

      const wordGame = new WordGame(initialWord, dictionary);

      wordGame.submitWord(testWord);

      expect(wordGame.highScoreList[0]).toBe(undefined);
    });

    it('does not allow the same word to be used twice', () => {
      const dictionary = "testing";
      const testWord = "testing";
      const initialWord = "testing";

      const wordGame = new WordGame(initialWord, dictionary);
      wordGame.submitWord(testWord);
      wordGame.submitWord(testWord);

      expect(wordGame.highScoreList[1]).toBe(undefined);
    })

    it('gives each word a score based upon the words length', () => {
      const dictionary = "testing words here ing";
      const initialWord = "testing";
      const testWord = "ing";
      const wordGame = new WordGame(initialWord, dictionary);

      wordGame.submitWord(testWord);

      expect(wordGame.highScoreList[0].score).toBe(testWord.length);
    });

    it('orders scores from highest to lowest in the array', () => {
      const dictionary = "testing words here ing";
      const initialWord = "testing";
      const testWord1 = "ing";
      const testWord2 = "testing"
      const wordGame = new WordGame(initialWord, dictionary);

      wordGame.submitWord(testWord1);
      wordGame.submitWord(testWord2);

      expect(wordGame.highScoreList[0].word).toBe(testWord2);
    });

    it('only stores the top 10 entries in memory', () => {
      const dictionary = "q w e r t y u i o p a s d f g h j k l z x c v b n m";
      const initialWord = "qwertyuiopasdfghjklzxcvbnm";
      const wordGame = new WordGame(initialWord, dictionary);

      wordGame.submitWord("a");
      wordGame.submitWord("b");
      wordGame.submitWord("c");
      wordGame.submitWord("d");
      wordGame.submitWord("e");
      wordGame.submitWord("f");
      wordGame.submitWord("g");
      wordGame.submitWord("h");
      wordGame.submitWord("i");
      wordGame.submitWord("j");

      expect(wordGame.highScoreList.length).toBe(10);
      wordGame.submitWord("k");
      expect(wordGame.highScoreList.length).toBe(10);
    });

    it('uses words from the wordlist file by default', () => {
      const initialWord = "qwertyuiopasdfghjklzxcvbnm";
      const wordGame = new WordGame(initialWord);
      wordGame.submitWord('absolved');
      expect(wordGame.highScoreList.length).toEqual(1);

    })
  });

  describe('getWordEntryAtPosition', () => {
    it('returns an entry at a given position', () => {
      const dictionary = "a at the turf";
      const initialWord = "qwertyuiopasdfghjklzxcvbnm";
      const wordGame = new WordGame(initialWord, dictionary);

      wordGame.submitWord("at");
      wordGame.submitWord("a");
      wordGame.submitWord("turf");
      wordGame.submitWord("the");

      expect(wordGame.getWordEntryAtPosition(1)).toBe("turf");
      expect(wordGame.getWordEntryAtPosition(2)).toBe("the");
      expect(wordGame.getWordEntryAtPosition(3)).toBe("at");
      expect(wordGame.getWordEntryAtPosition(4)).toBe("a");
    })
  })

  describe('getScoreAtPosition', () => {
    it('should return the score at the given position', () => {
      const dictionary = "a at the turf";
      const initialWord = "qwertyuiopasdfghjklzxcvbnm";
      const wordGame = new WordGame(initialWord, dictionary);

      wordGame.submitWord("at");
      wordGame.submitWord("a");
      wordGame.submitWord("turf");
      wordGame.submitWord("the");

      expect(wordGame.getScoreAtPosition(1)).toBe(4);
      expect(wordGame.getScoreAtPosition(2)).toBe(3);
      expect(wordGame.getScoreAtPosition(3)).toBe(2);
      expect(wordGame.getScoreAtPosition(4)).toBe(1);
    })
  })
})