var express = require('express');
var router = express.Router();
const Task = require('../models/task_model');
var db = require('../configuration/database');

/* GET home page. */
router.get('/', function (req, res, next) {
  db.collection("tasks").find({}).toArray(function (err, result) {
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

/* GET add task page. */
router.get('/change_status/:id', function (req, res, next) {
  Task.find({ _id: req.params.id }, function (err, result) {
    if (result[0].task_status == 'incomplete') {
      let newvalues = { $set: { task_status: "completed" } };
      var myquery = { _id: req.params.id };
      Task.updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
      });
    } else {
      var myquery = { _id: req.params.id };
      let newvalues = { $set: { task_status: "incomplete" } };
      Task.updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
      });
    }
  });
  res.redirect('/');

});


/* GET add task page. */
router.get('/edit_task/:id', function (req, res, next) {
  Task.find({ _id: req.params.id }, function (err, result) {
    if (err) throw err;
    res.render('edit_task', { task: result });
  });
});

/* GET add task page. */
router.post('/edit_task/:id', function (req, res, next) {
  Task.find({ _id: req.params.id }, function (err, result) {
    let newvalues = { $set: { task_status: req.body.task_status, task_name: req.body.task_name, task_description: req.body.task_description } };
    var myquery = { _id: req.params.id };
    Task.updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
    });
  });
  res.redirect('/');
});

/* GET post add task page. */
router.get('/delete_task/:id', function (req, res, next) {
  Task.findByIdAndRemove({ _id: req.params.id }, function (err, results) {
    if (err) {
      res.send("failed");
      throw err;
    }
    res.redirect("/")
  })
});





module.exports = router;
