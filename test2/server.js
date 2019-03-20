var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var numofUsers = 0;
var usernames = {};
var connections = [];
var numOfRooms = 0;
var team = 0;
const numofPlayers = 2;

http.listen(port, function() {
    console.log("Server started..." + "\nListening on port: " + port + "\n");
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'));

function updateUsers(socket) {
    numOfRooms = parseInt(connections.length / 3);
    var numClients = 0;
    var newRoom;

    for (let i = 0; i <= numOfRooms; i++) {
        var clientsInRoom = io.nsps['/'].adapter.rooms[i.toString()];
        numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;
        var started = io.sockets.adapter.rooms[i.toString()];
        var isStarted = started === undefined ? false : io.sockets.adapter.rooms[i.toString()].start;


        if (parseInt(numClients) < numofPlayers && !isStarted) {
            socket.join(i.toString());
            var team1 = (team % 2) + 1;
            team++;
            socket.team = team1;
            newRoom = i.toString();
            break;
        }

    }

    if (newRoom === undefined) {
        newRoom = (numOfRooms + 1).toString();
        numOfRooms++;
        socket.join(newRoom);
    }

    clientsInRoom = io.nsps['/'].adapter.rooms[newRoom];
    numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;

    if (numClients === numofPlayers) {
        io.to(newRoom).emit('start', newRoom);
        io.sockets.adapter.rooms[newRoom].start = true;
        io.sockets.adapter.rooms[newRoom].points1 = 0;
        io.sockets.adapter.rooms[newRoom].points2 = 0;
        io.sockets.adapter.rooms[newRoom].isUpdated = false;

        console.log(io.sockets.adapter.rooms[newRoom].start);
    } else {
        io.to(newRoom).emit('not ready');
    }
    //} // END OF BIG ELSE

} // END OF FUNC


io.on('connection', function(socket) { // SOCKET.ID IS UNIQE TO EACH PERSON
    numofUsers++;
    connections.push(socket);
    socket.points = 0;
    updateUsers(socket);
    var currentRoom = Object.keys(io.sockets.adapter.sids[socket.id])[0];

    socket.on('disconnect', function() {
        numofUsers--;
        connections.splice(connections.indexOf(socket), 1);

    });


    socket.on('chat message', function(msg) {
        io.to(currentRoom).emit('chat message', msg, socket.team);
        usernames[socket.id] = msg;
        io.sockets.adapter.rooms[currentRoom].isUpdated = false;
    });


    function wordPoint(word) {
        return word.length * 10;
    }


    socket.on('correct', function(team, word) { // DIVIDE BY NUMBER OF PEOPLE IN ROOM

        if (!io.sockets.adapter.rooms[currentRoom].isUpdated)
            if (parseInt(team) === 1) {
                io.sockets.adapter.rooms[currentRoom].points1 += wordPoint(word);
            } else if (parseInt(team) === 2) {
            io.sockets.adapter.rooms[currentRoom].points2 += wordPoint(word);
        }
        io.sockets.adapter.rooms[currentRoom].isUpdated = true;

        socket.emit('updateScore', io.sockets.adapter.rooms[currentRoom].points1, io.sockets.adapter.rooms[currentRoom].points2);

        console.log("Socket on team " + socket.team + " has " + socket.points + "points\n" + " Team 1: " + io.sockets.adapter.rooms[currentRoom].points1 + " Team 2: " + io.sockets.adapter.rooms[currentRoom].points2 + "\n-------------------------------------");
    });

    socket.on('setArr', function(newWords) {
        io.sockets.adapter.rooms[currentRoom].words = newWords;
        io.to(currentRoom).emit('sentNewArray', io.sockets.adapter.rooms[currentRoom].words);
    });

});