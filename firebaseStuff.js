var database = firebase.database();
var userID;
var points, username, profile_picture;

window.onload = inputInfo;

function signOut() {
    firebase.auth().signOut().then(function() {
        alert("You have successfully signed out!");
        localStorage.removeItem("username");
        window.location = "index.html";
    }).catch(function(error) {
        alert('you really fucked up here');
    });
}

function inputInfo(){
  //input the information where it belongs
  if(typeof(Storage) !== "undefined"){
    if(sessionStorage.userID){
      userID = sessionStorage.userID;
    }else{
      alert('You are not logged in!');
    }
  }

  if(userID){
    database.ref('users/' + userID)
      .once("value")
        .then(function(snapshot){
          points = snapshot.val().points;
          username = snapshot.val().username;
          profile_picture = snapshot.val().profile_picture;

          document.getElementById("username").innerHTML = username;
          document.getElementById("pts").innerHTML = points;
          document.getElementById("profPic").src = profile_picture;
        }
      );
  }else{
    alert('You are not logged in!');
  } 
}

function changePic(id){
  if(userID){
    var newPic = document.getElementById(id).src;
    database.ref("users/" + userID + "/profile_picture").set(newPic);
    inputInfo();
  }else{
    alert('You are not logged in!');
  }
}

function changePass(){
  //this too is under construction
  if(userID){
    firebase.auth().sendPasswordResetEmail(userID.email).then(function(){
      //successfully sent email
      alert('Email sent successfully!');
    }).catch(function(error){
      //there was an error when sending the email
      alert('There was a problem in sending the email');
    });
  }else{
    alert("You are not logged in");
  }
}