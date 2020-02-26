var mongoose = require('mongoose');
var user = mongoose.model('User');


exports.createUser = function (data, callback) {
    user.create(data).then((response) => {
        callback(null, response);
    }, (error) => {
        callback(error, null);
    });
};