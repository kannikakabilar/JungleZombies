class LoginForm extends React.Component {
		    constructor(props){
			    super(props);
				this.state = {userid: '', pswd: ''};
				this.handleChange = this.handleChange.bind(this);
				this.handleSubmit = this.handleSubmit.bind(this);
			}
			
			handleChange(event){
			    this.setState({userid: event.target.userid, pswd: event.target.pswd});
			}
			
			handleSubmit(event){
			    var username = this.state.userid;
				var pswd = this.state.pswd;
				//need to call the enter function with the current username and password
			}
			
			render(){
			    return(
				<form onSubmit={this.handleSubmit}>
				UserName: <input type="text" value={this.state.userid} onChange={this.handleChange} /> </br>
				Password: <input type="password" value={this.state.pswd} onChange={this.handleChange} />
				<input type="submit" value="Submit" />
				</form>
				);
			}
		}
class RegisterForm extends React.Component {
		    constructor(props){
			    super(props);
				this.state = {newuserid: '', newpswd: ''};
				this.handleChange = this.handleChange.bind(this);
				this.handleSubmit = this.handleSubmit.bind(this);
			}
			
			handleChange(event){
			    this.setState({newuserid: event.target.userid, newpswd: event.target.pswd});
			}
			
			handleSubmit(event){
			    var username = this.state.userid;
				var pswd = this.state.pswd;
				//need to call the register function with the new username and password
			}
			
			render(){
			    return(
				<div id="ui_register">
			<center>
			Username:<input type="text" value={this.state.newuserid} id="newuser" placeholder="User Name" />
			Password:<input type="password" value={this.state.newpswd} id="newpassword" placeholder="Password" /></br>
			</br>Gender:
			<input type="radio" id="Male" name="gender" value="Male" checked> <label for="Male">Male</label>
			<input type="radio" id="Female" name="gender" value="Female"> <label for="Female">Female</label>
			<input type="radio" id="Other" name="gender" value="Other"> <label for="Other">Other</label>
			</br>
			</br>Skill level: <select id="skill">
			<option value="Beginner">Beginner</option>
			<option value="Intermediate">Intermediate</option>
			<option value="Expert">Expert</option>
			</select></br></br>
			Playtimes:
			<input type="checkbox" name="time" value="Morning">
			<label for="Morning"> Morning</label>
			<input type="checkbox" name="time" value="Afternoon">
			<label for="Afternoon"> Afternoon</label>
			<input type="checkbox" name="time" value="Night" checked>
			<label for="Night"> Night</label></br></br>
			<div id=badLogin></div>
		</center>
		</div>
				);
			}
		}
function enter() {
        $.ajax({
                method: "GET",
                url: "/api/enter/username/" + $("#user").val() + "/password/" + $("#password").val() + "/"
        }).done(function (data) {
                console.log(data);
                if ("Login Successful" == data) {
                        $("#ui_login").hide();
                        $("#ui_menu").show();
                        $("#canvas").show();
                        document.getElementById("subtitle").innerHTML = "Game";
                        setupGame(); 
                        startGame();
                } else {
                        $("#loginfail").innerHTML = "Incorrect Username or Password";
                }
        });
}

function check(){
        var emp = $("#user").val();
        var pswd = $("#password").val();
        if((!emp) && pswd){
                $("#loginfail").innerHTML = "Please enter your Username";
        }else if((!pswd) && emp){
                $("#loginfail").innerHTML = "Please enter your Password";
        }else if((!emp) && (!pswd)){
                $("#loginfail").innerHTML = "Please enter your Username and Password";
        }else{
                enter();
        }
}

function logout() {
        $.ajax({
                method: "GET",
                url: "/api/logout/"
        }).done(function (data) {
                console.log(data);
                if(data == "Logout"){
                $("#ui_menu").hide();
                document.getElementById("subtitle").innerHTML = "";
                $("#update").hide();
                $("#ui_register").hide();
                $("#signup").hide();
                $("#canvas").hide();
                $("#scores").hide();
                $("#ui_login").show();
                }
        });
}

function login() {
        // Normally would check the server to see if the credentials checkout
        $.ajax({
                method: "GET",
                url: "/api/login/" + $("#user").val() + "/password/" + $("#password").val()
        }).done(function (data) {
                console.log(data);
                if ("Login successful" == data) {
                        $("#ui_login").hide();
                        $("#ui_menu").show();
                        $("#canvas").show();
                } else if ("Login failed" == data) {
                        $("#loginfail").innerHTML = "Incorrect Username or Password";
                }
        });
}

function profile() {
        $.ajax({
                method: "GET",
                url: "/api/profile/"
        }).done(function (data) {
                console.log(data);
                $("#ui_menu").show();
                $("#ui_register").show();
                $("#update").show();
                $("#canvas").hide();
                $("#scores").hide();
                $("#ui_login").hide();
                $("#newuser").value = $("#user").val();
                document.getElementById("subtitle").innerHTML = "Profile";
                pauseGame();
        });
}

function scores() {
        $.ajax({
                method: "GET",
                url: "/api/score/"
        }).done(function (data) {
                // console.log(data);
                // console.log(data["TopPlayers"]);
                $("#ui_menu").show();
                $("#scores").show();
                $("#update").hide();
                $("#ui_register").hide();
                $("#signup").hide();
                $("#canvas").hide();
                $("#ui_login").hide();
                document.getElementById("subtitle").innerHTML = "High Scores";
                var topScores = "";
                for (i = 0; i < data["TopPlayers"].length; i++) {
                        topScores += "<br/> Player " + data["TopPlayers"][i].userName + " has the score of: " + data["TopPlayers"][i].score;
                }
                document.getElementById("topScores").innerHTML = topScores;
                pauseGame();

        });
}

