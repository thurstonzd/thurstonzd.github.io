///////////////////////////////////////////////////////////////////////////////////
// constants
var DIGITS = "0123456789";
var ASCII_UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var ASCII_LOWER_CASE = ASCII_UPPER_CASE.toLocaleLowerCase();
var ASCII_LETTERS = ASCII_LOWER_CASE + ASCII_UPPER_CASE;

var ALLOWED_CHARACTER_SETS = [
    { "caption": "Standard Allowed Characters"
        , "characters": DIGITS + ASCII_LETTERS + "!#$@"
    }
    , { "caption": 'US Keyboard Characters'
        , "characters": DIGITS + ASCII_LETTERS
                        + "\`~!@#$%^&*()-_=+[]\\{}|;':\",./<>?"
    }
];

var PASSWORD_RULES = [
    {
        "caption": "Letters and Numbers Only",
        "rule":
            "(?=.*[A-Z]+.*)" +      // upper-case in string
            "(?=.*[a-z]+.*)" +      // lower-case in string
            "(?=.*[0-9].*)" +       // digit in string
            "^[A-Za-z]{1}" +        // pw starts with letter
            "[A-Za-z0-9]{7,}$"      // pw ends with 7+ alphanumeric chars
    },
    {
        "caption": "Complex Password",
        "rule":
            "(?=.*[A-Z]+.*)" +      // upper-case in string
            "(?=.*[a-z]+.*)" +      // lower-case in string
            "(?=.*[0-9]+.*)" +      // digit in string
            "(?=.*[!#$@)]+.*)" +    // special character in string
            "^[A-Za-z]{1}" +        // pw starts with letter
            "[A-Za-z0-9!#$@]{7,}$"  // password ends with 7+ alphanumeric chars
    }
];

///////////////////////////////////////////////////////////////////////////////////
// event listener for loading available characters and password rules
window.addEventListener("load", function (evt) {
    var allowedDataList = document.getElementById("available_chars_list");
    var allowedCharacterEntries = ALLOWED_CHARACTER_SETS;
    var allowedCharactersTextBox = document.getElementById("available_chars");
    var maxLength = 0;

    for (var i = 0; i < allowedCharacterEntries.length; i++) {
        var entry = allowedCharacterEntries[i];

        var chars = entry["characters"];
        if (chars.length > maxLength) { maxLength = chars.length; }

        var caption = entry["caption"];

        var textNode = document.createTextNode(caption);
        var option = document.createElement("option");
        option.setAttribute("value", chars);
        option.appendChild(textNode);
        allowedDataList.appendChild(option);
    }
    allowedCharactersTextBox.size = maxLength;

    var rulesDataList = document.getElementById("password_reqs_list");
    var rulesEntries = PASSWORD_RULES;
    var rulesTextBox = document.getElementById("password_reqs");
    var maxLength = 0;

    for (var i = 0; i < rulesEntries.length; i++) {
        var entry = rulesEntries[i];

        var rule = entry["rule"];
        if (rule.length > maxLength) { maxLength = rule.length; }
        var caption = entry["caption"];

        var textNode = document.createTextNode(caption);
        var option = document.createElement("option");
        option.setAttribute("value", rule);
        option.appendChild(textNode);
        rulesDataList.appendChild(option);
    }
    rulesTextBox.size = maxLength;
});

///////////////////////////////////////////////////////////////////////////////////
// event listener for generating password and clearing form
var el = document.getElementById("password_gen");
el.addEventListener("submit", function (evt) {
    evt.preventDefault();
    var allowed = document.getElementById("available_chars").value;
    var pattern = document.getElementById("password_reqs").value;
    var passwordLength = document.getElementById("password_length").value;

    var password = get_random_matching_string(pattern, allowed, passwordLength);

    var password_div = document.getElementById("password");
    password_div.innerHTML = password;

    return false;
});

el.addEventListener("reset", function (evt) {
    // don't prevent default behavior; just also clear password div
    document.getElementById("password").innerHTML = "";
});
///////////////////////////////////////////////////////////////////////////////////