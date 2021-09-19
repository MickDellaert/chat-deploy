const moment = require('moment');

function formatMessage(id, username, text) {

    return {
        id,
        username,
        text,
        time: moment().format('HH:mm')
    }
}

module.exports = formatMessage;