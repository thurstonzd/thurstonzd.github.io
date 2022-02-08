///////////////////////////////////////////////////////////////////////////////////
// constants
const DEFAULT_PASSWORD_LENGTH = 10;

const ASCII_UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// special characters that can be entered on standard US keyboard.
const US_KEYBOARD_SPECIAL_CHARACTERS = "\`~!@#$%^&*()-_=+[]\\{}|;':\",./<>?";

const UPPER_CASE_KEY = "upper_case";
const LOWER_CASE_KEY = "lower_case";
const DIGITS_KEY = "digits";
const SPECIAL_CHARACTERS_KEY = "special_characters_rule";

const CHARACTER_CLASSES = 
{
    [UPPER_CASE_KEY]: ASCII_UPPER_CASE,
    [LOWER_CASE_KEY]: ASCII_UPPER_CASE.toLocaleLowerCase(),
    [DIGITS_KEY]: "0123456789",
    [SPECIAL_CHARACTERS_KEY]: "!#$@"
}

let ALLOWED = "allowed";
let REQUIRED = "required";
let PROHIBITED = "prohibited";

let SELECT_OPTIONS = [ALLOWED, REQUIRED, PROHIBITED];

///////////////////////////////////////////////////////////////////////////////////
// initialize form
window.addEventListener("load", function (evt) {
    // populate SELECTs
    for (let k in CHARACTER_CLASSES) {
        let select = document.getElementById(k);
        let opt = null; let txt = null;
        for (let i = 0; i < SELECT_OPTIONS.length; i++) {
            txt = document.createTextNode(SELECT_OPTIONS[i]);
            opt = document.createElement("option");
            opt.value = SELECT_OPTIONS[i];
            opt.appendChild(txt);
            select.appendChild(opt);
        }
    }

    // populate default special characters
    let special_characters = document.getElementById("special_characters");
    special_characters.value = CHARACTER_CLASSES[SPECIAL_CHARACTERS_KEY];

    // default password length
    let password_length = document.getElementById("password_length");
    password_length.value = DEFAULT_PASSWORD_LENGTH;
});

///////////////////////////////////////////////////////////////////////////////////
// event listener for generating password and clearing form
var el = document.getElementById("password_gen");
el.addEventListener("submit", function (evt) {
    evt.preventDefault();

    let allowed_characters = "";
    let patterns = [];
    let lookahead = "";

    let selects = document.querySelectorAll("select");
    selects.forEach((select) => {
        // update allowed_characters
        if ([ALLOWED, REQUIRED].includes(select.value)) {
            if (select.id === SPECIAL_CHARACTERS_KEY) {
                let special_chars = document.getElementById("special_characters")
                allowed_characters += special_chars.value;
            }
            else allowed_characters += CHARACTER_CLASSES[select.id];
        }

        // update lookahead assertions based on PROHIBIT/REQUIRE rules.
        if ([REQUIRED, PROHIBITED].includes(select.value))
        {
            let chars = null, char_class = null;

            if (select.id === SPECIAL_CHARACTERS_KEY) {
                chars = document.getElementById("special_characters").value;
                char_class = `[${chars}]`;
            }
            else if (select.id === DIGITS_KEY) {
                char_class = '\\d'
            }
            else {
                chars = CHARACTER_CLASSES[select.id];
                // first and last element of character class string.
                char_class = `[${chars[0]}-${chars.slice(-1)}]`;
            }

            let comparator = (select.value === REQUIRED) ? "=" : "!";
            lookahead = `(?${comparator}.*${char_class}.*)`;
            console.log(lookahead);
            patterns.push(lookahead);
        }
    });

    // start of regex
    patterns.push("^");

    // does password need to start with a letter?
    let chkStartsWithLetter = document.getElementById("starts_with_letter");
    if (chkStartsWithLetter.checked) {
        patterns.push("[A-Za-z]");
    }

    patterns.push(".*$");

    console.log(allowed_characters);
    console.log(patterns.join(""));

    let password_length = document.getElementById("password_length").value;

    var password = get_random_matching_string(patterns.join(""), allowed_characters, password_length);

    var password_div = document.getElementById("password");
    password_div.innerHTML = password;

    return false;
});

el.addEventListener("reset", function (evt) {
    // don't prevent default behavior; just also clear password div
    document.getElementById("password").innerHTML = "";

    let selects = document.querySelectorAll("select");
    for (let i = 0; i < selects.length; i++) {
        selects[i].value = ALLOWED;
    }

    let password_length = document.getElementById("password_length");
    password_length.value = DEFAULT_PASSWORD_LENGTH;
});
///////////////////////////////////////////////////////////////////////////////////