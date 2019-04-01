var database = firebase.database();
var user = firebase.auth().currentUser;
var nickname, email, uid;

window.onload = function(){
    firebase.auth().onAuthStateChanged(function(usr){
        if(usr){
            var path_patt = /index.html/;
            if(window.location.pathname.match(path_patt)){
                window.location="loggedIn.html";
            }
            firebase.database().ref('users/' + usr.uid).on('value', function(snapshot) {
                //This is the way to fill in information straight away.
                document.getElementById("usr_nickname").innerText = "You're logged in as: " + snapshot.val().username;
            });

        }
    })
}
function signup_conf(){
    var usr_name = document.getElementById("s_name").value;
    var usr_email = document.getElementById("s_email").value;
    var usr_pass = document.getElementById("s_pwd").value;
    var usr_passcfmn = document.getElementById("s_pwdcfmn").value;
    if(usr_pass != usr_passcfmn){
        alert("Your passwords are not matching");
    } else{
        createUserAcc(usr_name, usr_email,usr_pass);
    }
}

function createUserAcc(usr_name, usr_email,usr_pass){
    firebase.auth().createUserWithEmailAndPassword(usr_email, usr_pass).catch(function(error) {
        alert(error.code + ": " + error.message);
        // ...
    });
    firebase.auth().onAuthStateChanged(function(usr){
        if(usr){
            firebase.database().ref('users/' + usr.uid).set({
                username: usr_name,
                points: 0,
                profile_picture: "http://i.imgur.com/YdhUZdZ.png"
            });
            firebase.auth().signOut().catch(function(error){
                alert(error.code + ": " + error.message);
            })
            $("signupModal").modal("toggle");
        }
    });
    
}

function signingIn(){
    //retrieved from the login Modal on the main page.
    var usr_email = document.getElementById("l_email").value;
    var usr_pwd = document.getElementById("l_pwd").value;
    firebase.auth().signInWithEmailAndPassword(usr_email, usr_pwd).then(function(usr){
        if(typeof(Storage) !== "undefined"){
            sessionStorage.userID = usr.uid;
        }
        window.location="loggedIn.html";
    },function(error){
        alert(error.code + "\n" + error.message);
    });
}

function signOut(){
    firebase.auth().signOut().then(function(){
        alert("You have successfully signed out!");
        sessionStorage.userID = null;
    }).catch(function(error){
        alert('you really fucked up here');
    });
}



function playNowLoggedOff(){
    alert("Please sign up to play!");
}




/******************************************** ORIGINAL CODE.
window.onload = function () {
    updateLogin();
}

function signup_conf(){
    var usr_email = document.getElementById("s_email").value;
    var usr_pass = document.getElementById("s_pwd").value;
    var usr_passcfmn = document.getElementById("s_pwdcfmn").value;
    if (usr_pass != usr_passcfmn){
        alert("Your passwords are not matching");
    } else{
        createUserAcc(usr_email,usr_pass);
    }
}

function createUserAcc(email, pass){
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(usr){
        signUpProcess();
    },function(error){
        alert("This is createUserAcc" + error.code + "\n" + error.message);
    });
}

function signingIn(){
    //retrieved from the login Modal on the main page.
    var usr_email = document.getElementById("l_email").value;
    var usr_pwd = document.getElementById("l_pwd").value;
    firebase.auth().signInWithEmailAndPassword(usr_email, usr_pwd).then(function(usr){
        updateLogin();
    },function(error){
        alert(error.code + "\n" + error.message);
    });
}

//super important function, figures out whether someone is logged in or not.
function updateLogin(){
    firebase.auth().onAuthStateChanged(function(usr){
    if(usr){
            document.getElementById("logged_out_nav").style.display="none";
            document.getElementById("logged_in_nav").style.display="inherit";
            document.getElementById("lo-home").style.display="none";
            document.getElementById("li-home").style.display="inherit";
        }else{
            document.getElementById("logged_in_nav").style.display="none";
            document.getElementById("logged_out_nav").style.display="inherit";
            document.getElementById("li-home").style.display="none";
            document.getElementById("lo-home").style.display="inherit";
        }
    })
}

function signOut(){
    firebase.auth().signOut().then(function(){
        updateLogin();
    }).catch(function(error){
        alert('you really fucked up here');
    });
}

function getNickName(){
    var rand = Math.floor(Math.random() * 10);
    firebase.database().ref('/placeholder_names/'+ rand).once('value').then(function(snapshot){
        nickname = (snapshot.val()) || 'Anonymous';
    })
    alert(nickname);
}

function writeNickName(){
    document.write(nickname);
}

*/