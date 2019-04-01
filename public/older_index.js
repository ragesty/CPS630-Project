var database = firebase.database();
var user = firebase.auth().currentUser;
var nickname, email, uid;

function signup_conf(){
    var usr_email = document.getElementById("s_email").value;
    var usr_pass = document.getElementById("s_pwd").value;
    var usr_passcfmn = document.getElementById("s_pwdcfmn").value;
    if(usr_pass != usr_passcfmn){
        alert("Your passwords are not matching");
    } else{
        createUserAcc(usr_email,usr_pass);
    }
}

function createUserAcc(usr_email,usr_pass){
    firebase.auth().createUserWithEmailAndPassword(usr_email, usr_pass).catch(function(error) {
        alert(error.code + ": " + error.message);
        // ...
    });
    alert("sign up successful");
    
    firebase.auth().onAuthStateChanged(function(usr){
        if(usr){
            alert("log in successful, uid:" + usr.uid);
        }
    })
    var id= Math.floor(Math.random() * 100);
    firebase.database().ref('users/' + id).set({
        username: usr_email,
        pass : usr_pass
    });
    
}

function signOut(){
    alert("signing out");
}

function signingIn(){
    alert("signing in");
}

function writeNickName(){
    firebase.database().ref('/users/37').once('value').then(function(snapshot) {
        alert(snapshot.val().username);
    })
    
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