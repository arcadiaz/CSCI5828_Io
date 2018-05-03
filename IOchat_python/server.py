import requests
from tools import Database, Stats
import secret
from flask import Flask
from flask_cors import CORS, cross_origin
import json 
import datetime

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


	DB = Database()
	now = datetime.datetime.now().strftime("%Y-%m-%d  %H:%M:%S")
	a = DB.retrieve_messages_time(username, '#' + channel, now, 5000) 
	top_emotes = Stats.get_top_emotes(a, ['hi', 'are', 'you'], 2)
	phrases, n = Stats.get_top_phrases(a, ['no'], 5)
	print(phrases, n)

	payload = {
            'most_frequent_emote': top_emotes[0],
            'most_frequent_phrase': phrases,
            'top_5_emotes': top_emotes,
            'text_summary': 'this is a brief summary of what happened for ' + username + ' ' + channel
            }
	return json.dumps(payload)

