import fs from 'fs'

// This will get the bad words from the txt file and return the array
export const getBadWords = () => {
    fs.readFile('../../list_of_bad_words.txt', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        return data.split('\n')
    });
}