const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(
    function(err, id) {
      if (err) {
        console.log('getNextUniqueId callback error: ', err);
      }
      var fileName = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(fileName, text, (err) => {
        if (err) {
          console.log('Create error: ', err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  );
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      console.log('ERROR ON READ ALL: ', err);
    } else {
      var todos = data.map((file) => {
        file = file.slice(0, -4);
        return {id: file, text: file};
      });
      callback(null, todos);
    }
  });
};

exports.readOne = (id, callback) => {
  var fileName = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  var fileName = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(fileName, 'utf8', (err) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(fileName, text, (err) => {
        if (err) {
          console.log('ERROR on UPDATE: ', err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var fileName = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(fileName, (err) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