function del(){
        $.ajax({
                method: "GET",
                url: "/api/delete/user/" + $("#user").val() + "/password/" + $("#password").val() + "/"
        }).done(function (data) {
                console.log(data);

                $("#ui_login").show();
                $("#ui_menu").hide();
                $("#ui_register").hide();
                $("#update").hide();
                document.getElementById("scores").innerHTML = "";

        });
}

function validateUpdate() {
        var newuser = $("#newuser").val();
        var newpswd = $("#newpassword").val();
        
        if(!newuser && !newpswd){
                document.getElementById("updfail").innerHTML = "Please enter a Username and Password!";
        }else if(!newuser){
                document.getElementById("updfail").innerHTML = "Please enter a Username";
        }else if(!newpswd){
                document.getElementById("updfail").innerHTML = "Please enter a Password";
        
        }else{
                document.getElementById("updfail").innerHTML = "Update Successful";
		signup();
        }
}


function validateRegistration() {
        var newuser = $("#newuser").val();
        var newpswd = $("#newpassword").val();
        var checkboxVal = "";
        $("input[type='checkbox']").each(function () {
                var ischecked = $(this).is(":checked");
                if (ischecked) {
                        checkboxVal += $(this).val() + ";";
                }
        });
        if(!newuser && !newpswd){
                $("#regfail").innerHTML = "Please enter a Username and Password!";
        }else if(!newuser){
                $("#regfail").innerHTML = "Please enter a Username";
        }else if(!newpswd){
                $("#regfail").innerHTML = "Please enter a Password";
        // }else if(!checkboxVal){
        //         document.getElementById("regfail").innerHTML = "Please select at least one Playtime";
        // }
        }else{
                signup();
        }
}

function signup() {
        var checkboxVal = "";
        var usernameExists = false;
        $("input[type='checkbox']").each(function () {
                var ischecked = $(this).is(":checked");
                if (ischecked) {
                        checkboxVal += $(this).val() + ";";
                }
        });
        if(checkboxVal == ""){
                checkboxVal = ";";
        }
        $.ajax({
                method: "GET",
                url: "/api/signup/" + $("#newuser").val(),
                data: {
                        username: $("#newuser").val(),
                        newpassword: $("#newpassword").val(),
                        gender: $("input[name='gender']:checked").val(),
                        skill: $("#skill option:selected").text(),
                        time: checkboxVal
                }
        }).done(function (data) {
                console.log(data);
                console.log(JSON.stringify(data));
                if ("err" in data) {
                        console.log(data["err"]);
                        usernameExists = true;
                } else if (data) {
                        if (data['msg'] == "New Account") {
                                usernameExists = false;
                        } else {
                                usernameExists = true;
                                $("#badLogin").innerHTML = "Error:This account already exists";
                        }
                        if (!usernameExists) {
                                console.log("username DNE");
                                $.ajax({
                                        method: "POST",
                                        url: "/api/signup/" + $("#newuser").val(),
                                        data: {
                                                username: $("#newuser").val(),
                                                newpassword: $("#newpassword").val(),
                                                gender: $("input[name='gender']:checked").val(),
                                                skill: $("#skill option:selected").text(),
                                                time: checkboxVal
                                        }
                                }).done(function (data) {
                                        console.log(JSON.stringify(data));
                                        if ("err" in data) {
                                                console.log(data["err"]);
                                        }else{
                                                $("#ui_menu").hide();
                                                $("#update").hide();
                                                $("#ui_register").hide();
                                                $("#canvas").hide();
                                                $("#signup").hide();
                                                $("#scores").hide();
                                                $("#ui_login").show()
                                        }
                                });
                        } else {
                                console.log(JSON.stringify(data["err"]));
                        }
                }
        });
        
}

function register() {
        $.ajax({
                method: "GET",
                url: "/api/register/"
        }).done(function (data) {
                console.log(JSON.stringify(data));
                if ("Register" == data) {
                        $("#ui_login").hide();
                        $("#ui_register").show();
                        $("#signup").show();
                }
        });
}

function updateScore(){
        $.ajax({
                method: "POST",
                url: "/api/score/username/"+$("#user").val()+"/newscore/"+$("#gameScore").text()+"/",
        }).done(function (data, text_status, jqXHR) {
                console.log(JSON.stringify(data));
                console.log(text_status);
                console.log(jqXHR.status);
        }).fail(function (err) {
                console.log(err.status);
                console.log(JSON.stringify(err.responseJSON));
        });
}

function loadGame(){
        $("#ui_menu").show();
        $("#update").hide();
        $("#ui_register").hide();
        $("#canvas").show();
        $("#signup").hide();
        $("#scores").hide();
        $("#ui_login").hide();
        document.getElementById("subtitle").innerHTML = "Game";
}

// This is executed when the document is ready (the DOM for this document is loaded)
$(function () {
        // Setup all events here and display the appropriate UI
        $("#loginSubmit").on('click', function () { check(); });
        $("#registerSubmit").on('click', function () { register(); });
        $("#profileSubmit").on('click', function () { profile(); });
        $("#scoreSubmit").on('click', function () { scores(); });
        $("#logoutSubmit").on('click', function () { logout(); });
        $("#gameSubmit").on('click', function () { loadGame(); });
        $("#signupSubmit").on('click', function () { validateRegistration(); });
	$("#updateSubmit").on('click', function () { validateUpdate(); });
	$("#deleteSubmit").on('click', function () { del(); });
        $("#ui_login").show();
        $("#ui_counter").hide();
        $("#ui_register").hide();
        $("#ui_menu").hide();
        $("#update").hide();
        $("#signup").hide();
        $("#canvas").hide();
        $("#scores").hide();
});


