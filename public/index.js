var database = firebase.database();
var user = firebase.auth().currentUser;
var nickname, email, uid;


window.onload = function () {
    updateLogin();
}

//Essentially just signup confirmation.
function signup_conf(){
    //retrieved from the modal signup fields.
    var usr_email = document.getElementById("s_email").value;
    var usr_pass = document.getElementById("s_pwd").value;
    var usr_passcfmn = document.getElementById("s_pwdcfmn").value;
    //RegExp for the email pattern, essentially it needs @ and .
    var email_patt = /[@][\D]+[.][\D]+/g;
    if (!usr_email.match(email_patt)){
        alert("your email address is not valid");
    } else if (usr_pass != usr_passcfmn){
        alert("Your passwords are not matching");
    } else{
        //anything else not covered in making a proper account will be covered by firebase.
        createUserAcc(usr_email,usr_pass);
    }
}

//Self explanatory name.
function createUserAcc(email, pass){
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(usr){
        alert("You have successfully signed up");
    },function(error){
        alert("This is createUserAcc" + error.code + "\n" + error.message);
    });
    $('#myModal').modal("hide");
}

function fillUserAcc(){
    //Creates the profile, currently only contains the username and the profile picture path.
    firebase.database().ref('Profiles/' + user.uid).set({
        username: player,
        profile_picture: null
    });
    //Creates the points with the userID as the key.
    firebase.database().ref('Points/' + user.uid).set({
        points: 0
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
            uid = usr.uid;
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
    document.write("test");
}