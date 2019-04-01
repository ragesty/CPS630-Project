var firebaseRef = firebase.database().ref();

function leaderboards() {
    var userRef = firebaseRef.child("users");
    userRef.orderByChild('points').on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            console.log("The " + data.child("username").val() + " users score is " + data.child("points").val());
        });
    });
}