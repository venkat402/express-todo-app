var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    task_name: {
        type: String,
        required: true
    },
    task_status: {
        type: String,
        default: ''
    },
    task_description: {
        type: String,
        default: ''
    }
});

var Task = new mongoose.model('Task', schema);

module.exports = Task;
