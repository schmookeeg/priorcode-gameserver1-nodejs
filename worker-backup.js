

var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');

var crypto = require('crypto');



module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  
  var app = require('express')();
  
  // Get a reference to our raw Node HTTP server
  var httpServer = worker.getHTTPServer();
  // Get a reference to our realtime SocketCluster server
  var scServer = worker.getSCServer();
  
  scServer.global.games = [];
  scServer.global.gamesIx = 0;

  // make a dummy game to play
  createGame();

  app.use(serveStatic(path.resolve(__dirname, 'public')));

  httpServer.on('req', app);

  var activeSessions = [];
  var activeSessionsBySocketId = {};
  var numSessions = 0;
  var count = 0;
/*
  function createGame()
  {
    var channel = crypto.randomBytes(32).toString('hex');

    var newGame = {   
        "gameIx"        : scServer.global.gamesIx++           , 
        "name"          : "Games 1"                           , 
        "players"       :[]                                   , 
        "wallet"        : ""                                  , 
        "seats"         : [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]     , 
        "dealerIx"      :-1                                   , 
        "actIx"         :-1                                   , 
        "channel"       : channel                             ,
        "phase"         : 0                                   ,
        "step"          : 0                                   ,
        "potBalance"    : 0                                   ,
        "rakeBalance"   : 0                                   ,
        "roundIx"       : 0                                   ,
        "roundPackets"  : []                                  ,
        "ante"          : 10                                  ,
        "minBet"        : 10                                  ,
        "maxBet"        : 40                                  ,
        "numRaises"     : 3                                   ,
        "minStake"      : 100                                 ,
        "maxStake"      : 1000                                
    };

    scServer.global.games.push(newGame);


  }
*/
/*
  function goNext(socket, gameIx, seatIx)
  {
    console.log("Player " + seatIx + " has sent a next request");
    // the player in seatIx has done something -- let's send the next seat a "turn" packet
    if (seatIx == 9)
    {
      seatIx == 0;
    }

    for(var i = seatIx+1; i < 10; i++)
    {
      if (scServer.global.games[gameIx].seats[i] >= 0)
      {
        // this dude is next.

        activeSessionsBySocketId[scServer.global.games[gameIx].players[i].socketId].emit('turn', new Date().getTime());
        return;
      }
    }
    for(var i = 0; i < seatIx+1; i++)
    {
      if (scServer.global.games[gameIx].seats[i] >= 0)
      {
        // this dude is next.
        activeSessionsBySocketId[scServer.global.games[gameIx].players[i].socketId].emit('turn', new Date().getTime());
        return;
      }
    }
    // we didn't find a player to ping... must be the only dude in there?
    
    

  }
*/

/*
  function gamePacket(data, socketId, socket)
  {
    // we received a packet from a player. Let's figure out what to do with it.
    if(data.action == 'join')
    {

    }
    if(data.action == 'sit')
    {

    }
    if(data.action == 'ante')
    {

    }
    if(data.action == 'bet')
    {

    }
    if(data.action == 'fold')
    {

    }
    if(data.action == 'raise') // probably superfluous
    {

    }
    if(data.action == 'discard')
    {

    }
    if(data.action == 'pass')
    {

    }
    if(data.action == 'resend') // client feels like it missed a packet, re-send
    {

    }
  }
*/



/*

  function addPlayerToGame(data, socketId, socket)
  {
    var g = scServer.global.games;

    

    //console.log("### adding player", data.id, " to ", g);

    for(var i=0; i < g.length; i++)
    {
      //console.log("### loop", g.length);
      
      if(g[i].id == data.id)
      {
        // we found our game, index i; set it up


        if(g[i].players && g[i].players.length)
        {
          //console.log("dupe check");
          for(var iii=0; iii < g[i].players.length; iii++)
          {
            console.log("check", g[i].players[iii].socketId, socketId);
            if(g[i].players[iii].socketId == socketId) // dude is already in
            {
              console.log("dupe add rejected");
              return false;
            }
          }
        }


        //console.log("matched on id ", i );
        data.socketId = socketId;

        g[i].players.push(data);
        var playerIx = g[i].players.length-1;

        break;    
      }
      
    }

    if(g[i].players.length>1)
    {
      // commence game

    }

    socket.session.gameIx = i;
    console.log("this player is playing in game " + i)

    var newPacket = {};
    newPacket.action = "newPlayer";
    newPacket.data = g[i];
    scServer.global.publish(g[i].channel, newPacket);
  }
*/

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
    /*
    activeSessions[numSessions++] = socket.session;
    activeSessionsBySocketId[socket.session.socketId] = socket;
*/
    console.log("### Connection (total: " + numSessions + ") " + socket.session.socketId);
    /*
    socket.on('ping', function (data) {
      count++;
      console.log('PING', data);
      scServer.global.publish('pong', count);
    });
*/
    socket.on('getgames', function (data) {
      // TODO limit amount of data being sent down -- some of it is private.

      socket.emit('gamelist',scServer.global.games);
    });
/*
    socket.on('join', function (data) {
      // check validity

      // add to game
      // console.log("session", socket.session);
      addPlayerToGame(data, socket.session.socketId, socket);






      for (var i=0; i < activeSessions.length; i++)
      {
        console.log("session", i , activeSessions[i].socketId);
      }
      

      socket.emit('joined',scServer.global.games);
    });

    socket.on('next', function(data) {
      console.log("### Mister " + socket.session.socketId + " is calling for game [" + socket.session.gameIx + "] to proceed.");

      for(var i=0; i < scServer.global.games[socket.session.gameIx].seats.length; i++)
      {
        // find out what seat we're in
        if(scServer.global.games[socket.session.gameIx].players[scServer.global.games[socket.session.gameIx].seats[i]].socketId == socket.session.socketId) // gotcha
        {
          var seatIx = i;
          break;
        }
      }

      // we know the seat.
      console.log("This player is sitting in seat " + seatIx);
      goNext(socket, socket.session.gameIx, seatIx);
    });

    socket.on('start', function(data) {
      console.log("### Mister " + socket.session.socketId + " is calling for game [" + socket.session.gameIx + "] to start.");

      for(var i=0; i < scServer.global.games[socket.session.gameIx].seats.length; i++)
      {
        // find out what seat we're in
        if(scServer.global.games[socket.session.gameIx].players[scServer.global.games[socket.session.gameIx].seats[i]].socketId == socket.session.socketId) // gotcha
        {
          var seatIx = i;
          break;
        }
      }

      // we know the seat.
      console.log("This player is sitting in seat " + seatIx);
      goNext(socket, socket.session.gameIx, seatIx);
    });

  });
  */
  scServer.on('sessionEnd', function (ssid) {
    numSessions--;
    // remove session from games?


    delete activeSessions[ssid];
  });
  /*
  setInterval(function () {
    for (var i in activeSessions) {
      //activeSessions[i].emit('game-1', {rand: Math.floor(Math.random() * 5)});
      //scServer.global.publish(scServer.global.games[0].channel, 'ping');
    }
  }, 1000);
*/
};