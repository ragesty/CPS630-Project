var firebaseRef = firebase.database().ref();
var leaderboardArray = [];
/*{
    username: "test",
    points: 20
} */

function leaderboards() {
    var userRef = firebaseRef.child("users");
    var i = Object.keys(userRef).length - 1;
    userRef.orderByChild('points').on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            //console.log("The " + data.child("username").val() + " users score is " + data.child("points").val());

            document.getElementById('tableBody').innerHTML = "<tr>" +
                "<td>" + i + "</td>" +
                "<td>" + data.child("username").val() + "</td>" +
                "<td>" + data.child("points").val() + "</td>" +
                "</tr>" +
                document.getElementById('tableBody').innerHTML;

            i--;
            //console.log(leaderboardArray);
            //console.log(typeof(leaderboardArray));
        });
    });
}

leaderboards();

console.log(leaderboardArray);
console.log(typeof(leaderboardArray));

const wanted = leaderboardArray.map(d => {
    return { username: d.username }
});
console.log(wanted);

var app = angular.module("app", []);
app.controller("leaderboardCont", function($scope) {
    $scope.users = [];
    $scope.users = leaderboardArray;
    /*
    console.log($scope.users);
    console.log(typeof($scope.users));
    console.log($scope.users[0]);
    console.log($scope.users[1]);
*/
});