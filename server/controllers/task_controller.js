
var task = new Task(req.body);

  task.save(function (err, user) {
    if (err) console.log(err);
    return res.send("Success! Your task has been saved.");
  });