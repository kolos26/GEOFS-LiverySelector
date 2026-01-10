<p align="center">
    <img src="https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/refs/heads/main/liveryselector-logo.svg" width="100%"/><br />
    <a target="_blank" href="https://discord.gg/2tcdzyYaWU"><img src="https://dcbadge.limes.pink/api/server/2tcdzyYaWU" alt="https://discord.gg/2tcdzyYaWU" /></a><br />
    <a href="https://github.com/kolos26/GEOFS-LiverySelector/releases/latest"><img alt="Release Badge" src="https://img.shields.io/github/release/kolos26/GEOFS-LiverySelector?style=flat-square&color=light-green"></a> <img alt="Stars Badge" src="https://img.shields.io/github/stars/kolos26/GEOFS-LiverySelector?style=flat-square&color=light-green"> <img alt="Watcher Badge" src="https://img.shields.io/github/watchers/kolos26/GEOFS-LiverySelector?style=flat-square&color=light-green"><br />
</p>
The GeoFS LiverySelector is a unified livery handler add-on designed for [GeoFS](https://www.geo-fs.com), containing hundreds of liveries and a feature-packed user interface to improve performance and accessibility. In the list of liveries, you can find:

- Liveries from Spice9's well-known [GeoFS Multiliveries](https://github.com/Spice9/Geofs-Multiliveries),
- Liveries from Ariakim Taiyo's [LiveryChanger](https://github.com/Ariakim-Taiyo/LiveryChanger),
- [Iuhairway's liveries](https://github.com/iuhairways/Liverychanger-modified), and
- Other custom liveries made exactly for this project.

For every supported aircraft, by pressing the LiverySelector logo or by pressing the [L] key, a list of available liveries will appear. You can also star liveries to pin them, and search for any liveries using this interface.

<p align="center">
    <a target="_blank" href="https://www.youtube.com/watch?v=1w5u2R1dnVU"><img alt="YouTube Trailer" src="https://img.youtube.com/vi/1w5u2R1dnVU/hqdefault.jpg" /></a>
</p>

## How to Install This Add-on?
### Method 1: JavaScript Console
1. Open the Inspect Panel of your browser by either using a keyboard shortcut or right-clicking anywhere on the webpage and choosing the "Inspect" or "Inspect Element" button.
2. Navigate to the JavaScript console, and paste [main.js](hhttps://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/refs/heads/main/main.js) into the console. You may have to type `allow pasting` into the console before pasting the code.
> [!IMPORTANT]
> This method requires you to manually paste the code into the console every time you launch GeoFS.

### Method 2. TamperMonkey
This method only needs to be done once. After that, the add-on should work automatically.
1. To the right of the list of files, click [Releases](https://github.com/kolos26/GEOFS-LiverySelector/releases/latest) to see the latest release.
2. Under the **Assets** dropdown menu, click on the first file (ending with user.js) to download the script.
3. Follow the procedure on-screen to install the script.
> [!NOTE]
> Once the script is saved in Tampermmonkey, it should automatically work every time GeoFS is launched.

## How to use
> Tutorial video by bilibili開飛機のzm
> - [on youtube](https://www.youtube.com/watch?v=luASAu7ikYA)
> - [on bilibili](https://www.bilibili.com/video/BV1gS411w7Co/?spm_id_from=333.999.0.0&vd_source=6be8a43efb2014347309862b1aaf1fd2)

You can use LiverySelector without installation, or you can add it to your Tampermonkey browser addon.

## Virtal Airlines
Since LiverySelector 3.2.0, you can link your own copy of [airline.json](https://github.com/kolos26/GEOFS-LiverySelector/blob/main/airline.json) to have an easily shareable database of custom liveries.
You can add an airline by clicking on **+ Add Airline** button, and you can always remove it by clicking the **- Remove Airline** button. The airline.json is being synced each time you load geofs, the list of subscribed airlines are saved locally and being kept from game to game.
Due to security reasons, these liveries are not visible in multiplayer mode by default. If you would like to make your liveries visible, please contact us on [discord](https://discord.gg/2tcdzyYaWU) to verify your airline and put it on the whitelist. The owner of the airline.json is responsible for ALL CONTENT displayed on the liveries!

### Example for airline.json
In the header, you can customize your airline
```
{
    "name": "Example Airlines", // Name of your airline
    "color": "red",             // The color of the name in LiverySelector
    "bgcolor": "darkblue",      // The background color of the name in LiverySelector
    "aircrafts": {
...
```

The liveries are stored in your airline.json as JSON objects. Into the [] brackets of **"liveies"** you can add several of them. In the **"texture"** array The links to textures are listed as they are ordered in the **"labels"** array. For most planes, you can cheat from the [livery.json](https://github.com/kolos26/GEOFS-LiverySelector/blob/main/livery.json), which is the main database where liveries are stored. The airline.json is designed to be easier to use, so there are minor differences in the structure. The most important one is that when a plane has only one texture file applied, and no shaders are used, you only need to add the link once (unlike the livery.json, where it depends on how many times each texture is used on the plane).

```
...
"10": {
            "name": "Airbus a380-800",
            "liveries": [
                {
                    "name": "RedBull",                                                          // Name of the livery
                    "texture": [
                        "htttps://geo-fs.com/models/aircraft/premium/a380/specular.jpg",        // This is the link to the Specular shader
                        "https://geo-fs.com/models/aircraft/premium/a380/texture_3.jpg"         // This is the link to the Texture
                    ],
                    "credits": "GeoFS"                                                          // The creator of the livery mostly a discord or github nickname
                }
            ],
            "labels": [
                "Specular shader",
                "Texture"
            ]
        },
...
```

If you have any difficulties with setting up airline.json please feel free to contact us!

In this time near all basic aircrafts are supported witch has originally more than one livery. The list of supported aircrafts is:
- Aerospatiale France - British Aircraft Corporation Concorde
- Airbus a220-300
- Airbus a318-112
- Airbus a319-100
- Airbus a320-214
- Airbus a320neo
- Airbus a321-211
- Airbus a321neo
- Airbus a330-200
- Airbus a330-900neo
- Airbus a340-300
- Airbus a350-1000
- Airbus a350-900
- Airbus a380-800
- Alphajet PAF
- Alisport Silent 2 Electro
- Antonov An-140
- ATR 72-600
- Boeing 757-300
- Boeing b737-200
- Boeing b737-700
- Boeing b737-800
- Boeing b737-MAX8
- Boeing b747-8I
- Boeing b757-200
- Boeing b757-300WL
- Boeing b767-300ER
- Boeing b767-400ER
- Boeing b777-300ER
- Boeing b787-10
- Boeing b787-9
- Boeing p8I Neptune
- Bombardier CRJ200
- Bombardier CRJ700
- Bombardier Dash8-q400
- Bombardier Learjet45
- Britten-Norman BN2 Islander
- Cameron R-650 Rozière Balloon
- Cessna 152
- Cessna 172 Skyhawk
- Citroen 2CV
- Colomban MC-15 Cri-cri
- de Havilland Canada DHC2 Beaver
- de Havilland Canada DHC6 Twin Otter
- Dornier do228-200
- Douglas DC-3
- Embraer ERJ 145LR
- Embraer ERJ 170
- Embraer Phenom100
- Evektor Sportstar
- General Dynamics F16 Fighting Falcon
- Goat Airchair
- Leonardo - AugustaWestland AW609
- Lokheed L1011-1 TriStar
- Lokheed P38 Lightning
- Major Tom (hot air balloon)
- McDonell Douglas - Boeing F/A-18F Super Hornet
- Paraglider
- Pilatus PC-7 Mk-I
- Piper J3 Cub
- Piper PA-28 161 Warrior II
- Pitts Special S1
- Potez 25
- SAAB 340
- Sonex-B kit
- Sukhoi Su-35 Flanker
- Vans RV6
- Zlin Z-50

## Contributing to Our Database
The best way to start contributing to LiverySelector is by joining our Discord server, where you can find useful materials (like texture maps and UVs) and helpful hands. You can find the maps that you can paint over [here](https://github.com/kolos26/GeoFS-Liveries-Storage/tree/main/maps).

For these aircraft, instead of using maps, you can repaint the original texture files:
- [Boeing 757-200](https://geo-fs.com/backend/aircraft/repository/GXD04N_126645_238/texture.png)
- [Boeing 767-300ER](https://geo-fs.com/backend/aircraft/repository/GXD03FI_126645_237/texture.png)
- [Bombardier Dash8-Q400](https://www.geo-fs.com/backend/aircraft/repository/E01_166635_247/texture.png)

If you completed a livery, please submit it through our Discord server, via our addon, or here, using a Livery Submission issue.

> [!NOTE]
> This project only accepts real-life liveries. Historical liveries, liveries for planned/abandoned orders are also welcome. Planned but never used liveries are also allowed, as long as there is one official picture from the airline or manufacturer.

## Feedback
Comments and feedback are most welcome, just add them as a [GitHub issue](https://github.com/kolos26/GEOFS-LiverySelector/issues).
Please fill out [this anonymous survey](https://forms.gle/6j9XmhJgpdoWwTTJ6), to help my work, and let me know which aircraft would you like to fly the most.

> **[Join our Discord server to keep up to date about our latest updates and chat with others.](https://discord.gg/2tcdzyYaWU)**

## Resources
Fonts and icons in the logo:
- https://www.ffonts.net/Distorty-Normal.font
- https://www.ffonts.net/SquareFont-Outline.font
- https://www.onlinewebfonts.com/icon/521102
- https://www.svgrepo.com/svg/321708/airplane-departure

Sources of the liveries:
- https://github.com/Ariakim-Taiyo/LiveryChanger
- https://github.com/Spice9/Geofs-Multiliveries
- https://github.com/iuhairways/Liverychanger-modified
