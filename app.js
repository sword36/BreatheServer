var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var connectString = "mongodb://localhost:27017";
if (!process.env.local) {
  connectString = "mongodb://" + process.env.dbuser + ":" + process.env.dbpassword
  + "@ds041643.mongolab.com:41643/breatheserver";
}

console.log(connectString);
mongoose.connect(connectString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function (callback) {
  console.log("Open");
});

var PointSchema = mongoose.Schema({
  p: [Number]
}, {_id: false});

var CollisionSchema = mongoose.Schema({
  class: String,
  type: String,
  position: [Number]
}, {_id: false});

var GameSchema = mongoose.Schema({
  start: Date,
  end: Date,
  playerName: String,
  scores: Number,
  path: [PointSchema],
  collisions: [CollisionSchema],
  breatheAmount: Number,
  viewPort: [Number]
});

var SessionSchema = mongoose.Schema({
  start: Date,
  end: Date,
  games: [GameSchema],
  hostComputer: String
});

var RecordSchema = mongoose.Schema({
  name: String,
  scores: Number,
  hostComputer: String,
  place: Number
});

var RecordModel = mongoose.model("Record", RecordSchema);
var SessionModel = mongoose.model("Session", SessionSchema);

//records router
app.get("/api/records", function(request, responce) {
  return RecordModel.find(function(err, records) {
    if (!err) {
      console.log("Records read");
      return responce.send(records);
    } else {
      return console.log(err);
    }
  })
});

app.get("/api/records/:id", function(request, responce) {
  return RecordModel.findById(request.params.id, function(err, record) {
    if (!err) {
      console.log("Record read");
      return responce.send(record);
    } else {
      return console.log(err);
    }
  });
});

app.post("/api/records", function(request, responce) {
  var record = new RecordModel({
    name: request.body.name,
    scores: request.body.scores,
    hostComputer: request.body.hostComputer
  });

  record.save(function(err) {
    if (!err) {
      console.log("Record created");
      return responce.send(record);
    } else {
      console.log(err);
    }
  })
});

app.put("/api/records/:id", function(request, responce) {
  return RecordModel.findById(request.params.id, function(err, record) {
    if (!err) {
      record.name = request.body.name;
      record.scores = request.body.scores;
      record.hostComputer = request.body.hostComputer;
      record.place = request.body.place;

      record.save(function(err) {
        if (!err) {
          console.log("Record updated");
          return responce.send(record);
        } else {
          console.log(err);
        }
      })
    }
  });
});

app.delete("/api/records/:id", function(request, responce) {
  return RecordModel.findById(request.params.id, function(err, record) {
    return record.remove(function(err) {
      if (!err) {
        console.log("Record removed");
        responce.send("");
      } else {
        console.log(err);
      }
    })
  })
});


//sessions route
app.get("/api/sessions", function(request, responce) {
  return SessionModel.find(function(err, sessions) {
    if (!err) {
      console.log("Sessions read");
      return responce.send(sessions);
    } else {
      return console.log(err);
    }
  })
});

app.get("/api/sessions/:id", function(request, responce) {
  return SessionModel.findById(request.params.id, function(err, session) {
    if (!err) {
      console.log("Session read");
      return responce.send(session);
    } else {
      return console.log(err);
    }
  });
});

app.post("/api/sessions", function(request, responce) {
  if (!Array.isArray(request.body)) {
    var session = new SessionModel({
      start: request.body.start,
      end: request.body.end,
      hostComputer: request.body.hostComputer,
      games: request.body.games
    });

    session.save(function(err) {
      if (!err) {
        console.log("Session created");
        return responce.send("created");
      } else {
        console.log(err);
      }
    });
  } else {
    //var sessions = [];
    request.body.forEach(function(sessionBody) {
      var session = new SessionModel({
        start: sessionBody.start,
        end: sessionBody.end,
        hostComputer: sessionBody.hostComputer,
        games: sessionBody.games
      });

      session.save(function(err) {
        if (!err) {
          console.log("Session created");
          //sessions.push(JSON.parse(JSON.stringify(session)));
        } else {
          console.log(err);
        }
      });
    });
    return responce.send("created");
  }
});

app.put("/api/sessions/:id"                                                                                                                                                                                                                                                                                                                                                                                               , function(request, responce) {
  return SessionModel.findById(request.params.id, function(err, session) {
    if (!err) {
      session.start = request.body.start;
      session.end = request.body.end;
      session.hostComputer = request.body.hostComputer;
      session.games = request.body.games;

      session.save(function(err) {
        if (!err) {
          console.log("Session updated");
          return responce.send(session);
        } else {
          console.log(err);
        }
      })
    }
  });
});

app.delete("/api/sessions/:id", function(request, responce) {
  return SessionModel.findById(request.params.id, function(err, session) {
    return session.remove(function(err) {
      if (!err) {
        console.log("Session removed");
        responce.send("");
      } else {
        console.log(err);
      }
    })
  })
});

module.exports = app;
