import mysql.connector
from mysql.connector import errorcode
import secret
import pandas as pd


class Database:
    def __init__(self):
        pass

    def connect(self):
        try:
            self.conn = mysql.connector.connect(user=secret.db_username, password=secret.db_pass,
                                                host=secret.db_host,
                                                database=secret.db_dbname)
            self.cursor = self.conn.cursor(buffered=True)
            print('connection established')
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print("authentication error")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                print("Database does not exist")
            else:
                print(err)

    def retrieve_messages(self, username, channel, time_interval):
        self.connect()
        q = 'SELECT msg_body FROM messages WHERE username = %s AND ' \
            'channel = %s AND time_stamp >= NOW() - INTERVAL %s MINUTE;'
        data = (username, channel, time_interval)
        self.cursor.execute(q, data)
        return self.cursor.fetchall()

    def retrieve_messages_time(self, username, channel, start_time, time_interval):
        self.connect()
        q = 'SELECT msg_body FROM messages WHERE username = %s AND ' \
            'channel = %s AND time_stamp >= %s - INTERVAL %s MINUTE;'
        data = (username, channel, start_time, time_interval)
        self.cursor.execute(q, data)
        return self.cursor.fetchall()

    def __del__(self):
        self.conn.close()
        self.cursor.close()


class Stats:
    @staticmethod
    def get_top_emotes(message_list, emote_list, top_n):
        df = pd.DataFrame(message_list, columns=['msg_body'])
        for emote in emote_list:
            df[emote] = df.msg_body.astype(str).apply(lambda x: x.split().count(emote))
        df = df.drop(columns=['msg_body'])
        # get the count of each emote
        df = df.sum().sort_values(ascending=False)
        # normalize the series
        df /= df.sum()
        # return the top n as a list
        return [emote[0] for emote in df[:top_n].iteritems()]

    @staticmethod
    def get_top_phrases(message_list, emote_list, top_n):
        # TODO
        pass

