var express = require('express');
var router = express.Router();
const Task = require('../models/task_model');
var database = require('../configuration/database');

/* GET home page. */
router.get('/', function (req, res, next) {
  database.collection("tasks").find({}).toArray(function (err, result) {
    if (err) {
      throw err;
    } else {
      res.render('index', { title: 'Express', tasks: result });
    }
  });
});

/* GET add task page. */
router.get('/add_task', function (req, res, next) {
  res.render('add_task', { title: 'Express' });
});

/* GET post add task page. */
router.post('/add_task', function (req, res, next) {
  console.log(req.body);
  var task = new Task(req.body);

  task.save(function (err, user) {
    if (err) {
      res.render('add_task', {
        errors: err
      })
    } else {
      res.render('add_task', {
        success: { msg: "Task added successfully" }
      })

    }

  });
});

/* GET add task page. */
router.get('/add_task', function (req, res, next) {
  res.render('add_task', { title: 'Express' });
});

/* GET post add task page. */
router.post('/delete_task/:id', function (req, res, next) {
  console.log(req.body);
  var task = new Task(req.body);

  task.save(function (err, user) {
    if (err) {
      res.render('add_task', {
        errors: err
      })
    } else {
      res.render('add_task', {
        success: { msg: "Task added successfully" }
      })

    }

  });
});
/* GET add task page. */
router.get('/change_status/:id', function (req, res, next) {
  res.render('add_task', { title: 'Express' });
});

/* GET post add task page. */
router.post('/add_task', function (req, res, next) {
  console.log(req.body);
  var task = new Task(req.body);

  task.save(function (err, user) {
    if (err) {
      res.render('add_task', {
        errors: err
      })
    } else {
      res.render('add_task', {
        success: { msg: "Task added successfully" }
      })

    }

  });
});





module.exports = router;
