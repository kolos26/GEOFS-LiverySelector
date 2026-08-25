import requests
import json
import os
import datetime
from discord_webhook import DiscordWebhook, DiscordEmbed

LIVERY_UPDATE_WEBHOOK = os.environ["LIVERY_UPDATE_WEBHOOK"]

with open(".webhook/commit.txt", "r") as file:
    commit_id = file.read().strip()
    print(commit_id)

new_json =  json.loads(requests.get("https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/refs/heads/main/livery.json").content)
old_json = json.loads(requests.get(f"https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/{commit_id}/livery.json").content)
keys = new_json["aircrafts"].keys()

diff_data = []
total_count = 0
for plane in keys:
    addition = []
    for livery in new_json["aircrafts"][plane]["liveries"]:
        try: 
            if not livery in old_json["aircrafts"][plane]["liveries"]:
                addition.append(livery)
        except KeyError:
            addition.append(livery)
    try:
        data = {"name": new_json["aircrafts"][plane]["name"], "addition": addition, "liv_count": len(new_json["aircrafts"][plane]["liveries"])}
    except KeyError:
        data = {"name": plane, "addition": addition}
    if addition:
        diff_data.append(data)
    total_count += len(new_json["aircrafts"][plane]["liveries"])


print(diff_data)

total = 0

if diff_data:
    webhook = DiscordWebhook(url=LIVERY_UPDATE_WEBHOOK)
    embed = DiscordEmbed(title=f"Livery update at `{datetime.datetime.now(datetime.timezone.utc).strftime('%d/%m/%Y %H:%M UTC')}`", color="25405E")
    webhook.add_embed(embed)
    webhook.execute()

    for plane in diff_data:
        webhook = DiscordWebhook(url=LIVERY_UPDATE_WEBHOOK)
        embed = DiscordEmbed(color="25405E")
        livery_list = ""
        for livery in plane["addition"]:
            total += 1
            try:
                livery_list += f'{livery["name"]} *by: {livery["credits"]}*\n'
            except KeyError:
                livery_list += f'{livery["name"]} *by: ??*\n'
        livery_list += f'\n`{len(plane["addition"])}` newly added / `{plane["liv_count"]}` available'
        embed.add_embed_field(name=plane["name"], value=livery_list.strip(), inline=False)
        webhook.add_embed(embed)
        webhook.execute()

    webhook = DiscordWebhook(url=LIVERY_UPDATE_WEBHOOK)
    embed = DiscordEmbed(title=f"Total: `{total}` newly added / `{total_count}` available", color="25405E")
    webhook.add_embed(embed)
    webhook.execute()