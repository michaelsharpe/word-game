const fs = require("fs");

const wordList = fs.readFileSync("./wordlist.txt", "utf-8");

// set default here to results of reading the wordlist.txt file
WordGame = function (startingString = "", dictionary = wordList) {
  this.dictionary = dictionary.split(/\n| /).sort();

  this.highScoreList = [];

  this.letterCount = countCharacters(startingString);

  /*
    Checks a dicionary utilizing a binary search to see if a word exists in it.

    @param    word         the word that is being search for
    @returns  boolean      A boolean designating whether the word exists or not   
  */
  this.checkDictionary = function (word) {
    let low = 0;
    let high = this.dictionary.length - 1;
    let result = false;

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      let guess = this.dictionary[mid];

      if (guess === word) {
        result = true;
      }

      if (guess > word) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return result;
  };

  /*
  PRIVATE
  Counts characters in a given string and talleys them up on an object

  @param string the string to count 
  @returns object an object where every key is a letter and the value is the number of times it occurs
  */
  function countCharacters(string) {
    return string.split("").reduce((acc, char) => {
      if (!acc[char]) {
        acc[char] = 1;
      } else {
        acc[char] += 1;
      }

      return acc;
    }, {});
  }

  /*
  Checks two word count objects to see if one can contain the other

  @param  word word to check the characters of
  @preturs boolean whether the word is valid or not
  */
  this.lettersMatch = function (word) {
    const letterCount = this.letterCount;
    return !Object.entries(countCharacters(word)).some(
      ([char, count]) => count > letterCount[char]
    );
  };

  /* 
  Checks to see if a word already exists in the highscore list
  @param word string
  @returns boolean whether the word exists or not
  */
  this.checkHighScore = function (word) {
    return !this.highScoreList.some((entry) => entry.word === word);
  };

  /* 
  Runs all the validations in order of cost/complexity. Since it is an && it will stop when it hits a false
  @param word string
  @returns boolean whether the word is valid
  */

  this.validateWord = function (word) {
    return (
      this.lettersMatch(word) &&
      this.checkHighScore(word) &&
      this.checkDictionary(word)
    );
  };

  /*
Submit a word . A word passes if its letters are used in the base string and if it is in a provided dictionary.
If a words score high higher than the lowest in the socre list, it is added. Multiple submissions are allowed, bu the earlist ranks highest.	
All entries in the high schore list be unique.
	
@param word. Players submission.  Assumed to be lowercased with no sppcial characters.
*/

  this.submitWord = function (word) {
    if (this.validateWord(word)) {
      this.highScoreList = [...this.highScoreList, { score: word.length, word }]
        .sort((entry1, entry2) => {
          return entry2.score - entry1.score;
        })
        .slice(0, 10);
    } else {
      return "incorrect";
    }
  };

  /*
Fetches an item in the high score list according to position.  Will only ever be between 1 and 10.
@param position Rank in high score list between 1 and 10
@return tthe word at the position, or null if not found
*/
  this.getWordEntryAtPosition = function (position) {
    return this.highScoreList[position - 1].word;
  };

  /*
Returns the score at a given position in the high score list.
 
@param position Position in list between 1 and 10.
@return the score at that position or null.
*/
  this.getScoreAtPosition = function (position) {
    return this.highScoreList[position - 1].score;
  };
};

module.exports = WordGame;
