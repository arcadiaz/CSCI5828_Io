let db = require('./db_tools');
let options = require('./options');

//functions to calculate different statistics from the chat messages

let db_conn = db.establish_db_connection();

module.exports = {
    most_frequent_emote: function (interval, username, channel) {

    },

    most_frequent_phrase: function (interval, username, channel) {
        let result = db.retrieve_msg_body_only(db_conn, interval, username, channel);

    },

    top_5_emote: function () {

    },

    generate_text_summary: function () {
        
    }
};

let extract_emote = function (msg) {

};
