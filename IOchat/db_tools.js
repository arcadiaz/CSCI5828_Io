const mysql = require('mysql');
const db_options = require('./options');

module.exports = {
    insert_msg: function (db_connection, msg, username, channel, time) {
        msg = msg.replace("'", "\\'"); //escaping single quotes '
        return new Promise((resolve, reject) => {
            // converting js timestamp to mysql timestamp https://stackoverflow.com/a/11150727
            let date = create_sql_timestamp();
            let sql = "INSERT INTO `messages` (`msg_body`, `times_tamp`, `username`, `channel`) VALUES ('" + msg + "', '" +date + "', '" + nick +"', '" + channel  + "'); ";
            db_con.query(sql, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
            });
        });
    },

    //how to return result from this function
    retrieve_msgs: function (db_connection, time_interval, username, channel) {
        let sql = "SELECT * FROM `messages` WHERE username='" + username + "' AND channel='#" + channel+"' AND time_stamp >= NOW() - INTERVAL " + time_interval + " MINUTE;";
        console.log(sql);
        db_connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.status(200).json(result);
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
                console.log(result);
            });
        });
        return db_con;
    }
};

function create_sql_timestamp () {
    let date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);

    return date;
}