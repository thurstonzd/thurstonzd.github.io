///////////////////////////////////////////////////////////////////////////////////
// constants
var DIGITS = "0123456789";
var ASCII_UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var ASCII_LOWER_CASE = ASCII_UPPER_CASE.toLocaleLowerCase();
var ASCII_LETTERS = ASCII_LOWER_CASE + ASCII_UPPER_CASE;

var ALLOWED_CHARACTER_SETS = [
    { 
        "caption": "Standard Allowed Characters",
        "characters": DIGITS + ASCII_LETTERS + "!#$@"
    },
    { 
        "caption": 'US Keyboard Characters',
        "characters": DIGITS + ASCII_LETTERS +
                "\`~!@#$%^&*()-_=+[]\\{}|;':\",./<>?"
    },
    {
        "caption": "Letters and Numbers Only",
        "characters": DIGITS + ASCII_LETTERS
    }
];

var PASSWORD_RULES = [
    {
        "caption": "Letters and Numbers Only",
        "rule":
            "(?=.*[A-Z]+.*)" +      // upper-case in string
            "(?=.*[a-z]+.*)" +      // lower-case in string
            "(?=.*[0-9].*)" +       // digit in string
            "^[A-Za-z]" +           // pw starts with letter
            ".*$"                   // pw ends with 7+ chars
    },
    {
        "caption": "Complex Password",
        "rule":
            "(?=.*[A-Z]+.*)" +      // upper-case in string
            "(?=.*[a-z]+.*)" +      // lower-case in string
            "(?=.*[0-9]+.*)" +      // digit in string
            "(?=.*[!#$@)]+.*)" +    // special character in string
            "^[A-Za-z]" +           // pw starts with letter
            ".*$"                   // password ends 
    }
];

let ALLOWED = "allowed";
let REQUIRED = "required";
let PROHIBITED = "prohibited";

let SELECT_OPTIONS = [ALLOWED, REQUIRED, PROHIBITED];

///////////////////////////////////////////////////////////////////////////////////
// event listener for loading available characters and password rules
window.addEventListener("load", function (evt) {
    let selects = document.querySelectorAll("select");
    selects.forEach((select) => {
        let opt = null; let txt = null;
        for (let i = 0; i < SELECT_OPTIONS.length; i++) {
            txt = document.createTextNode(SELECT_OPTIONS[i]);
            opt = document.createElement("option");
            opt.value = SELECT_OPTIONS[i];
            opt.appendChild(txt);
            select.appendChild(opt);
        }
    });
});

///////////////////////////////////////////////////////////////////////////////////
// event listener for generating password and clearing form
var el = document.getElementById("password_gen");
el.addEventListener("submit", function (evt) {
    evt.preventDefault();
    // var allowed = document.getElementById("available_chars").value;
    // var pattern = document.getElementById("password_reqs").value;
    // var passwordLength = document.getElementById("password_length").value;

    // var password = get_random_matching_string(pattern, allowed, passwordLength);

    // var password_div = document.getElementById("password");
    // password_div.innerHTML = password;

    

    return false;
});

el.addEventListener("reset", function (evt) {
    // don't prevent default behavior; just also clear password div
    document.getElementById("password").innerHTML = "";
});
///////////////////////////////////////////////////////////////////////////////////