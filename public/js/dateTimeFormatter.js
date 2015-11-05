/**
 * Created by USER on 05.11.2015.
 */
function addZero(str) {
    if (str.length == 1) {
        return "0" + str;
    } else {
        return str;
    }
}

module.exports = function(date) {
    var day = addZero(date.getDate().toString());
    var month = addZero((date.getMonth() + 1).toString());
    var year = addZero(date.getFullYear().toString());
    var seconds = addZero(date.getSeconds().toString());
    var minutes = addZero(date.getMinutes().toString());
    var hours = addZero(date.getHours().toString());

    return day + "." + month + "." + year + " " + hours + ":" + seconds;
};