var is_password_valid = function (regex_pattern, password) {
    var re = new RegExp(regex_pattern);
    return re.test(password);
}

var get_random_string = function (available_chars, string_length) {
    a = [];
    for (var i = 0; i < string_length; i++) {
        var pos = Math.floor(Math.random() * available_chars.length);
        var ch = available_chars[pos];
        a.push(ch);
    }
    return a.join("");
}

var get_random_matching_string = function (regex_pattern, allowed_chars, string_length) {
    var s = get_random_string(allowed_chars, string_length);
    while (!is_password_valid(regex_pattern, s)) {
        var s = get_random_string(allowed_chars, string_length);
    }

    return s;
}