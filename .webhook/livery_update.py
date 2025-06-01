from git import Repo
import json
import os
from discord_webhook import DiscordWebhook, DiscordEmbed

LIVERY_UPDATE_WEBHOOK = os.environ["LIVERY_UPDATE_WEBHOOK"]
ls_repo = Repo("..")

with open("./.webhook/commit.txt", "r") as file:
    commit_id = file.read()
    print(commit_id)


new_json = json.loads((ls_repo.commit(f"origin/{ls_repo.active_branch.name}").tree / "livery.json" ).data_stream.read().decode('utf-8'))
old_json = json.loads((ls_repo.commit(commit_id).tree / "livery.json").data_stream.read().decode('utf-8'))
keys = new_json["aircrafts"].keys()

diff_data = []
for plane in keys:
    addition = []
    for livery in new_json["aircrafts"][plane]["liveries"]:
        try: 
            if not livery in old_json["aircrafts"][plane]["liveries"]:
                addition.append(livery)
        except KeyError:
            addition.append(livery)
    data = {"name": new_json["aircrafts"][plane]["name"], "addition": addition}
    if addition:
        diff_data.append(data)


print(diff_data)

total = 0

if diff_data:
    webhook = DiscordWebhook(url=LIVERY_UPDATE_WEBHOOK)
    embed = DiscordEmbed(title=f"New livery update", color="25405E")
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
        embed.add_embed_field(name=plane["name"], value=livery_list.strip(), inline=False)
        webhook.add_embed(embed)
        webhook.execute()

    webhook = DiscordWebhook(url=LIVERY_UPDATE_WEBHOOK)
    embed = DiscordEmbed(title=f"Total: {total}", color="25405E")
    webhook.add_embed(embed)
    webhook.execute()

with open("./.webhook/commit.txt", "w") as file:
    commit_id = ls_repo.commit(f"origin/{ls_repo.active_branch.name}").hexsha
    print(commit_id)
    file.write(commit_id)