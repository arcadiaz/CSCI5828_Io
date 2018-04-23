const mysql = require('mysql');
const db_options = require('./options');

module.exports = {
    insert_msg: function (db_connection, msg, username, channel) {
        msg = msg.replace("'", "\\'"); //escaping single quotes '
        return new Promise((resolve, reject) => {
            // converting js timestamp to mysql timestamp https://stackoverflow.com/a/11150727
            let date = create_sql_timestamp(new Date());
            let sql = "INSERT INTO `messages` (`msg_body`, `time_stamp`, `username`, `channel`) VALUES ('" + msg + "', '" +date + "', '" + username +"', '" + channel  + "'); ";
            db_connection.query(sql, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
            });
        });
    },

    retrieve_msgs: function (db_connection, time_interval, username, channel) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM `messages` WHERE username='" + username + "' AND channel='" + channel+"' AND time_stamp >= NOW() - INTERVAL " + time_interval + " MINUTE;";
            console.log(sql);
            db_connection.query(sql, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
            });
        });

    },

    establish_db_connection: function(){
        let db_con = mysql.createConnection({
            host: db_options.db_config.host,
            user: db_options.db_config.user,
            password: db_options.db_config.password,
            database: db_options.db_config.database
        });
        db_con.connect(function(err) {
            if (err) throw err;
            db_con.query("SET NAMES 'utf8mb4'", function (err, result, fields) {
                if (err) throw err;
                console.log("successfully connected");
            });
        });
        return db_con;
    },

    retrieve_msg_body_only: function (db_connection, time_interval, username, channel) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT msg_body FROM `messages` WHERE username='" + username + "' AND channel='" + channel+"' AND time_stamp >= NOW() - INTERVAL " + time_interval + " MINUTE;";
            console.log(sql);
            db_connection.query(sql, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
};

function create_sql_timestamp (date) {
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);

    return date;
}

