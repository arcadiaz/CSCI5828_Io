import requests
# from tools import Database, Stats
# import secret
from flask import Flask
from flask_cors import CORS, cross_origin
import json 

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'



''' instructions for running flask app 
$ export FLASK_APP=server.py
$ python -m flask run
 * Running on http://127.0.0.1:5000/
'''

@app.route('/getStats/<username>/<channel>', methods=['GET'])
@cross_origin()
def get_stats(username=None, channel=None):
	print(username, channel)
	payload = {
            'most_frequent_emote': 'some emote',
            'most_frequent_phrase': 'some phrase',
            'top_5_emotes': ['one', 'two', 'three', 'four', 'five'],
            'text_summary': 'this is a brief summary of what happened for ' + username + ' ' + channel
            }
	return json.dumps(payload)
# DB = Database()
# a = DB.retrieve_messages_time('arcadiiaaa', '#aaroniidx', '2018-04-23 21:12:37', 5000)
# print(Stats.get_top_emotes(a, ['hi', 'are', 'you'], 2))
# phrases, n = Stats.get_top_phrases(a, ['no'], 5)
# print(phrases, n)
