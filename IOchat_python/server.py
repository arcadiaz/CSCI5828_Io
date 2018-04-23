import requests

payload = {'Emotes': 500}
r = requests.post("http://localhost:3000/update", data=payload)
print(r.text)

