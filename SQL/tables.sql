USE msg;

CREATE TABLE IF NOT EXISTS messages (
id int NOT NULL AUTO_INCREMENT,
msg_body text,
time_stamp datetime,
username text,
channel text,
PRIMARY KEY(id)
);


INSERT INTO messages (msg_body, time_stamp, username, channel) VALUES ('test msg', '2010-12-31 23:59:59', 'test_user', 'test_channel');