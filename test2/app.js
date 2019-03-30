var socket = io();
var team = 0;
var timer = 10;
var counter = 0;

// Get username value from url
const urlParams = new URLSearchParams(window.location.search);
var myUsername = urlParams.get("myVar1");

/* Function that end the game*/
function endGame(teamPoints, playerPoints, teamPoints2) {
    $('#test').html('GAME END');
    $('#numOfPlayers').html("Your team: " + teamPoints + "   Opponents: " + teamPoints2);
    $('#points').html("Team Points " + teamPoints + " Player Points: " + playerPoints);
    var timeInterval = setInterval(() => { // End game after x amount of seconds
        counter++;
        $('#timer').html("GAME Ending IN: " + (timer - counter));
        if (timer == counter) {
            counter = 0; //reset timer
            window.location.href = "./login.html";
        }
    }, 1000);

}


var app = angular.module("app", []);
app.controller("cont", function($scope) {
    $scope.words = [];
    $scope.team1 = [];
    $scope.team2 = [];


    /*Method that removes word if user entered it*/
    $scope.findword = function(string) {
        for (let i = 0; i < $scope.words.length; i++) {
            if (string === $scope.words[i]) {
                $scope.words.splice($scope.words.indexOf(string), 1);
                return true;
            }
        }
        return false;
    }

    $(function() {

        socket.emit('setUsername', myUsername);


        $scope.team1Points = 0;
        $scope.team2Points = 0;
        $('form').submit(function() {
            socket.emit('chat message', $('#m').val());

            $('#m').val('');
            return false;
        });

        /* Function that updates score*/
        socket.on('updateScore', function(point1, point2) {
            $scope.$apply(function() {
                $scope.team1Points = point1;
                $scope.team2Points = point2;
            });
        });


        socket.on('setTeam', function(arr, arr2) {

            $scope.team1 = arr;
            $scope.team2 = arr2;

        });


        /* Function that recieves entered messages. If the message is not null, it is sent to the server
        Which then sets the correct array and gives points to user*/
        socket.on('chat message', function(msg, team, id) {
            $scope.$apply(function() { //APPLIES CHANGE TO FUNCITON
                if (msg != null && msg != '' && $scope.findword(msg)) {
                    socket.emit('correct', parseInt(team), msg, id);
                    socket.emit('setArr', $scope.words);
                }
            });
        });

        /* Change value of scope array with array from server*/
        socket.on('sentNewArray', function(msg) {
            $scope.$apply(function() {
                $scope.words = msg;
            });
        });


        /* What to do when all words are empty*/
        socket.on('endGame', function(teamPoints, playerPoints, teamPoints2) {
            endGame(teamPoints, playerPoints, teamPoints2);
        });

        socket.on('endGameWin', function(teamPoints, playerPoints, teamPoints2) {
            endGame(teamPoints, playerPoints, teamPoints2);
            $('#win').html('Victory');
        });



        socket.on('endGameLose', function(teamPoints, playerPoints, teamPoints2) {
            endGame(teamPoints, playerPoints, teamPoints2);
            $('#win').html('Defeat');
        });


        /* What to do when enough people are in the game*/
        socket.on('start', function(msg) {
            $('#numOfPlayers').html("");
            $('#test').html('PASS');
            $('#room').html(msg);
            // socket.emit('setUsername', myUsername);
            var timeInterval = setInterval(() => {
                counter++;
                $('#timer').html("GAME STARTING IN: " + (timer - counter));
                if (timer == counter) {
                    // When timer reaches 0
                    $('#timer').html("GAME STARTED");
                    clearInterval(timeInterval); // Stops setInterval from continuing
                    counter = 0; //reset timer
                    var wordBank = ['hello', 'bye', 'tomorrow', 'tonight', 'alligator', 'phonebank', 'computer'];
                    socket.emit('setArr', wordBank);
                }
            }, 1000);
        });

        /* What to do when  not enough people are in room*/
        socket.on('not ready', function(numPeople) {
            $('#timer').html("Waiting for lobby to fill up...");
            $('#numOfPlayers').html(numPeople + "/" + 2 + " Players");
        });
    });
});