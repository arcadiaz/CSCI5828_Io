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
    now = datetime.datetime.utcnow()
    a = DB.retrieve_messages_time(username, '#' + channel, now, 1)
    top_emotes = Stats.get_top_emotes(a, secret.emote_list, 5)
    phrases, n = Stats.get_top_phrases(a, secret.emote_list, 3)
    featured = Stats.featured_msg(a, phrases)
    summary = Stats.get_summary(top_emotes, secret.translations)
    print(phrases, n)

    payload = {
        'most_frequent_emote': featured,
        'most_frequent_phrase': phrases,
        'top_5_emotes': top_emotes,
        'text_summary':  summary
    }
    return json.dumps(payload)
