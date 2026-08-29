import os
import json
import requests
import datetime
from discord_webhook import DiscordWebhook, DiscordEmbed
import time

MISSING_LIVERIES_WEBHOOK = os.environ["MISSING_LIVERIES_WEBHOOK"]


with open(".filecheck/commit.txt", "r") as file:
    commit_id = file.read().strip()
    print(commit_id)

new_json =  json.loads(requests.get("https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/refs/heads/main/livery.json").content)
old_json = json.loads(requests.get(f"https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/{commit_id}/livery.json").content)
keys = new_json["aircrafts"].keys()

addition = []
for plane in keys:
    try: # skip aircraft with no liveries
        new_json["aircrafts"][plane]["liveries"]
    except KeyError:
        continue
    for livery in new_json["aircrafts"][plane]["liveries"]:
        try: 
            if not livery in old_json["aircrafts"][plane]["liveries"]:
                addition.append(livery)
        except KeyError:
            addition.append(livery)

webhook = DiscordWebhook(url=MISSING_LIVERIES_WEBHOOK)
embed = DiscordEmbed(color="DC143C", title=f"Livery check at {datetime.datetime.now()}")
webhook.add_embed(embed)
webhook.execute()

checked_links = []
missing_count = 0
for livery in addition:
    for link in livery["texture"]:
        if isinstance(link, str) and link.startswith('https://cdn.jsdelivr.net/gh/kolos26/GEOFS-LiverySelector@main/') and not link in checked_links:
            checked_links.append(link)
            if not os.path.exists(link.replace("https://cdn.jsdelivr.net/gh/kolos26/GEOFS-LiverySelector@main/", "")):
                missing_count += 1
                webhook = DiscordWebhook(url=MISSING_LIVERIES_WEBHOOK)
                embed = DiscordEmbed(color="DC143C", description=link)
                webhook.add_embed(embed)
                time.sleep(0.5)
                webhook.execute()

webhook = DiscordWebhook(url=MISSING_LIVERIES_WEBHOOK)
embed = DiscordEmbed(color="DC143C", title=f"Found {missing_count} missing files")
webhook.add_embed(embed)
webhook.execute()