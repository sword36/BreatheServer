var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Promise = require('promise');

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

var ObjectId = mongoose.Schema.Types.ObjectId;

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

  playerId: {type: ObjectId, ref: "Player"},
  scores: Number
});

var SessionSchema = mongoose.Schema({
  start: Date,
  end: Date,
  hostComputer: String,

  gamesId: [{type: ObjectId, ref: "Game"}]
});

var MentorSchema = mongoose.Schema({
  name: String,
  surname: String,
  login: String,
  password: Number,

  playersId: [{type: ObjectId, ref: "Player"}]
});

var PlayerSchema = mongoose.Schema({
  name: String,
  scores: Number,
  hostComputer: String,
  place: Number
});

var PlayerModel = mongoose.model("Player", PlayerSchema);
var SessionModel = mongoose.model("Session", SessionSchema);
var GameModel = mongoose.model("Game", GameSchema);
var MentorModel = mongoose.model("Mentor", MentorSchema);

var setModelFromBody = function(body, model) {
  var obj;
  if (typeof model == "undefined") { //then create model, else update old(not necessary all keys)
    obj = {};
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

var createGameModel = function(data, pId) {
  var tempObj = setModelFromBody(data);
  tempObj.playerName = null;
  delete tempObj.playerName;
  tempObj.playerId = pId;

  return new GameModel(setModelFromBody(tempObj));
};

app.post("/api/statistics", function(request, responce) {
  var data = request.body;
  if (!Array.isArray(data)) {
    data = [data];
  }

  var toBeSaved = [];
  var playersIds = {}; //cash of players id

  var sessionPromises = [];
  data.forEach(function(sessionData) {
    var sessionPromise = new Promise(function(resolve, reject) {
      var session = new SessionModel({
        start: sessionData.start,
        end: sessionData.end,
        hostComputer: sessionData.hostComputer,
        gamesId: []
      });

      toBeSaved.push(session);

      var gamePromises = [];
      sessionData.games.forEach(function(game) {
        var gamePromise = new Promise(function(resolve, reject) {
          var gameWithPlayer;

          if (typeof playersIds[game.playerName] != "undefined") {
            gameWithPlayer = createGameModel(game, playersIds[game.playerName]);

            session.gamesId.push(gameWithPlayer._id);
            toBeSaved.push(gameWithPlayer);

            resolve();
          } else {
            PlayerModel.findOne({name: game.playerName}, function(err, player) {
              if (!err && player != null) {

                if (game.scores > player.scores) { //update player scores
                  player.scores = game.scores;
                  toBeSaved.push(player);
                }

                playersIds[game.playerName] = player._id; //add to cash
                gameWithPlayer = createGameModel(game, player._id);
              } else { //create new player
                var newPlayer = new PlayerModel({
                  name: game.playerName,
                  scores: game.scores,
                  hostComputer: sessionData.hostComputer
                });

                playersIds[game.playerName] = newPlayer._id; //add to cash
                toBeSaved.push(newPlayer);
                gameWithPlayer = createGameModel(game, newPlayer._id);
              }

              session.gamesId.push(gameWithPlayer._id);
              toBeSaved.push(gameWithPlayer);
              resolve();
            });
          }
        });
        gamePromises.push(gamePromise);
      }, this);

      var savingModelPromises = [];

      Promise.all(gamePromises).then(function(res) {
        toBeSaved.forEach(function(model) {
          var savingPromise = new Promise(function(resolve, reject) {
            model.save(function(err) {
              if (!err) {
                resolve();
              } else {
                reject();
              }
            });
          });
          savingModelPromises.push(savingPromise);
        });

        Promise.all(savingModelPromises).then(function() {
          resolve();
        });
      });
    });

    sessionPromises.push(sessionPromise);
  }, this);

  Promise.all(sessionPromises).then(function() {
    return responce.send("success");
  });
});
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
