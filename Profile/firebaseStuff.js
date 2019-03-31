var database = firebase.database();
var user = firebase.auth().currentUser; //this will be null if there isn't anyone currently logged in
var points, username, imgURL;

function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut()
        .then(function() {
            //redirect to home page, maybe??
            window.location = "./index.html";
        }).catch(function(error) {
            //there was an error when logging out
            alert('An error occured when trying to log out');
        });
}

function inputInfo() {
    //input the information where it belongs
    if (user) {
        points = user.points;
        username = user.username;
        imgURL = user.imgURL;

        document.getElementById("username").innerHTML = username;

        document.getElementById("pts").innerHTML = points;
        document.getElementById("profPic").src = imgURL;
    } else {
        alert('You are not logged in!');
    }
}

window.onload = inputInfo;

function changePic(id) {
    if (user) {
        user.updateProfile({
            imgURL: "" + document.getElementById(id).src
        }).then(function() {
            //successful update
            imgURL = user.imgURL;
            document.getElementById("profPic").src = imgURL;
        }).catch(function(error) {
            alert('An error occured when updating');
        });
    } else {
        document.getElementById("profPic").src = document.getElementById(id).src;
    }
}

function changePass() {
    if (user) {
        firebase.auth().sendPasswordResetEmail(user.email).then(function() {
            //successfully sent email
        }).catch(function(error) {
            //there was an error when sending the email
        });
    } else {
        alert("You are not logged in");
    }
}