import json

NOT_SUPPORTED = ["717_380019_5380", "5405"]

with open("livery.json", "r", encoding="utf-8") as f:
        livery_json = json.loads(f.read())

airline_json = {
    "name": "",
    "color": "",
    "bgcolor": "",
    "aircrafts": {
    }
}

keys = livery_json["aircrafts"].keys()

for key in keys:
    if not key in NOT_SUPPORTED:
        print(key)
        airline_json["aircrafts"][key] = {"name": livery_json["aircrafts"][key]["name"], \
                                        "liveries": [], \
                                        "labels": list(livery_json["aircrafts"][key]["labels"]), \
                                        "defshader": [livery_json["aircrafts"][key]["defshader"][livery_json["aircrafts"][key]["labels"][i][0]] for i in livery_json["aircrafts"][key]["labels"]]}

with open("airline.json", "w", encoding="utf-8") as f:
    airline_json["aircrafts"] = dict(
        sorted(airline_json["aircrafts"].items(), key=lambda item: (item[1]["name"].startswith("*"), item[1]["name"].lower()))
    )
    json.dump(airline_json, f, indent=4, ensure_ascii=False)