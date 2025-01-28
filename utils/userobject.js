const moment = require('moment');

function createobj(username, text){
    return {
        username,
        text,
        time: moment().format('hh:mm a')
    };
}
module.exports = createobj