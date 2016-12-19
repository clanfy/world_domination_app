var MongoClient = require('mongodb').MongoClient;

var Game = function(){
  this.players = [];
  this.gameState = [];
  this.returnData = "";

  this.getPlayersFromDb();
};

Game.prototype = {

  addPlayer: function(req, res, player){

    this.players.push(player);

    var url = 'mongodb://localhost:27017/game';
    MongoClient.connect(url, function(err, db){
      if(err){
        throw err;
      };
      var collection = db.collection('players');
      collection.insert(player);
      db.close();
    });
    this.getPlayersFromDb();
  },

  runDbQuery: function(projection, runMeWhenDone, database, dbCollection){

    var url = 'mongodb://localhost:27017/' + database;
    MongoClient.connect(url, function(err, db){
      if(err){
        throw err;
      };
      var collection = db.collection(dbCollection);
      collection.find({}, projection).toArray(function(err, docs){

        runMeWhenDone(docs);
        db.close();
      });
    });
  },

//UNTESTED
  getPlayersFromDb: function(){
    this.runDbQuery({}, function(docs){console.log("this", this); this.players = docs || [];}, 'game', 'players');
  },

  sendClientSafeMarkersFromDb: function(res){
    var markersForClient = this.runDbQuery({
      _id: 0,
      position: 1,
      alpha2Code: 1,
      playerId: 1,
      label: 1,
      color: 1
    },
    function(docs){
      res.json(docs)
    }, 
    'game',
    'gameStates'
    );
  }

};

module.exports = Game;
