<h1 align="center">GEOFS-LiverySelector</h1>

<p align="center">
    <img src="liveryselector-logo.svg" width="100%"/>
    <br></br>
    <td><a target="_blank" href="https://discord.gg/2tcdzyYaWU"><img src="https://dcbadge.limes.pink/api/server/2tcdzyYaWU" alt="https://discord.gg/2tcdzyYaWU" /></a></td>
</p>
<p align="center">
    <img alt="Stars Badge" src="https://img.shields.io/github/stars/kolos26/GEOFS-LiverySelector?style=flat-square&color=light-green">
    <img alt="Stars Badge" src="https://img.shields.io/github/watchers/kolos26/GEOFS-LiverySelector?style=flat-square&color=light-green">
    <a href="https://github.com/kolos26/GEOFS-LiverySelector/releases/latest"><img alt="Stars Badge" src="https://img.shields.io/github/release/kolos26/GEOFS-LiverySelector?style=flat-square&color=light-green"></a>
</p>
<h1></h1>

LiverySelector is a unified livery handler addon for [GeoFS](https://geo-fs.com), 
containing hundreds of liveries and a feature packed user interface to make it easier to use your favorite livery.

In the list of liveries you can find:

- the well known [multiliveries](https://github.com/Spice9/Geofs-Multiliveries) by Spice9, 
- the LiveryChanger by [Ariakim Taiyo](https://github.com/Ariakim-Taiyo/LiveryChanger), 
- [Iuhairways](https://github.com/iuhairways/Liverychanger-modified), and
- other custom liveries made exactly for this project.

My goal was to put the liveries into one easy to use interface where you can select them fast with one click.

## Trailer
[![YouTube Trailer](https://img.youtube.com/vi/1w5u2R1dnVU/hqdefault.jpg)](https://www.youtube.com/watch?v=1w5u2R1dnVU)


## Features

For every supported aircraft you can find the list of avaliable liveries in the livery menu. You can open the menu by clicking on the LS logo or simply pressing *l* on your keyboard. Here you can star your favourite liveries to show them on the top and search for any livery. I'm only planning to support real-life liveries, because most people do not want to share their personal liveries.


## How to use

> Tutorial video by bilibili開飛機のzm
> - [on youtube](https://www.youtube.com/watch?v=luASAu7ikYA)
> - [on bilibili](https://www.bilibili.com/video/BV1gS411w7Co/?spm_id_from=333.999.0.0&vd_source=6be8a43efb2014347309862b1aaf1fd2)

You can use LiverySelector without installation, or you can add it to your Tampermonkey browser addon.

**Both versions download the list of newest aircrafts every time you start GeoFS, you don't have to do anything after installation.**

### Quick test without installation

You can use the LiverySelector without installation: just copy and paste the [main.js](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/main.js) into the browser console.

You need to do that every time you want to use LiverySelector.

### Install into Tampermonkey (recommended)

You can also find the [Tampermonkey](https://www.tampermonkey.net/) compatible version of LiverySelector in the Releases menu and add it to your Tampermonkey addon.


## How to use the test feature?

The test feature is a brand new function in 2.1.0. You can find it at the end of the LIVERY menu.

- You can insert the direct url to the image in the green box, or
- you can also post it directly to imgbb, via the blue **UPLOAD IMAGE** button. To do that you need to [create an API key](https://api.imgbb.com/), and save it to local storage by typing `localStorage.imgbbAPIKEY = "YOUR API KEY"` into the console. You only need to do this for the first time, the app will remember your key. After pressing the button, within a few seconds the url should appear in the green box.

After pasting a link, add the livery by pressing the yellow **LOAD LIVERY** button. For some planes more than one boxes are available. To add only the painting, use the box called **Texture**, you can keep the rest of them empty.

Here you can find a tutorial on using this feature: [https://www.youtube.com/watch?v=QC4E_DNmvjY](https://www.youtube.com/watch?v=QC4E_DNmvjY) (Created by bilibilizm)

## Virtal Airlines

Since LiverySelector 3.2.0 you can link your own copy of [airline.json](https://github.com/kolos26/GEOFS-LiverySelector/blob/main/airline.json) to have an easily shareable database of custom liveries.
You can add an airline by clicking on **+ Add Airline** button, and you can always remove them by clicking the **- Remove Airline** button. The airline.json is being synced each time you load geofs, the list of subscribed airlines are saved locally and being kept from game to game.
By default due to security reasons these liveries are not visible in multiplayer mode. If you would like to make your liveries visible please contact us on [discord](https://discord.gg/2tcdzyYaWU) to vertify your airline and put it onto the whitelist. The owner of the airline.json is responsible for ALL CONTENT displayed on the liveries!

### Example for airline.json

In the header you can customize your airline
```
{
    "name": "Example Airlines", // Name of your airline
    "color": "red",             // The color of the name in LiverySelector
    "bgcolor": "darkblue",      // The background color of the name in LiverySelector
    "aircrafts": {
...
```

The liveries are stored in your airline.json as json objects. Into the [] brackets of **"liveies"** you can add several of them. In the **"texture"** array The links to textures are listed as they are ordered in the **"labels"** array. For most planes you can cheat from the [livery.json](https://github.com/kolos26/GEOFS-LiverySelector/blob/main/livery.json), which is the main database where liveries are stored, however the airline.json is designed to be easier to use, so there are minor differences in the structure. The most important one is that when a plane has only one texture file applied and no shaders are used, you only need to add the link once (unlikely to the livery.json where it's depending on how many times each texture is used on the plane).

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

In this time near all basic aircrafts are supported which has originally more than one livery. The list of supported aircrafts is:

- Piper J3 Cub
- Cessna 172 Skyhawk
- Alphajet PAF
- Boeing b737-700
- Embraer Phenom100
- de Havilland Canada DHC6 Twin Otter
- General Dynamics F16 Fighting Falcon
- Pitts Special S1
- Eurocopter EC135
- Airbus a380-800
- Alisport Silent 2 Electro
- Pilatus PC-7 Mk-I
- de Havilland Canada DHC2 Beaver
- Colomban MC-15 Cri-cri
- Lokheed P38 Lightning
- Douglas DC-3
- Sukhoi Su-35 Flanker
- Aerospatiale France - British Aircraft Corporation Concorde
- Zlin Z-50
- Cessna 152
- Piper PA-28 161 Warrior II
- Airbus a350-900
- Boeing b777-300ER
- Antonov An-140
- McDonell Douglas - Boeing F/A-18F Super Hornet
- Beechcraft B55 Baron
- Dessault Rafale M
- Potez 25
- Evektor Sportstar
- szd-48-3 Jantar
- Paraglider
- Major Tom (hot air balloon)
- Hughes 269a/TH-55 Osage
- Goat Airchair
- Citroen 2CV
- Boeing b767-300ER
- Boeing b757-200
- Airbus a350-900
- Bombardier Dash8-q400
- Boeing b777-9X
- Ilyushin IL-76TD
- Embraer ERJ 190
- McDonnell Douglas MD11
- ATR 72-600
- Boeing b737-MAX8
- Antonov An-225 Mriya
- Supermarine Spitfire Mk XIV
- Cameron R-650 Rozière Balloon
- Airbus a330-200
- Lockheed Martin F22 Raptor
- Leonardo - AugustaWestland AW609
- Airbus a320neo
- SAAB 340
- Airbus a340-300
- NASA Space Shuttle
- Airbus a350-1000
- Airbus a320-232
- Boeing b737-800
- Boeing b787-10
- UTVA 75
- Dornier do228-200
- Boeing p8I Neptune
- Bombardier CRJ700
- Embraer ERJ 170
- Dornier do228-100 Coast Guard
- Grumman E-2 Hawkeye
- Airbus a320-214
- Boeing b787-9
- McDonnell Douglas F-15C Eagle
- Dessault Mirage 2000-5
- Boeing b737-200
- Britten-Norman BN2 Islander
- Vans RV6
- Airbus a330-900neo
- Airbus a321neo
- Boeing 757-300
- Boeing b757-300WL
- Boeing b767-400ER
- Lockheed L1011-1 TriStar
- Sonex-B kit
- Airbus a321-211
- Airbus a318-112
- Boeing b747-8I
- Boeing b737-600
- Boeing 747SP
- Lockheed Martin F35B Lightning II
- Boeing b747-100 SCA
- Dessault Mirage F1
- Chengdu J-20
- Boeing b747-400D
- Northrop YF-23
- CubCrafters CC19 XCub
- Comac C919

Supported planes added by the [Extra Vehicles addon](https://github.com/af267/GeoFS-Extra-Vehicles/):

- Boeing b747-8F
- Boeing b737-900
- Boeing b777-200
- Tupolev Tu-204

## Feedback

Comments and feedback are most welcome, just add them as a [GitHub issue](https://github.com/kolos26/GEOFS-LiverySelector/issues/new/choose).
Please fill out [this anonymous survey](https://forms.gle/6j9XmhJgpdoWwTTJ6), to help my work, and let me know which aircraft would you like to fly the most.

> **[You can join our discord server to keep yourself up to date about the new features, and also submit issue reports.](https://discord.gg/2tcdzyYaWU)**


## Known issues

- Old versions are no longer working, please update to the latest version!
- Opening the livery menu on popular aircraft, such as the default 737, may freeze your screen for a bit as the browser loads all the liveries. Work is underway to make this faster.

## How to contribute?

I'm very happy if you contribute new liveries to this livery project! The best way to start contributing to LiverySelector is by joining our discord server, where you can find useful materials and helping hands.

[Here](https://github.com/kolos26/GEOFS-LiverySelector/tree/main/maps) you can find the maps, that you can paint out:


For these aircrafts, instead of using maps, you can repaint the original texture files:
- [Boeing b757-200](https://geo-fs.com/backend/aircraft/repository/GXD04N_126645_238/texture.png)
- [Boeing b767-300er](https://geo-fs.com/backend/aircraft/repository/GXD03FI_126645_237/texture.png)
- [Bombardier Dash8-q400](https://www.geo-fs.com/backend/aircraft/repository/E01_166635_247/texture.png)

> **Note**: In this project I'm only accepting real life liveries (historical planes, and planes on order are also welcome, I also accept liveries that were planned, and there is also at least one official picture drawn by the airline or the manafacturer), so if you would like to fly with fictional liveries you can build your own airline.json database. **If you are done with a livery, send me as an issue or a pull request, so I can put it into the main datasbase**, if you are sending it as an issue, please add a "livery" label too, to make the process faster.

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
