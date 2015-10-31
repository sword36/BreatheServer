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

//models
var PlayerModel = require("./models/player");
var SessionModel = require("./models/session");
var GameModel = require("./models/game");
var MentorModel = require("./models/mentor");

var config = require('./config.js');

var app = express();

// view engine setup

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.set("dbUrl", config.db[app.get("env")]); //set node_env=test - without space on end(test )!
console.log(app.get("dbUrl"));

mongoose.connect(app.get("dbUrl"));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function (callback) {
  console.log("Open");
});

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

var ObjectId = mongoose.Schema.Types.ObjectId;

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
  tempObj._player = pId;

  return new GameModel(setModelFromBody(tempObj));
};

app.post("/api/statistics", function(request, responce) {
  var data = request.body;
  if (!Array.isArray(data)) {
    data = [data];
  }

  var toBeSaved = [];
  var playersId = {}; //cash of players id

  var sessionPromises = [];
  data.forEach(function(sessionData) {
    var sessionPromise = new Promise(function(resolve, reject) {
      var session = new SessionModel({
        start: sessionData.start,
        end: sessionData.end,
        hostComputer: sessionData.hostComputer,
        _games: []
      });

      toBeSaved.push(session);

      var gamePromises = [];
      sessionData.games.forEach(function(game) {
        var gamePromise = new Promise(function(resolve, reject) {
          var gameWithPlayer;

          if (typeof playersId[game.playerName] != "undefined") {
            gameWithPlayer = createGameModel(game, playersId[game.playerName]);

            session._games.push(gameWithPlayer._id);
            toBeSaved.push(gameWithPlayer);

            resolve();
          } else {
            PlayerModel.findOne({name: game.playerName}, function(err, player) {
              if (!err && player != null) {

                if (game.scores > player.scores) { //update player scores
                  player.scores = game.scores;
                  toBeSaved.push(player);
                }

                playersId[game.playerName] = player._id; //add to cash
                gameWithPlayer = createGameModel(game, player._id);
              } else { //create new player
                var newPlayer = new PlayerModel({
                  name: game.playerName,
                  scores: game.scores,
                  hostComputer: sessionData.hostComputer
                });

                playersId[game.playerName] = newPlayer._id; //add to cash
                toBeSaved.push(newPlayer);
                gameWithPlayer = createGameModel(game, newPlayer._id);
              }

              session._games.push(gameWithPlayer._id);
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

GameModel.findOne().populate("_player").exec(function(err, game) {
  if (err) {
    console.log(err);
  } else {
    //console.log(game._player.name);
  }
});

module.exports = app;
