var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');

var crypto = require('crypto');

var colors = require('colors');
var http = require('http');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  
  var app = require('express')();
  
  // Get a reference to our raw Node HTTP server
  var httpServer = worker.getHTTPServer();
  // Get a reference to our realtime SocketCluster server
  var scServer = worker.getSCServer();
  
  scServer.global.games = [];
  scServer.global.gamesIx = 0;
  scServer.global.gamesList = {};

  // make a dummy game to play
  createGame();

  app.use(serveStatic(path.resolve(__dirname, 'public')));

  httpServer.on('req', app);

  var activeSessions = [];
  var activeSessionsBySocketId = {};
  var numSessions = 0;
  var count = 0;


var cards = 

  [
    /* 0 */   {"name":"The Excuse",           "rank":0,   "moon":false,   "sun":false,  "waves":false,  "leaves":false, "wyrms":false,  "knots":false   , "personality": false, "location":false, "event": false },

    /* 1 */   {"name":"Ace of Moons",         "rank":1,   "moon":true,    "sun":false,  "waves":false,  "leaves":false, "wyrms":false,  "knots":false   , "personality": false, "location":false, "event": false },
    /* 2 */   {"name":"Ace of Suns",          "rank":1,   "moon":false,   "sun":true,   "waves":false,  "leaves":false, "wyrms":false,  "knots":false   , "personality": false, "location":false, "event": false },
    /* 3 */   {"name":"Ace of Waves",         "rank":1,   "moon":false,   "sun":false,  "waves":true ,  "leaves":false, "wyrms":false,  "knots":false   , "personality": false, "location":false, "event": false },
    /* 4 */   {"name":"Ace of Leaves",        "rank":1,   "moon":false,   "sun":false,  "waves":false,  "leaves":true,  "wyrms":false,  "knots":false   , "personality": false, "location":false, "event": false },
    /* 5 */   {"name":"Ace of Wyrms",         "rank":1,   "moon":false,   "sun":false,  "waves":false,  "leaves":false, "wyrms":true,   "knots":false   , "personality": false, "location":false, "event": false },
    /* 6 */   {"name":"Ace of Knots",         "rank":1,   "moon":false,   "sun":false,  "waves":false,  "leaves":false, "wyrms":false,  "knots":true    , "personality": false, "location":false, "event": false },


    /* 7 */   {"name":"The Author",           "rank":2,   "moon":true,    "sun":false,  "waves":false,  "leaves":false, "wyrms":false,  "knots":true    , "personality": true , "location":false, "event": false },
    /* 8 */   {"name":"The Desert",           "rank":2,   "moon":false,   "sun":true,   "waves":false,  "leaves":false, "wyrms":true,   "knots":false   , "personality": false, "location":true , "event": false },
    /* 9 */   {"name":"The Origin",           "rank":2,   "moon":false,   "sun":false,  "waves":true,   "leaves":true,  "wyrms":false,  "knots":false   , "personality": false, "location":true , "event": true  },

    /* 10 */  {"name":"The Painter",          "rank":3,   "moon":false,   "sun":true,   "waves":false,  "leaves":false, "wyrms":false,  "knots":true    , "personality": true , "location":false, "event": false },
    /* 11 */  {"name":"The Savage",           "rank":3,   "moon":false,   "sun":false,  "waves":false,  "leaves":true,  "wyrms":true,   "knots":false   , "personality": true , "location":false, "event": false },
    /* 12 */  {"name":"The Journey",          "rank":3,   "moon":true,    "sun":false,  "waves":true,   "leaves":false, "wyrms":false,  "knots":false   , "personality": false, "location":false, "event": true  },

    /* 13 */  {"name":"The Battle",           "rank":4,   "moon":false,   "sun":false,  "waves":false,  "leaves":false,  "wyrms":true,   "knots":true   , "personality": false, "location":false, "event": true  },
    /* 14 */  {"name":"The Sailor",           "rank":4,   "moon":false,   "sun":false,  "waves":true,   "leaves":true,   "wyrms":false,  "knots":false  , "personality": true , "location":false, "event": false },
    /* 15 */  {"name":"The Mountain",         "rank":4,   "moon":true,    "sun":true,   "waves":false,  "leaves":false,  "wyrms":false,  "knots":false  , "personality": false, "location":true , "event": false },

    /* 16 */  {"name":"The Discovery",        "rank":5,   "moon":false,   "sun":true,   "waves":true,   "leaves":false,  "wyrms":false,  "knots":false  , "personality": false, "location":false, "event": true  },
    /* 17 */  {"name":"The Soldier",          "rank":5,   "moon":false,   "sun":false,  "waves":false,  "leaves":false,  "wyrms":true,   "knots":true   , "personality": true , "location":false, "event": false },
    /* 18 */  {"name":"The Forest",           "rank":5,   "moon":true,    "sun":false,  "waves":false,  "leaves":true,   "wyrms":false,  "knots":false  , "personality": false, "location":true , "event": false },

    /* 19 */  {"name":"The Penitent",         "rank":6,   "moon":false,   "sun":true,   "waves":false,  "leaves":false,  "wyrms":true,   "knots":false  , "personality": true , "location":false, "event": false },
    /* 20 */  {"name":"The Lunatic",          "rank":6,   "moon":true,    "sun":false,  "waves":true,   "leaves":false,  "wyrms":false,  "knots":false  , "personality": true , "location":false, "event": false },
    /* 21 */  {"name":"The Market",           "rank":6,   "moon":false,   "sun":false,  "waves":false,  "leaves":true,   "wyrms":false,  "knots":true   , "personality": false, "location":true , "event": true  },

    /* 22 */  {"name":"The Castle",           "rank":7,   "moon":false,   "sun":true,   "waves":false,  "leaves":false,  "wyrms":false,  "knots":true   , "personality": false, "location":true , "event": false },
    /* 23 */  {"name":"The Chance Meeting",   "rank":7,   "moon":true,    "sun":false,  "waves":false,  "leaves":true,   "wyrms":false,  "knots":false  , "personality": false, "location":false, "event": true  },
    /* 24 */  {"name":"The Cave",             "rank":7,   "moon":false,   "sun":false,  "waves":true,   "leaves":false,  "wyrms":true,   "knots":false  , "personality": false, "location":true , "event": false },

    /* 25 */  {"name":"The Betrayal",         "rank":8,   "moon":false,   "sun":false,  "waves":false,  "leaves":false,  "wyrms":true,   "knots":true   , "personality": false, "location":false, "event": true  },
    /* 26 */  {"name":"The Diplomat",         "rank":8,   "moon":true,    "sun":true,   "waves":false,  "leaves":false,  "wyrms":false,  "knots":false  , "personality": true , "location":false, "event": false },
    /* 27 */  {"name":"The Mill",             "rank":8,   "moon":false,   "sun":false,  "waves":true,   "leaves":true,   "wyrms":false,  "knots":false  , "personality": false, "location":true , "event": false },

    /* 28 */  {"name":"The Pact",             "rank":9,   "moon":true,    "sun":true,   "waves":false,  "leaves":false,  "wyrms":false,  "knots":false  , "personality": false, "location":false, "event": true  },
    /* 29 */  {"name":"The Merchant",         "rank":9,   "moon":false,   "sun":false,  "waves":false,  "leaves":true,   "wyrms":false,  "knots":true   , "personality": true , "location":false, "event": false },
    /* 30 */  {"name":"The Darkness",         "rank":9,   "moon":false,   "sun":false,  "waves":true,   "leaves":false,  "wyrms":true,   "knots":false  , "personality": false, "location":true , "event": false },

    /* 31 */  {"name":"The Watchman",         "rank":10,   "moon":true,    "sun":false, "waves":false,  "leaves":false,  "wyrms":true,   "knots":true   , "personality": true , "location":false, "event": false },
    /* 32 */  {"name":"The Borderland",       "rank":10,   "moon":false,   "sun":false, "waves":true,   "leaves":true,   "wyrms":true,   "knots":false  , "personality": false, "location":true , "event": false },
    /* 33 */  {"name":"The Harvest",          "rank":10,   "moon":true,    "sun":true,  "waves":false,  "leaves":true,   "wyrms":false,  "knots":false  , "personality": false, "location":false, "event": true  },
    /* 34 */  {"name":"The Light Keeper",     "rank":10,   "moon":false,   "sun":true,  "waves":true,   "leaves":false,  "wyrms":false,  "knots":true   , "personality": true , "location":false, "event": false },

    /* 35 */  {"name":"The Consul",           "rank":11,   "moon":true,    "sun":false,  "waves":true,   "leaves":false,  "wyrms":false,  "knots":true  , "personality": true , "location":false, "event": false },
    /* 36 */  {"name":"The Rite",             "rank":11,   "moon":true,    "sun":false,  "waves":false,  "leaves":true,   "wyrms":true,   "knots":false , "personality": false, "location":false, "event": true  },
    /* 37 */  {"name":"The Window",           "rank":11,   "moon":false,   "sun":true,   "waves":false,  "leaves":true,   "wyrms":false,  "knots":true  , "personality": false, "location":true , "event": false },
    /* 38 */  {"name":"The Island",           "rank":11,   "moon":false,   "sun":true,   "waves":true,   "leaves":false,  "wyrms":true,   "knots":false , "personality": false, "location":true , "event": false },

    /* 39 */  {"name":"The Huntress",         "rank":12,   "moon":true,    "sun":false,  "waves":false,  "leaves":false,  "wyrms":false,  "knots":false , "personality": true , "location":false, "event": false },
    /* 40 */  {"name":"The Bard",             "rank":12,   "moon":false,   "sun":true,   "waves":false,  "leaves":false,  "wyrms":false,  "knots":false , "personality": true , "location":false, "event": false },
    /* 41 */  {"name":"The Sea",              "rank":12,   "moon":false,   "sun":false,  "waves":true,   "leaves":false,  "wyrms":false,  "knots":false , "personality": false, "location":true , "event": false },

    /* 42 */  {"name":"The End",              "rank":12,   "moon":false,   "sun":false,  "waves":false,  "leaves":true,   "wyrms":false,  "knots":false , "personality": false, "location":true , "event": true  },
    /* 43 */  {"name":"The Calamity",         "rank":12,   "moon":false,   "sun":false,  "waves":false,  "leaves":false,  "wyrms":true,   "knots":false , "personality": false, "location":false, "event": true  },
    /* 44 */  {"name":"The Windfall",         "rank":12,   "moon":false,   "sun":false,  "waves":false,  "leaves":false,  "wyrms":false,  "knots":true  , "personality": false, "location":false, "event": true  }
  ];

