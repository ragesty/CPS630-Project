var socket = io();
var team = 0;
var timer = 10;
var counter = 0;

var app = angular.module("app", []);
app.controller("cont", function($scope) {
    $scope.words = [];

    $scope.findword = function(string) {
        for (let i = 0; i < $scope.words.length; i++) {
            if (string === $scope.words[i]) {
                $scope.words.splice($scope.words.indexOf(string), 1);
                return true;
            }
        }
        return false;
    }

    function wordPoint(word) {
        return word.length * 10;
    }

    $(function() {

        $scope.team1Points = 0;
        $scope.team2Points = 0;
        $('form').submit(function() {
            socket.emit('chat message', $('#m').val());

            $('#m').val('');
            return false;
        });

        socket.on('updateScore', function(point1, point2) {
            $scope.$apply(function() {
                $scope.team1Points = point1;
                $scope.team2Points = point2;
            });
        });

        socket.on('chat message', function(msg, team) {
            $scope.$apply(function() { //APPLIES CHANGE TO FUNCITON
                if ($scope.findword(msg))
                    socket.emit('correct', parseInt(team), msg);
                socket.emit('setArr', $scope.words);
            });
        });

        socket.on('sentNewArray', function(msg) {
            $scope.$apply(function() {
                $scope.words = msg;
            });
        });

        socket.on('start', function(msg) {
            $('#test').html('PASS');
            $('#room').html(msg);

            var timeInterval = setInterval(() => {
                counter++;
                $('#timer').html("GAME STARTING IN: " + (timer - counter));
                if (timer == counter) {
                    // When timer reaches 0
                    $('#timer').html("GAME STARTED");
                    clearInterval(timeInterval); // Stops setInterval from continuing
                    counter = 0; //reset timer
                    var wordBank = ['hello', 'bye', 'tomorrow', 'tonight'];
                    socket.emit('setArr', wordBank);
                }
            }, 1000);
        });

        socket.on('not ready', function(msg) {
            $('#test').html('FAIL');
        });
    });
});