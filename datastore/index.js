const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
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
      var date = Date(Date.now()).split(' ').splice(0, 5).join(' ');
      var options = {
        text: `${text}`,
        createTime: `${date}`,
        updateTime: null
      };
      fs.writeFileAsync(fileName, JSON.stringify(options))
        .then(() => {
          callback(null, { id, text });
        })
        .catch((err) => {
          console.log('Create error: ', err);
        });
      // fs.writeFile(fileName, text, (err) => {
      //   if (err) {
      //     console.log('Create error: ', err);
      //   } else {
      //     callback(null, { id, text });
      //   }
      // });
    }
  );
};

exports.readAll = (callback) => {
  fs.readdirAsync(exports.dataDir)
    .then((data) => {
      var todos = data.map((file) => {
        var id = file.slice(0, -4);
        var filePath = path.join(exports.dataDir, file);
        return fs.readFileAsync(filePath, 'utf8')
          .then((text) => {
            var obj = JSON.parse(text);
            return { id, text: obj.text };
          })
          .catch((err) => {
            console.log('Error in readFileAsync: ', err);
          });
      });
      return todos;
    })
    .then((todos) => {
      return Promise.all(todos);
    })
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.log('readAll error: ', err);
      callback(err, null);
    });
  // fs.readdir(exports.dataDir, (err, data) => {
  //   if (err) {
  //     console.log('ERROR ON READ ALL: ', err);
  //   } else {
  //     var todos = data.map((file) => {
  //       file = file.slice(0, -4);
  //       return {id: file, text: file};
  //     });
  //     callback(null, todos);
  //   }
  // });
};

exports.readOne = (id, callback) => {
  var fileName = path.join(exports.dataDir, `${id}.txt`);
  fs.readFileAsync(fileName, 'utf8')
    .then((data) => {
      var obj = JSON.parse(data);
      callback(null, { id, text: obj.text });
    })
    .catch((err) => {
      callback(err, null);
    });
  // fs.readFile(fileName, 'utf8', (err, data) => {
  //   if (err) {
  //     callback(err, null);
  //   } else {
  //     callback(null, { id, text: data });
  //   }
  // });
};

exports.update = (id, text, callback) => {
  var fileName = path.join(exports.dataDir, `${id}.txt`);
  fs.readFileAsync(fileName, 'utf8')
    .then((file) => {
      var obj = JSON.parse(file);
      var date = Date(Date.now()).split(' ').splice(0, 5).join(' ');
      var options = {
        text: `${text}`,
        createTime: `${obj.createTime}`,
        updateTime: `${date}`
      };

      fs.writeFileAsync(fileName, JSON.stringify(options))
        .then(() => {
          callback(null, { id, text });
        })
        .catch((err) => {
          console.log('Error on Update: ', err);
        });
    })
    .catch((err) => {
      callback(err, null);
    });
  // fs.readFile(fileName, 'utf8', (err) => {
  //   if (err) {
  //     callback(err, null);
  //   } else {
  //     fs.writeFile(fileName, text, (err) => {
  //       if (err) {
  //         console.log('ERROR on UPDATE: ', err);
  //       } else {
  //         callback(null, { id, text });
  //       }
  //     });
  //   }
  // });
};

exports.delete = (id, callback) => {
  var fileName = path.join(exports.dataDir, `${id}.txt`);
  fs.unlinkAsync(fileName)
    .then(() => {
      callback(null);
    })
    .catch((err) => {
      callback(err, null);
    });
  // fs.unlink(fileName, (err) => {
  //   if (err) {
  //     callback(err, null);
  //   } else {
  //     callback(null);
  //   }
  // });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
