const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFileAsync(exports.counterFile)
    .then((file) => {
      callback(null, Number(file));
    })
    .catch((err) => {
      callback(null, 0);
    });
  // fs.readFile(exports.counterFile, (err, fileData) => {
  //   if (err) {
  //     callback(null, 0);
  //   } else {
  //     callback(null, Number(fileData));
  //   }
  // });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFileAsync(exports.counterFile, counterString)
    .then(() => {
      callback(null, counterString);
    })
    .catch((err) => {
      throw (err);
    });

  // fs.writeFile(exports.counterFile, counterString, (err) => {
  //   if (err) {
  //     throw ('error writing counter');
  //   } else {
  //     callback(null, counterString);
  //   }
  // });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounter(function(err, data) {
    if (err) {
      console.log('Error for getNextUniqueId: ', err);
    }
    writeCounter(data + 1, callback);
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
