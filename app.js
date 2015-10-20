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
  path: [PointSchema],
  collisions: [CollisionSchema],
  breatheAmount: Number,
  viewPort: [Number],

  playerId: ObjectId,
  scores: Number
});

var SessionSchema = mongoose.Schema({
  start: Date,
  end: Date,
  hostComputer: String,

  gamesId: [ObjectId]
});

var MentorSchema = mongoose.Schema({
  name: String,
  surname: String,
  login: String,
  password: Number,

  playersId: [ObjectId]
});

var PlayerSchema = mongoose.Schema({
  name: String,
  scores: Number,
  hostComputer: String,
  place: Number
});

var PlayerModel = mongoose.model("Record", PlayerSchema);
var SessionModel = mongoose.model("Session", SessionSchema);
var GameModel = mongoose.model("Game", GameSchema);
var MentorModel = mongoose.model("Mentor", MentorSchema);

var setModelFromBody = function(body, model) {
  var obj;
  if (typeof model == "undefined") { //then create model, else update old(not necessary all keys)
    obj = Object.create(null);
  }

  for (var attr in body) {
    if (body.hasOwnProperty(attr)) {
      obj[attr] = body[attr];
    }
  }

  return obj;
};

function createRestFromEntities(entities) {
  entities.forEach(function(ent) {
    var ents = ent + "s";

    var Model;
    switch (ent) {
      case "session":
            Model = SessionModel;
            break;
      case "game":
            Model = GameModel;
            break;
      case "player":
            Model = PlayerModel;
            break;
      case "mentor":
            Model = MentorModel;
            break;
      default : throw new Error("Wrong entity");
    }

    app.get("/api/" + ents, function(request, responce) {
      return Model.find(function(err, models) {
        if (!err) {
          console.log(ents + " read");
          return responce.send(models);
        } else {
          return console.log(err);
        }
      })
    });

    app.get("/api/" + ents + "/:id", function(request, responce) {
      return Model.findById(request.params.id, function(err, model) {
        if (!err) {
          console.log(ent + " read");
          return responce.send(model);
        } else {
          return console.log(err);
        }
      });
    });

    app.post("/api/" + ents, function(request, responce) {
      var model = new Model(setModelFromBody(request.body));

      model.save(function(err) {
        if (!err) {
          console.log(ent + " created");
          return responce.send(model);
        } else {
          console.log(err);
        }
      })
    });

    app.put("/api/" + ents + "/:id", function(request, responce) {
      return Model.findById(request.params.id, function(err, model) {
        if (!err) {
          setModelFromBody(request.body, model);

          model.save(function(err) {
            if (!err) {
              console.log(ent + " updated");
              return responce.send(model);
            } else {
              console.log(err);
            }
          })
        }
      });
    });

    app.delete("/api/" + ents + "/:id", function(request, responce) {
      return Model.findById(request.params.id, function(err, model) {
        return model.remove(function(err) {
          if (!err) {
            console.log(ent + " removed");
            responce.send("");
          } else {
            console.log(err);
          }
        })
      })
    });
  }, this);
}

var entities = ["session", "game", "player", "mentor"];

createRestFromEntities(entities);

////sessions route
//app.get("/api/sessions", function(request, responce) {
//  return SessionModel.find(function(err, sessions) {
//    if (!err) {
//      console.log("Sessions read");
//      return responce.send(sessions);
//    } else {
//      return console.log(err);
//    }
//  })
//});
//
//app.get("/api/sessions/:id", function(request, responce) {
//  return SessionModel.findById(request.params.id, function(err, session) {
//    if (!err) {
//      console.log("Session read");
//      return responce.send(session);
//    } else {
//      return console.log(err);
//    }
//  });
//});
//
//app.post("/api/sessions", function(request, responce) {
//  if (!Array.isArray(request.body)) {
//    var session = new SessionModel({
//      start: request.body.start,
//      end: request.body.end,
//      hostComputer: request.body.hostComputer,
//      games: request.body.games
//    });
//
//    session.save(function(err) {
//      if (!err) {
//        console.log("Session created");
//        return responce.send("created");
//      } else {
//        console.log(err);
//      }
//    });
//  } else {
//    //var sessions = [];
//    request.body.forEach(function(sessionBody) {
//      var session = new SessionModel({
//        start: sessionBody.start,
//        end: sessionBody.end,
//        hostComputer: sessionBody.hostComputer,
//        games: sessionBody.games
//      });
//
//      session.save(function(err) {
//        if (!err) {
//          console.log("Session created");
//          //sessions.push(JSON.parse(JSON.stringify(session)));
//        } else {
//          console.log(err);
//        }
//      });
//    });
//    return responce.send("created");
//  }
//});
//
//app.put("/api/sessions/:id"                                                                                                                                                                                                                                                                                                                                                                                               , function(request, responce) {
//  return SessionModel.findById(request.params.id, function(err, session) {
//    if (!err) {
//      session.start = request.body.start;
//      session.end = request.body.end;
//      session.hostComputer = request.body.hostComputer;
//      session.games = request.body.games;
//
//      session.save(function(err) {
//        if (!err) {
//          console.log("Session updated");
//          return responce.send(session);
//        } else {
//          console.log(err);
//        }
//      })
//    }
//  });
//});
//
//app.delete("/api/sessions/:id", function(request, responce) {
//  return SessionModel.findById(request.params.id, function(err, session) {
//    return session.remove(function(err) {
//      if (!err) {
//        console.log("Session removed");
//        responce.send("");
//      } else {
//        console.log(err);
//      }
//    })
//  })
//});

module.exports = app;
