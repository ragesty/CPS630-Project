var user;
var points, username, imgURL;

window.onload = inputInfo;

function signOut(){
  // Sign out of Firebase.
  firebase.auth().signOut()
    .then(function(){
      //redirect to home page, maybe??
      if(typeof(Storage) !== "undefined"){
        //reset the session, so that the user's info isn't there anymore
        sessionStorage.user = "";
      }
      window.location = "./index.html";
    }).catch(function(error){
      //there was an error when logging out
      alert('An error occured when trying to log out');
    });
}

function inputInfo(){
  //input the information where it belongs
  if(typeof(Storage) !== "undefined"){
    if(sessionStorage.user){
      user = sessionStorage.user;
    }else{
      //this can probably get deleted later on
      alert('no session');
    }
}
  if(user){
    points = user.points;
    username = user.username;
    imgURL = user.photoURL;

    //document.getElementById("username").innerHTML = username;

    //document.getElementById("pts").innerHTML = points;

    //document.getElementById("profPic").src = imgURL;

    //once the database has been configured, this will be changed

    document.getElementById("username").innerHTML = "username";
    document.getElementById("pts").innerHTML = "points";
    document.getElementById("profPic").src = "http://i.imgur.com/YdhUZdZ.png";
  }else{
    alert('You are not logged in!');
  } 
}

function changePic(id){
  //this is currently under construction
  if(user){
    user.updateProfile({
      photoURL: "" + document.getElementById(id).src
    }).then(function(){
      //successful update
      imgURL = user.photoURL;
      document.getElementById("profPic").src = imgURL;
    }).catch(function(error){
      alert('An error occured when updating');
    });
  }else{
    //document.getElementById("profPic").src = document.getElementById(id).src;
    alert('You are not logged in!');
  }
}

function changePass(){
  //this too is under construction
  if(user){
    firebase.auth().sendPasswordResetEmail(user.email).then(function(){
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