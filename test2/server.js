// Setting up server
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

/*
//////////////////// Aquiring handhandhaske module for sockets    NOT USED        ///////////////////////////////

var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

// Use express-session middleware for express
app.use(session);

// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(session, {
    autoSave: true
}));

io.of('/namespace').use(sharedsession(session, {
    autoSave: true
}));
*/

var numofUsers = 0;
var connections = [];
var numOfRooms = 0;
var team = 0;
var newplayer = false;
const numofPlayers = 4;

http.listen(port, function() {
    console.log("Server started..." + "\nListening on port: " + port + "\n");
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.use(express.static(__dirname + '/'));


//Function that updates users and assigns them to teams and rooms
function updateUsers(socket) {
    socket.points = 0;
    numOfRooms = parseInt(connections.length / 3);
    var numClients = 0;
    var newRoom;

    // Join any empty room
    for (let i = 0; i <= numOfRooms; i++) {
        var clientsInRoom = io.nsps['/'].adapter.rooms[i.toString()];
        numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;
        var started = io.sockets.adapter.rooms[i.toString()];
        var isStarted = started === undefined ? false : io.sockets.adapter.rooms[i.toString()].start;


        if (parseInt(numClients) < numofPlayers && !isStarted) { // Join room it it is not already started
            socket.join(i.toString());
            var team1 = (team % 2) + 1;
            team++;
            socket.team = team1;
            newRoom = i.toString();
            break;
        }

    }

    // If all current rooms are full, create new one.
    if (newRoom === undefined) {
        newRoom = (numOfRooms + 1).toString();
        numOfRooms++;
        socket.join(newRoom);
    }

    clientsInRoom = io.nsps['/'].adapter.rooms[newRoom];
    numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;
    // Set variables if enough people are in room



    if (numClients === numofPlayers) {
        io.to(newRoom).emit('start', newRoom);

        //        console.log(team1Arr + "     " + team2Arr + "...");
        io.sockets.adapter.rooms[newRoom].start = true;
        io.sockets.adapter.rooms[newRoom].points1 = 0;
        io.sockets.adapter.rooms[newRoom].points2 = 0;
        io.sockets.adapter.rooms[newRoom].isUpdated = false;

    } else {
        io.to(newRoom).emit('not ready', numClients);
    }

}


io.on('connection', function(socket) { // SOCKET.ID IS UNIQE TO EACH PERSON
    numofUsers++;
    connections.push(socket);
    socket.points = 0;

    // When a new player joins update users
    if (newplayer) {
        io.to(currentRoom).emit('chat message', '', socket.team, socket.id);
        updateUsers(socket);
    }

    newplayer = false;

    var currentRoom = Object.keys(io.sockets.adapter.sids[socket.id])[0];

    socket.on('disconnect', function() {
        numofUsers--;
        connections.splice(connections.indexOf(socket), 1);

        var started = io.sockets.adapter.rooms[currentRoom];
        var isStarted = started === undefined ? false : io.sockets.adapter.rooms[currentRoom].start;

        if (!isStarted) {
            clientsInRoom = io.nsps['/'].adapter.rooms[currentRoom];
            numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;
            io.to(currentRoom).emit('not ready', numClients);
        } else {
            updateUsernameString(currentRoom);
        }


    });


    // Once sever recieves chat message it sets the current room as not updated and emits the socet team and id
    socket.on('chat message', function(msg) {
        io.sockets.adapter.rooms[currentRoom].isUpdated = false;
        io.to(currentRoom).emit('chat message', msg, socket.team, socket.id);
        console.log(socket.username);
    });



    // Functions that gives 10 points per letter
    function wordPoint(word) {
        return word.length * 10;
    }


    // If word entered is correct assign points and upate the socket that got it
    socket.on('correct', function(team, word, id) {
        if (!io.sockets.adapter.rooms[currentRoom].isUpdated) { // Make sure no other socket has updated points
            if (parseInt(team) === 1) {
                io.sockets.adapter.rooms[currentRoom].points1 += wordPoint(word);

            } else if (parseInt(team) === 2) {
                io.sockets.adapter.rooms[currentRoom].points2 += wordPoint(word);
            }

        }

        if (socket.id === id)
            socket.points += wordPoint(word);

        io.sockets.adapter.rooms[currentRoom].isUpdated = true;

        socket.emit('updateScore', io.sockets.adapter.rooms[currentRoom].points1, io.sockets.adapter.rooms[currentRoom].points2);

    });



    function updateUsernameString(room) {
        var started = io.sockets.adapter.rooms[room];
        var isStarted = started === undefined ? false : io.sockets.adapter.rooms[room].start;

        if (isStarted) {
            var lobby = io.sockets.adapter.rooms[room].sockets;
            var team1Arr = [];
            var team2Arr = [];

            for (var socket1 in lobby) {

                var player = io.sockets.connected[socket1];

                console.log(player.team + " " + player.username);


                if (player.team === 1)
                    team1Arr.push(player.username);

                else
                    team2Arr.push(player.username);
            }

            io.to(room).emit('setTeam', team1Arr, team2Arr);
        }
    }




    socket.on('setUsername', function(name) {
        // console.log(name);
        socket.username = name;

        updateUsernameString(currentRoom);

        //   console.log(socket.username);
    });

    // Set username of Socket NOT USED
    socket.on('joinGame', function() {
        newplayer = true;
    });


    // Function that sets room array, if array is empty it emits a end game message to the html files
    socket.on('setArr', function(newWords) {
        io.sockets.adapter.rooms[currentRoom].words = newWords;
        if (newWords.length === 0) {
            var teamPoints, playerPoints;

            if (socket.team === 1)
                teamPoints = io.sockets.adapter.rooms[currentRoom].points1;
            else
                teamPoints = io.sockets.adapter.rooms[currentRoom].points2;

            playerPoints = socket.points;
            socket.emit('endGame', teamPoints, playerPoints);
        }

        io.to(currentRoom).emit('sentNewArray', io.sockets.adapter.rooms[currentRoom].words);
    });

});