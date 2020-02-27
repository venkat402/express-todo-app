var express = require('express');
var router = express.Router();
const Task = require('../models/task_model');
var db = require('../configuration/database');
const crypto = require('crypto');

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
      res.redirect('/');
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


const users = [
  // This user is added to the array to avoid creating a new user on each restart
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@email.com',
    // This is the SHA256 hash for value of `password`
    password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg='
  }
];


router.get('/register', (req, res) => {
  res.render('user_register');
});
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

router.post('/register', (req, res) => {
  const { email, firstName, lastName, password, confirmPassword } = req.body;

  // Check if the password and confirm password fields match
  if (password === confirmPassword) {

    // Check if user with the same email is also registered
    if (users.find(user => user.email === email)) {

      res.render('user_register', {
        message: 'User already registered.',
        messageClass: 'alert-danger'
      });

      return;
    }

    const hashedPassword = getHashedPassword(password);

    // Store user into the database if you are using one
    users.push({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    res.render('login', {
      message: 'Registration Complete. Please login to continue.',
      messageClass: 'alert-success'
    });
  } else {
    res.render('user_register', {
      message: 'Password does not match.',
      messageClass: 'alert-danger'
    });
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString('hex');
}


// This will hold the users and authToken related to users
const authTokens = {};

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = getHashedPassword(password);

  const user = users.find(u => {
    return u.email === email && hashedPassword === u.password
  });

  if (user) {
    const authToken = generateAuthToken();

    // Store authentication token
    authTokens[authToken] = user;

    // Setting the auth token in cookies
    res.cookie('AuthToken', authToken);

    // Redirect user to the protected page
    res.redirect('/dashboard');
  } else {
    res.render('login', {
      message: 'Invalid username or password',
      messageClass: 'alert-danger'
    });
  }
});

const requireAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.render('login', {
      message: 'Please login to continue',
      messageClass: 'alert-danger'
    });
  }
};
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard');
});













module.exports = router;
