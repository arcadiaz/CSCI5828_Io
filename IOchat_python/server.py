import requests

payload = {
            'most_frequent_emote': 'some emote',
            'most_frequent_phrase': 'some phrase',
            'top_5_emotes': ['one', 'two', 'three', 'four', 'five'],
            'text_summary': 'this is a brief summary of what happened'
            }
r = requests.post("http://localhost:3000/update", data=payload)
print(r.text)

