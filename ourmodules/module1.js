const moment= require('moment');          //moment library is used to get current time

function defaultmsg(username, text){
    return{
        username,
        time: moment().format('h:mm a'), //hours minutes am/pm
        text,
    };
}

module.exports = defaultmsg;
