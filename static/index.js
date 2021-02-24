profile_text = document.getElementById("profile_text");
login_text = document.getElementById("login_text");
register_text = document.getElementById("register_text");

login_button = document.getElementById("login_button");
logout_button = document.getElementById("logout_button");
register_button = document.getElementById("register_button");
test_button = document.getElementById("test_button");

xmlHttp = new XMLHttpRequest();

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function passwordIsValid(password) {

    var non_ascii_chars = /[^\u0000-\u007f]/;
    if (non_ascii_chars.test(password)) {
        return false
    }

    return (/[A-Z]/.test(password) ||
        /[a-z]/.test(password) ||
        /[0-9]/.test(password)) &&
        password.length > 7;

}

window.onload = function () {
    try {
        username = localStorage.getItem("username");
        password = localStorage.getItem("password");

        if (username == null || password == null) {
            document.getElementById("login_form").style.display = "flex";
            document.getElementById("register_form").style.display = "flex";
            throw 'no login detected';
        }

        xmlHttp.open("GET", `/me`, true);
        xmlHttp.setRequestHeader('accept', 'application/json');
        xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        xmlHttp.send();

        xmlHttp.onreadystatechange = function () {

            switch (xmlHttp.status) {
                case 200:
                    try {
                        username = JSON.parse(xmlHttp.responseText)["username"]
                        profile_text.innerHTML = `You logged in as ${username}`;
                        document.getElementById("profile_info").style.display = "flex";
                        document.getElementById("login_form").style.display = "none";
                        document.getElementById("register_form").style.display = "none";
                    } catch (e) {
                        profile_text.innerHTML = "Response is not a valid JSON"
                    }
                    break;
                case 418:
                    document.getElementById("login_form").style.display = "flex";
                    document.getElementById("register_form").style.display = "flex";
                    login_text.innerHTML = "Credentials are invalid!";
                    break;
                default:
                    document.getElementById("login_form").style.display = "flex";
                    document.getElementById("register_form").style.display = "flex";
                    login_text.innerHTML = "Something went wrong :("
            }
        }
    } catch (e) {
        console.log(e)
    }
}

logout_button.onclick = function () {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    location.reload();
}

login_button.onclick = function () {
    var username = document.getElementById("email1").value
    var password = document.getElementById("password1").value

    if (!emailIsValid(username)) {
        login_text.innerHTML = "Email is not valid!"
        return
    }

    if (!passwordIsValid(password)) {
        login_text.innerHTML = "Password is not valid! Must be A-Z,a-z,0-9 and minimum 8 symbols"
        return
    }

    xmlHttp.open("GET", `/me`, true);
    xmlHttp.setRequestHeader('accept', 'application/json');
    xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    xmlHttp.send();
    xmlHttp.onreadystatechange = function () {

        if (this.readyState == 4) {
            switch (xmlHttp.status) {
                case 200:
                    console.log('q')
                    username = JSON.parse(xmlHttp.responseText)["username"]
                    login_text.innerHTML = `You logged in as ${username}`;
                    localStorage.setItem("username", username);
                    localStorage.setItem("password", password);
                    location.reload();
                    break;
                case 418:
                    login_text.innerHTML = "Invalid login or password!";
                    break;
                default:
                    login_text.innerHTML = "Something went wrong :("
            }
        }
    };
};

register_button.onclick = function () {
    username = document.getElementById("email2").value
    password = document.getElementById("password2").value
    r_password = document.getElementById("password3").value

    if (!emailIsValid(username)) {
        register_text.innerHTML = "Email is not valid!"
        return
    }

    if (!passwordIsValid(password)) {
        register_text.innerHTML = "Password is not valid! Must be A-Z,a-z,0-9 and minimum 8 symbols"
        return
    }

    if (password !== r_password) {
        register_text.innerHTML = "Passwords are not equal! Please, try again"
        return
    }

    xmlHttp.open("GET", `/register`, true);
    xmlHttp.setRequestHeader('accept', 'application/json');
    xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    xmlHttp.send();
    xmlHttp.onreadystatechange = function () {

        switch (xmlHttp.status) {
            case 200:
                username = JSON.parse(xmlHttp.responseText)["username"]
                register_text.innerHTML = `You registered as ${username}! You can login now`;
                break;
            case 419:
                register_text.innerHTML = "This user already exists!";
                break;
            default:
                register_text.innerHTML = "Something went wrong :("
        }
    };
};