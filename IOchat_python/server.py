import requests
from tools import Database, Stats
import secret

# payload = {
#             'most_frequent_emote': 'some emote',
#             'most_frequent_phrase': 'some phrase',
#             'top_5_emotes': ['one', 'two', 'three', 'four', 'five'],
#             'text_summary': 'this is a brief summary of what happened'
#             }
# r = requests.post("http://localhost:3000/update", data=payload)
# print(r.text)

DB = Database()
# a = DB.retrieve_messages_time('test', '#test', '2018-04-23 00:00:37', 5)
# print(Stats.get_top_emotes(a, ['hi', 'are', 'you'], 2))