var ranks =
  [
  /* 0 */   {"name": "The Excuse"},
  /* 1 */   {"name": "Ace"},
  /* 2 */   {"name": "Two"},
  /* 3 */   {"name": "Three"},
  /* 4 */   {"name": "Four"},
  /* 5 */   {"name": "Five"},
  /* 6 */   {"name": "Six"},
  /* 7 */   {"name": "Seven"},
  /* 8 */   {"name": "Eight"},
  /* 9 */   {"name": "Nine"},
  /* 10 */  {"name": "Pawn"},
  /* 11 */  {"name": "Court"},
  /* 12 */  {"name": "Crown"}
  ];


  function log(txt,level)
  {
    switch(level)
    {
      case 0: // info
        console.log(txt.blue);
      break;
      case 1: // warning
        console.log(txt.warn);
      break;
      case 2: // error
        console.log(txt.error);
      break
      default:
        console.log(txt);
      break;
    }
  }

  function createGame()
  {
    var channel = crypto.randomBytes(32).toString('hex');

    scServer.global.games.push(


    {   
      "pub": // general game info
      {
        "gameIx"        : scServer.global.gamesIx++           , 
        "name"          : "Game " + scServer.global.gamesIx  , 
        "ante"          : 10                                  ,
        "minBet"        : 10                                  ,
        "maxBet"        : 40                                  ,
        "numRaises"     : 3                                   ,
        "minStake"      : 100                                 ,
        "maxStake"      : 1000                                ,
        "wallet"        : ""                                  
      },
      "game": // protected, only players can see
      {
        "dealerIx"      :-1                                   , 
        "actIx"         :-1                                   , 
        "channel"       : channel                             ,
        "phase"         : 0                                   ,
        "step"          : 0                                   ,
        "potBalance"    : 0                                   ,
        "seats"         : [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        "status"        : [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
      },
      "priv": // private, nobody can see these
      {
        "rakeBalance"   : 0                                   ,
        "roundIx"       : 0                                   ,
        "roundPackets"  : []                                  ,
        "players"       :[]                                   
      }
        
        

    }

    );

    // generate the published gameList
    var gamesList = {"games":[]};
    for(var i=0; i < scServer.global.games.length; i++)
    {
      gamesList.games[i] = scServer.global.games[i].pub;
    }

    scServer.global.gamesList = gamesList;

  }


  function addPlayerToGame(data, socketId, socket)
  {
    var g = scServer.global.games;

    console.log("### adding player", socketId, " to ", data.gameIx);

    for(var i=0; i < g.length; i++)
    {
      //console.log("### loop", g.length);
      
      if(g[i].pub.gameIx == data.gameIx)
      {
        // we found our game, index i; set it up


        if(g[i].priv.players && g[i].priv.players.length)
        {
          if (g[i].priv.players.length > 9)
          {
            // no room in this game
            return false;
          }
          //console.log("dupe check");
          for(var iii=0; iii < g[i].priv.players.length; iii++)
          {
            // console.log("check", g[i].priv.players[iii].socketId, socketId);
            if(g[i].priv.players[iii].socketId == socketId) // dude is already in
            {
              // console.log("dupe add rejected");
              return false;
            }
          }
        }


        //console.log("matched on id ", i );
        //data.socketId = socketId;
        // TODO filter data into game and private pieces. socketId should be private, action should be discarded.
        

        data.socketId = socketId;
        var playerIx = g[i].priv.players.push(data)-1;

        // console.log("PlayerPtr is ", playerIx);

        break;    
      }
      
    }

    if(g[i].priv.players.length>1)
    {
      // commence game
      
      doAdvanceGame(i,5000);
    }
    activeSessionsBySocketId[socket.session.socketId].gamePtr = i;
    activeSessionsBySocketId[socket.session.socketId].gameIx = data.gameIx;
    activeSessionsBySocketId[socket.session.socketId].playerPtr = playerIx;
/*
    socket.gamePtr = i;
    socket.gameIx = data.gameIx;
    socket.playerPtr = playerIx;
*/
    // console.log("this player is playing in game " + i)

    socket.emit('joined',{ "game":scServer.global.games[i].game, "playerPtr":playerIx});

    var newPacket = {};
    newPacket.action = "newPlayer";
    newPacket.data = g[i];
    //scServer.global.publish(g[i].channel, newPacket);
    gameBroadcast(g[i],newPacket);
  }

  function gameBroadcast(g,data)
  {
    // console.log("broadcast",g.priv.players);
    if(g.priv.players)
      for(var i=0; i < g.priv.players.length; i++)
      {
        // console.log("loop ", i);
        // if(g.game.status[i] != 0) // this is a seated player
        // {
          //console.log("emit",g.priv.players[i],data);
          activeSessionsBySocketId[g.priv.players[i].socketId].emit('game',data);
        // }
        
      }
  }


  // initial game deal -- 3 cards per player
  function dealGame(gamePtr)
  {
    log("Deal Game " + gamePtr,0);
    // does our gamePtr exist?
    var g;
    if(g = scServer.global.games[gamePtr])
    {
      // clean up the game data
      delete g.priv.hand;
      delete g.priv.discardDeck;
      delete g.game.endHands;
      delete g.winner;


      // console.log("gamePtr valid");
      // choose dealer

      g.game.dealerIx++;
      var dealerSet=0;
      for(var i=g.game.dealerIx; i<10;i++)
      {
        if(g.game.status[i]==0)
        {
          g.game.dealerIx = i;
          dealerSet=1;
          break;
        }
      }
      if(!dealerSet)
      {
        for(var i=0; i <= g.game.dealerIx; i++)
        {
          if(g.game.status[i]==0)
          {
            g.game.dealerIx=i;
            dealerSet=1;
            break;
          }
        }
      }
      // console.log("dealerIx ", g.game.dealerIx);
      // end choose dealer

      if(!g.game.firstCardIx)
      {
        for(var i=g.game.dealerIx+1; i <= g.game.status.length; i++)
        {
          if(i == g.game.status.length)
          {
            i=-1;
            continue;
          }
          if(i==g.game.dealerIx)
          {
            break;
          }
          if(g.game.status[i]==0)
          {
            g.game.firstCardIx=i;
            break;
          }
        }
      }

      // console.log("firstCard", g.game.firstCardIx);

      g.priv.hand = [];

      for(var ii=0; ii<3; ii++) // TODO make efficient later :)
      {
        var out=0;
        for(var i=g.game.firstCardIx; i <= g.game.status.length; i++)
        {
          if(i == g.game.status.length)
          {
            i=-1;
            continue;
          }
          if(i == g.game.firstCardIx)
          {
            if(out==1)
            {
              break;
            }
            else
            {
              var out=1; // next time around, we need to bail out
            }
          }
          if(g.game.status[i] == 0) // this person ante'd up
          {
            var card = g.priv.deck.deck.pop();
            activeSessionsBySocketId[g.priv.players[i].socketId].emit('game',{"action":"deal","card":card, "order":ii, "order2":i});
            if(!g.priv.hand[i] || !Array.isArray(g.priv.hand[i]))
            {
              g.priv.hand[i] = [];
            }
            g.priv.hand[i].push(card);
            
          }
        }

      }

    }
  }



  function discardStart(gamePtr)
  {
    var g = scServer.global.games[gamePtr];
    g.game.betStep=Number(0);
    g.game.betCurrent=g.game.firstCardIx;
    g.game.finalIx = g.game.dealerIx;
    g.game.betNext = g.game.firstCardIx;

    g.priv.discardDeck = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
    g.game.discardNext = g.game.firstCardIx;


    activeSessionsBySocketId[g.priv.players[g.game.firstCardIx].socketId].emit('game',{"action":"discard"});
  }

  function discardRound(gamePtr, data, socketId)
  {
    var g = scServer.global.games[gamePtr];
    // process this player's discard
    g.priv.discardDeck[g.game.discardNext] = Number(data.card);

    gameBroadcast(g,{"action":"debug", "game" : g });

    for(var i=g.game.discardNext+1; i <= g.game.seats.length; i++)
    {
      // console.log("###",i,g.game.discardNext);

      if(i == g.game.seats.length) // if we're at the end, loop to the beginning
      {
        i = -1;
        continue;
      }
      if (g.game.discardNext == i || g.priv.discardDeck[i] != -1) // if we've arrived where we started, bail out. if we get here, everyone folded.
      {
        discardEnd(gamePtr);
        return true;
        break;
      }
      if(g.game.status[i] != -1) // is this person "in" still?
      {
        g.game.discardNext = i;
        activeSessionsBySocketId[g.priv.players[g.game.discardNext].socketId].emit('game',{"action":"discard"});
        break;
      }
    }
    
  }

  function discardEnd(gamePtr)
  {
    var g = scServer.global.games[gamePtr];
    // console.log("## Discard end");

    // figure out who gets which card.

    // loop once per seat

    for(var i=0; i < g.priv.discardDeck.length; i++)
    {
      // everyone not discarding (card==99) gets a new card from the deck.
      // player [0] gets card[last], and player [i] gets card [i-1]. player [last] gets card [0]

      if(g.priv.discardDeck[i] == -1) // this player is not playing.
        continue;
      if(g.priv.discardDeck[i] == 99) // this player did not discard
        continue;

      // this player discarded and is entitled to a new card. figure out which one he gets.
      for(var ii=i+1; ii <= g.priv.discardDeck.length; ii++)
      {
        if(ii == g.priv.discardDeck.length) // we're at the end, wrap around
        {
          ii = -1;
          continue;
        }
        if(ii == i)
        {
          break; // gone all the way around already... probably shouldn't have got this far.
        }

        if(g.priv.discardDeck[ii] == -1) // this player is not playing.
          continue;
        // else, we have our guy.
        if(g.priv.discardDeck[ii] == 99)
        {
          // last guy did not discard, so our current guy gets a fresh card.
          var card = g.priv.deck.deck.pop();
          var from = 99;
        }
        else
        {
          var card = g.priv.discardDeck[ii];
          var from = ii;
        }

      }
      // need to delete the card in their hand!
      // TODO optimize this unnecessary bit of looping
      for(var iii=0; iii < g.priv.hand[i].length; iii++)
      {
        for(var iiii=0; iiii < g.priv.discardDeck.length; iiii++)
        if(g.priv.hand[i][iii] == g.priv.discardDeck[iiii])
        {
          g.priv.hand[i].splice(iii,1);
        }
      }
      g.priv.hand[i].push(card);
      activeSessionsBySocketId[g.priv.players[i].socketId].emit('game',{"action":"deal","card":card, "from": from});

    }

    gameBroadcast(g,{"action":"debug", "game" : g });
  }

  function betStart(gamePtr)
  {
    var g = scServer.global.games[gamePtr];

    // console.log("socket array ", g.game.firstCardIx);

    gameBroadcast(g,{"action":"debug", "game" : g});

    g.game.betStep=Number(0);
    g.game.betCurrent=g.game.firstCardIx;
    g.game.finalIx = g.game.firstCardIx;
    g.game.betNext = g.game.firstCardIx;

    activeSessionsBySocketId[g.priv.players[g.game.firstCardIx].socketId].emit('game',{"action":"bet","cumulativeBet":0, "currentMax": 0, betStep:0});
  }

  function playerArray(gamePtr, startIx, endIx)
  {
    var g = scServer.global.games[gamePtr];
    var out = [];
    for(var i=startIx; i < g.game.status.length; i++)
    {
      out.push(g.game.status[i]);
    }
    for(var i=0; i < startIx; i++)
    {
      out.push(g.game.status[i]);
    }
    return out;
  }

  function playerNext(gamePtr, startIx)
  {
    var g = scServer.global.games[gamePtr];
    if(g.game.status[startIx+1])
    {
      return startIx+1;
    }
    else
    {
      return 0;
    }
  }

  function playerPrev(gamePtr, startIx)
  {
    var g = scServer.global.games[gamePtr];
    if(g.game.status[startIx-1])
    {
      return startIx-1;
    }
    else
    {
      return g.game.status.length;
    }
  }

  function betRound(gamePtr, data, socketId)
  {
    // console.log("betRound", data);

    // data is a packet from a specific player.

    // {bet: 0} for check
    // {bet: -1} for fold
    // {bet: nn} for call or raise for nn amount

    // seek a bet from each player, in order, one at a time.

    // betStep is just an incremental value that counts how many "rounds" have happened
    // raiseCount is how many "raises" there have been, up to some limit
    // finalIx is who will be the last to act for a given round. His bet or fold makes the pot "right"

    // status[] here is the current bet amount for that player. if -1, they have folded.




    var g = scServer.global.games[gamePtr];
    if(g)
    {


      if(data)
      {
        // TODO was it this player's turn?




        if(data.bet == 'check')
        {

        }
        if(data.bet == 'bet' || data.bet == 'raise')
        {
          g.priv.players[g.game.betCurrent].balance -= data.amount;

          //console.log("before", g.game.status, g.game.status[Number(g.game.betCurrent)], g.game.betCurrent);

          g.game.status[Number(g.game.betCurrent)] = Number(g.game.status[Number(g.game.betCurrent)]) + Number(data.amount); 

          //console.log("before", g.game.status, g.game.status[Number(g.game.betCurrent)], g.game.betCurrent);
          if(data.bet == 'raise')
          {

          }
          
        }
        if(data.bet == 'raise')
        {
          //g.game.status[g.game.betCurent] += data.amount; 
          //g.game.finalIx = g.game.betCurrent;
          g.game.finalIx = g.game.betCurrent;
          g.game.raiseCount++;
        }
      }

      // find our next bettor, and send him an action packet -- move betNext forward
      for(var i=g.game.betNext+1; i <= g.game.seats.length; i++)
      {
        // console.log("###",i,g.game.betNext);

        if(i == g.game.seats.length) // if we're at the end, loop to the beginning
        {
          i = -1;
          continue;
        }
        if (g.game.betNext == i) // if we've arrived where we started, bail out. if we get here, everyone folded.
        {
          break;
        }
        if(g.game.status[i] != -1) // is this person "in" still?
        {
          g.game.betNext = i;
          break;
        }
      }


      // is the pot "right" ?

      if(g.game.finalIx == g.game.betNext && g.game.betStep>0) // we're done
      {
        // verify pot is "right" ?
        var betCount=0;
        var maxBet=-1;
        for(var i=0; i < g.game.status.length; i++)
        {
          if(g.game.status[i] >= 0 && g.game.status[i] != maxBet)
          {
            maxBet = g.game.status[i];
            betCount++; // number of mismatches
          }
        }
        // console.log("betCount ", betCount);
        if(betCount==1)
        {
          gameBroadcast(g,{"action":"debug - done betting", "game" : g });
          return true;
        }
      }
      else
      {
        // something went really wrong here.
      }

      // find out what the max bet is on the table right now.
      var maxBet=0;
      for(var i=0; i < g.game.status.length; i++)
      {
        if(g.game.status[i] > maxBet)
          maxBet = g.game.status[i];
      }
      sendTableUpdate(gamePtr);
      gameBroadcast(g,{"action":"debug", "game" : g });
      // send a bet request




      activeSessionsBySocketId[g.priv.players[g.game.betNext].socketId].emit('game',{"action":"bet","cumulativeBet":g.game.status[g.game.betNext], "currentMax": maxBet, betStep:g.game.betStep});
      g.game.betCurrent = g.game.betNext;
      g.game.betStep++;
    }
    // when the pot is "right", return true;
    // console.log("returning false");
    return false;
  }

  function sendTableUpdate(gamePtr)
  {
    var g;
    if(g = scServer.global.games[gamePtr])
    {
      var playerBalances = [];
      for(var i=0; i < g.game.status.length; i++)
      {
        if(g.game.status[i]>=0)
        {
          playerBalances[i] = {};

          playerBalances[i] = {"nick":g.priv.players[i].nick, "balance":g.priv.players[i].balance};
        }
      }
      gameBroadcast(g,{"action":"update", "game" : g.game, "balances":playerBalances });
    }
  }

  function collectChips(gamePtr)
  {
    sendTableUpdate(gamePtr);
    var g;
    if(g = scServer.global.games[gamePtr])
    {
      for(var i=0; i < g.game.status.length; i++)
      {
        if(g.game.status[i]>0)
        {
          // collect the money, put it in the pot
          g.game.potBalance += g.game.status[i];
          g.game.status[i]=0;
        }
      }
    }
  }

  function showDown(gamePtr)
  {
    var g;

    if(g = scServer.global.games[gamePtr])
    {
      gameBroadcast(g,{"action":"debug-cards", "game" : cards });
      var playerCount=0;
      var endPlayers = [];
      var endHands = [];

      for(var i=0; i < g.game.status.length; i++)
      {
        if(g.game.status[i] == 0) // this person is actually in the game still
        {
          endPlayers.push(i);
        }
      }
      if(endPlayers.length>1) // we need to evaluate hands
      {
        for(var i=0; i < endPlayers.length; i++)
        {

          // once per player

          endHands[i] = {"moon":0, "sun":0, "waves":0, "leaves":0, "wyrms":0, "knots":0, "personality":0, "location":0, "event":0, "run":0, "pair":0, "trio":0, "flush":0, "single":0, "twoFlush":0, "typeSingle":0, "typeFlush":0, "typeTwoFlush":0}
          g.priv.hand[i].sort(); // sort our array of cards.

          for(var ii=0; ii < g.priv.hand[i].length; ii++)
          {



            // once per card

            if(cards[g.priv.hand[i][ii]].moon)
              endHands[i].moon++;

            if(cards[g.priv.hand[i][ii]].sun)
              endHands[i].sun++;

            if(cards[g.priv.hand[i][ii]].waves)
              endHands[i].waves++;

            if(cards[g.priv.hand[i][ii]].leaves)
              endHands[i].leaves++;

            if(cards[g.priv.hand[i][ii]].wyrms)
              endHands[i].wyrms++;

            if(cards[g.priv.hand[i][ii]].knots)
              endHands[i].knots++;

            if(cards[g.priv.hand[i][ii]].personality)
              endHands[i].personality++;

            if(cards[g.priv.hand[i][ii]].location)
              endHands[i].location++;

            if(cards[g.priv.hand[i][ii]].event)
              endHands[i].event++;

            








          }


          // once per player, after loop

          // let's short-circuit the calculations

          if(endHands[i].moon == 3)
          {
            endHands[i].flush++;
          }
          if(endHands[i].sun == 3)
          {
            endHands[i].flush++;
          }
          if(endHands[i].waves == 3)
          {
            endHands[i].flush++;
          }
          if(endHands[i].leaves == 3)
          {
            endHands[i].flush++;
          }
          if(endHands[i].wyrms == 3)
          {
            endHands[i].flush++;
          }
          if(endHands[i].knots == 3)
          {
            endHands[i].flush++;
          }

          if(endHands[i].moon == 2)
          {
            endHands[i].twoFlush++;
          }
          if(endHands[i].sun == 2)
          {
            endHands[i].twoFlush++;
          }
          if(endHands[i].waves == 2)
          {
            endHands[i].twoFlush++;
          }
          if(endHands[i].leaves == 2)
          {
            endHands[i].twoFlush++;
          }
          if(endHands[i].wyrms == 2)
          {
            endHands[i].twoFlush++;
          }
          if(endHands[i].knots == 2)
          {
            endHands[i].twoFlush++;
          }

          if(endHands[i].moon == 1)
          {
            endHands[i].single++;
          }
          if(endHands[i].sun == 1)
          {
            endHands[i].single++;
          }
          if(endHands[i].waves == 1)
          {
            endHands[i].single++;
          }
          if(endHands[i].leaves == 1)
          {
            endHands[i].single++;
          }
          if(endHands[i].wyrms == 1)
          {
            endHands[i].single++;
          }
          if(endHands[i].knots == 1)
          {
            endHands[i].single++;
          }

          if(endHands[i].personality==3)
          {
            endHands[i].typeFlush++;
          }
          if(endHands[i].location==3)
          {
            endHands[i].typeFlush++;
          }
          if(endHands[i].event==3)
          {
            endHands[i].typeFlush++;
          }

          if(endHands[i].personality==2)
          {
            endHands[i].typeTwoFlush++;
          }
          if(endHands[i].location==2)
          {
            endHands[i].typeTwoFlush++;
          }
          if(endHands[i].event==2)
          {
            endHands[i].typeTwoFlush++;
          }

          if(endHands[i].personality==1)
          {
            endHands[i].typeSingle++;
          }
          if(endHands[i].location==1)
          {
            endHands[i].typeSingle++;
          }
          if(endHands[i].event==1)
          {
            endHands[i].typeSingle++;
          }

          if(g.priv.hand[0] != 0 && (cards[g.priv.hand[i][0]].rank+2 == cards[g.priv.hand[i][1]].rank+1 ==  cards[g.priv.hand[i][2]].rank))  // run
          {
            endHands[i].run=1; // run high card
          }

          if(cards[g.priv.hand[i][0]].rank == cards[g.priv.hand[i][1]].rank || cards[g.priv.hand[i][0]].rank == cards[g.priv.hand[i][2]].rank || cards[g.priv.hand[i][1]].rank == cards[g.priv.hand[i][2]].rank)
          {
            endHands[i].pair=1; // pair
          }

          if(cards[g.priv.hand[i][0]].rank == cards[g.priv.hand[i][1]].rank && cards[g.priv.hand[i][1]].rank == cards[g.priv.hand[i][2]].rank)
          {
            endHands[i].trio=1; // trio
          }

          if(endHands[i].flush==0 && endHands[i].twoFlush==0 && endHands[i].single==6)
          {
            endHands[i].totum=1;
          }

          if(endHands[i].flush==0 && endHands[i].twoFlush==0 && endHands[i].single == 6 && endHands[i].typeFlush==0 && endHands[i].typetwoFlush==0 && endHands[i].typeSingle == 3)
          {
            endHands[i].fullSpread=1;
          }

          if(endHands[i].typeFlush==1)
          {
            // kindred
            endHands[i].kindred=1;
          }

          if(endHands[i].typeSingle==3)
          {
            // fortune
            endHands[i].fortune=1;
          }








          endHands[i].handRank=0; // void

          // let's rank them in order:

          if(endHands[i].pair==1)
          {
            // pair
            endHands[i].justPair=1;
            endHands[i].handRank=1;
          }

          if(endHands[i].flush==1)
          {
            // flush
            endHands[i].flush=1;
            endHands[i].handRank=2;
          }

          if(endHands[i].pair==1 && endHands[i].fortune==1)
          {
            // fortune pair
            endHands[i].fortunePair=1;
            endHands[i].handRank=3;
          }

          if(endHands[i].flush>0 && endHands[i].fortune==1)
          {
            // fortune single flush
            endHands[i].fortuneSingleFlush=1;
            endHands[i].handRank=4;
          }

          if(endHands[i].run==1)
          {
            // run
            endHands[i].run=1;
            endHands[i].handRank=5;
          }

          if(endHands[i].flush>0 && endHands[i].kindred==1)
          {
            // kindred single flush
            endHands[i].kindredSingleFlush=1;
            endHands[i].handRank=6;
          }

          if(endHands[i].pair==1 && endHands[i].flush==1)
          {
            // single flush pair
            endHands[i].singleFlushPair=1;
            endHands[i].handRank=7;
          }

          if(endHands[i].pair==1 && endHands[i].kindred==1)
          {
            // kindred pair
            endHands[i].kindredPair=1;
            endHands[i].handRank=8;
          }

          if(endHands[i].run==1 && endHands[i].flush==1)
          {
            // running single flush
            endHands[i].runningSingleFlush=1;
            endHands[i].handRank=9;
          }

          if(endHands[i].totum==1)
          {
            // totum
            endHands[i].totum=1;
            endHands[i].handRank=10;
          }

          if(endHands[i].trio==1)
          {
            // totum trio
            endHands[i].trio=1;
            endHands[i].handRank=11;
          }

          if(endHands[i].pair==1 && endHands[i].totum==1)
          {
            // totum pair
            endHands[i].totumPair=1;
            endHands[i].handRank=12;
          }

          if(endHands[i].flush==2 && endHands[i].single > 0)
          {
            // impure twin flush
            endHands[i].impureTwinFlush=1;
            endHands[i].handRank=13;
          }

          if(endHands[i].fullSpread==1)
          {
            // full spread
            endHands[i].fullSpread=1;
            endHands[i].handRank=14;
          }

          if(endHands[i].pair==1 && endHands[i].fullSpread == 1)
          {
            // full spread pair
            endHands[i].fullSpreadPair=1;
            endHands[i].handRank=15;
          }
          
          if(endHands[i].trio==1 && endHands[i].totum==1)
          {
            // totum trio
            endHands[i].totumTrio=1;
            endHands[i].handRank=16;
          }

          if(endHands[i].trio==1 && endHands[i].fullSpread==1)
          {
            // full spread trio
            endHands[i].fullSpreadTrio=1;
            endHands[i].handRank=17;
          }

          if(endHands[i].flush==2 && endHands[i].twoFlush==0 && endHands[i].single==0)
          {
            // pure twin flush
            endHands[i].pureTwinFlush=1;
            endHands[i].handRank=18;
          }

          if(endHands[i].run==1 && endHands[i].totum==1)
          {
            // running totum
            endHands[i].runningTotum=1;
            endHands[i].handRank=19;
          }

          if(endHands[i].run==1 && endHands[i].flush==2)
          {
            // running twin flush
            endHands[i].runningTwinFlush=1;
            endHands[i].handRank=20;
          }

          if(endHands[i].typeFlush == 2)
          {
            // doublyKindred
            endHands[i].doublyKindred=1;
            endHands[i].handRank=21;
          }





        }
      }
      else
      {
        // win by default.

      }

      g.game.endHands = endHands;

      var highRank=-1;
      var winner=-1;

      for(var i=0; i < endPlayers.length; i++)
      {
        if(endHands[i].handRank > highRank)
        {
          highRank=endHands[i].handRank;
          winner=i;
        }
      }
      g.game.winner=winner;
      g.priv.players[winner].balance += g.game.potBalance;
      g.game.potBalance=0;

      gameBroadcast(g,{"action":"debug", "game" : g });
      gameBroadcast(g,{"action":"endgame", "game" : g.game });
      // reset the game

    }
    // calculate who has the best hand.
    // hmm...
    

  }


  function doAdvanceGame(gamePtr, duration)
  {
    console.log("### Advance delay ", gamePtr, duration);

    
    var g = scServer.global.games[gamePtr];

    if(g)
    {
      console.log("### Game Phase ", g.game.phase);

      if(g.priv.timer>0)
      {
        return;
      }
      g.priv.timer=1;
      setTimeout(advanceGame, duration, gamePtr);


    }
    
  }

  function advanceGame(gamePtr)
  {
    log("Advanced Game ");
    // does our gamePtr exist?

    var g;
    if(g = scServer.global.games[gamePtr])
    {
      g.priv.timer=0;
      log("Advanced GamePtr " + gamePtr + " phase " + g.game.phase);
      // does our gamePtr exist?

      switch(g.game.phase)
      {
        case -1: // we are starting a new round in an established game
          g.game.phase=0;
          doAdvanceGame(gamePtr,1000);
        break;
        case 0: // waiting for players

          // reset game state to a fresh game.
          g.anteWait=0;





          // do we have more than 2 players?
          // TODO delay waiting for players
          if(g.priv.players.length > 1)
          {
            console.log("enough players");
            g.game.phase = 1; // ante up!

            g.game.anteCheck=0;
            //scServer.global.publish(g.game.channel, {"action":"advance", "game" : g.game });
            gameBroadcast(g,{"action":"advance", "game" : g.game });

            // give these turkeys 10 seconds to ante up.

            doAdvanceGame(gamePtr,5000);

            if(g.game.anteCheck++ > 10)
            {

            }

          }
        break;

        case 1: // ante
          
          //gameBroadcast(g,{"action":"debug", "game" : g });
          var advance=0;
          // console.log("ante check");
          for(var i=0; i < g.game.status.length; i++)
          {
            if(g.game.status[i] > 0) // this player has ante'd
            {
              advance++;
              // console.log("ante advance ", advance);
            }
          }

          // TODO make this make sense -- currently it starts the game after a hardcoded player count...?
          if(advance>1) // we have at least 2 players in the game
          {
            
            // scServer.global.publish(g.game.channel, {"action":"advance", "game" : g.game, "channel":scServer.global.watchers(g.game.channel) });
            
            // deal cards

            // get a deck for this game

            // DECKSERVER

            var req = http.get(
            {
              host: '10.0.0.100',
              path: '/',
              port: 8080
            }, 
            function(res) 
            {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));

              // Buffer the body entirely for processing as a whole.
              var bodyChunks = [];
              res.on('data', function(chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
              }).on('end', function() {
                var body = Buffer.concat(bodyChunks);
                  console.log('BODY: ' + body);
                  g.priv.deck = JSON.parse(body);
                  // gameBroadcast(g,{"action":"debug", "game" : g });

                  // deal?
                  g.game.phase = 2;
                  gameBroadcast(g,{"action":"advance", "game" : g.game });
                  doAdvanceGame(gamePtr,1000); // proceed to deal cards

                // ...and/or process the entire body here.
              });
            });
            
          }
          else // not enough ante'd
          {
            if(g.game.anteWait)
              g.game.anteWait++;
            else
              g.game.anteWait=1;

            if(g.game.anteWait<100)
            {
              // another shot
              console.log("--- waiting for antes ",advance," ", g.priv.players.length);
              doAdvanceGame(gamePtr,1000);
              break;
            }
            else
            {
              // close down the game, nobody anted
              console.log("### game did not start");

            }
            
          }
          // we fell out of the loop somehow
          console.log("fell out of phase 1");
          doAdvanceGame(gamePtr,1000);
        break;
        case 2:
          collectChips(gamePtr); // get all of the chips out of status into the pot
          dealGame(gamePtr);

          g.game.phase=3;
          gameBroadcast(g,{"action":"advance", "game" : g.game });
          doAdvanceGame(gamePtr,1000); // move to step 3
        break;
        case 3:
          // begin a bet round
          betStart(gamePtr);
          
        break;
        case 4:
          // begin a discard-or-pass round
          collectChips(gamePtr);
          discardStart(gamePtr);
        break;
        case 5:
          betStart(gamePtr);
        break;
        case 6:
          collectChips(gamePtr);
          discardStart(gamePtr);
        break;
        case 7:
          betStart(gamePtr);
        break;
        case 8:
          collectChips(gamePtr);
          // console.log("### Showdown!");
          showDown(gamePtr);

          g.game.phase = 0; // ante up!
          g.game.anteCheck=0;
          //scServer.global.publish(g.game.channel, {"action":"advance", "game" : g.game });
          gameBroadcast(g,{"action":"advance", "game" : g.game });

          doAdvanceGame(gamePtr,1000);
          


        break;

      }
    }
    // what is our current game state?

  }

  function gamePacket(data, socketId, socket)
  {

    // we received a packet from a player. Let's figure out what to do with it.

    var gamePtr = activeSessionsBySocketId[socket.session.socketId].gamePtr;
    var gameIx = activeSessionsBySocketId[socket.session.socketId].gameIx;
    var playerPtr = activeSessionsBySocketId[socket.session.socketId].playerPtr;

    // console.log("--> Received gamePacket from ", socketId, " action = ", data.action)

    var g = scServer.global.games[gamePtr]; // get the current game for this player.

    gameBroadcast(g,{"action":"debug", "game" : g });
    //log("pertains to gamePtr " + gamePtr);

    if(data.action == 'sit')
    {

    }
    if(data.action == 'ante')
    {
      log("ante " + playerPtr);
      //console.log(g);
      // is this person sat?
      var seatIx = -1;
      for(var i=0; i < g.game.seats.length; i++)
      {
        if(g.game.seats[i] == playerPtr)
        {
          // player is sat.
          seatIx = i;
          // console.log("player is sat");
        }
      }

      if(seatIx == -1) // player is not sat.
      {
        // seat player
        for(var i=0; i < g.game.seats.length; i++)
        {
          if(g.game.seats[i] == -1)
          {
            // seat this player
            g.game.seats[i] = playerPtr;
            seatIx = i;
            break;
          }
        }
      }

      if (g.priv.players[playerPtr].balance < g.pub.ante)
      {
        // player cannot afford to ante
        console.log("player cannot afford to ante ", playerPtr);
      }
      else
      {
        // console.log("player can afford to ante");
        // ante
        // check for player having already ante'd
        // check for game status being 1 for ante

        // move player's money to status for later collection

        g.priv.players[playerPtr].balance -= g.pub.ante;
        g.game.status[playerPtr] = g.pub.ante; // ante and ready
      }

      // broadcast this action
      // scServer.global.publish(g.game.channel, {"action":"ante", "game" : g.game });
      socket.emit('anted',{});
      //gameBroadcast(g,{"action":"ante", "game" : g.game });
    }
    if(data.action == 'bet')
    {
      // console.log("received bet");
      //betRound(gamePtr, data, socketId)
      
      if(betRound(gamePtr, data, socketId)) // are we done with the round?
      {
        // console.log("received true from betRound...?");


        // rake all the bets into the pot

        collectChips(gamePtr);

        g.game.phase++;
        gameBroadcast(g,{"action":"advance", "game" : g.game });
        doAdvanceGame(gamePtr,1000);
      }
      
    }
    
    if(data.action == 'discard')
    {
      // console.log("received discard");
      //betRound(gamePtr, data, socketId)
      
      if(discardRound(gamePtr, data, socketId)) // are we done with the round?
      {
        // console.log("received true from discardRound...?");

        g.game.phase++;
        gameBroadcast(g,{"action":"advance", "game" : g.game });
        doAdvanceGame(gamePtr,1000);
      }
    }
    if(data.action == 'pass')
    {

    }
    if(data.action == 'resend') // client feels like it missed a packet, re-send
    {

    }
    //console.log("After", g.game);
  }



  /*
    In here we handle our incoming realtime connections and listen for events.
    From here onwards is just like Socket.io but with some additional features.
  */
  scServer.on('connection', function (socket) {
    /*
      Store that socket's session for later use.
      We will emit events on it later - Those events will 
      affect all sockets which belong to that session.
    */
    activeSessions[numSessions++] = socket.session;
    activeSessionsBySocketId[socket.session.socketId] = socket;

    console.log("### Connection (total: " + numSessions + ") " + socket.session.socketId);

    socket.on('getgames', function (data) {
      // TODO limit amount of data being sent down -- some of it is private.
      socket.emit('gamelist',scServer.global.gamesList);
    });

    socket.on('action', function (data) {
      // TODO limit amount of data being sent down -- some of it is private.
      gamePacket(data, socket.session.socketId, socket);
    });

    socket.on('join', function (data)
    {
      addPlayerToGame(data,socket.session.socketId,socket);
    });


// make a gameList every 15 seconds

    setInterval(function () {
      // for fun, make a new game
      if( scServer.global.gamesIx < 5)
        createGame();

      scServer.global.publish("gamelist", scServer.global.gamesList);

    }, 15000);

        

  });

  scServer.on('sessionEnd', function (ssid) {
    numSessions--;
    // remove session from games?
    console.log("### Lost Connection (total: " + numSessions + ") " + ssid);

    // sweep player chips to the pot

    // advance the game if we're waiting for this guy

    // kick him from the game

    delete activeSessions[ssid];
  });
  
  
};

