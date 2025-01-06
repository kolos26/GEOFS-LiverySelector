# GEOFS-LiverySelector

<img src="liveryselector-logo.svg" width="120%"/>

Unified livery handler addon for [geofs](https://geo-fs.com).

This addon contains more than a hundred of new liveries and a brand new user interface to make it easier to use your favorite livery.

In the list of liveries you can find:

- the well known [multiliveries](https://github.com/Spice9/Geofs-Multiliveries) by Spice9, 
- the LiveryChanger by [Ariakim Taiyo](https://github.com/Ariakim-Taiyo/LiveryChanger), 
- [Iuhairways](https://github.com/iuhairways/Liverychanger-modified), and
- other custom liveries made exactly for this project.

My goal was to put the liveries into one easy to use interface where you can select them fast with one click.

## Trailer
[![YouTube Trailer](https://img.youtube.com/vi/VsFhiWKO5tQ/hqdefault.jpg)](https://www.youtube.com/watch?v=VsFhiWKO5tQ)

[Trailer on Bilibili](https://www.bilibili.com/video/BV15dYDe5EB2)


## Features

For every supported aircraft you can find the list of avaliable liveries in the livery menu. You can open the menu by clicking on the LS logo or simply pressing *l* on your keyboard.0 Here you can star your favourite liveries to show them on the top and search for any livery. I'm only planning to support real-life liveries, because most people do not want to share their personal liveries.


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
    "name": "Example Airlines", //Name of your airline
    "color": "red",             //The color of the name in LiverySelector
    "bgcolor": "darkblue",      //The background color of the name in LiverySelector
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


## Feedback

Comments and feedback are most welcome, just add them as a [GitHub issue](https://github.com/kolos26/GEOFS-LiverySelector/issues).
Please fill out [this anonymous survey](https://forms.gle/6j9XmhJgpdoWwTTJ6), to help my work, and let me know which aircraft would you like to fly the most.

> **[You can join to our discord server, to keep yourself up to date about the new features.](https://discord.gg/2tcdzyYaWU)**


## Known issues

- Old versions are no longer working, please update to the latest version!

## How to contribute?

I'm very happy if you contribute new liveries to this livery project! The best way to start contributing to LiverySelector is by joining our discord server, where you can find useful materials and helping hands.

Here you can find the maps, that you can paint out:
- [Boeing b737-700](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/b737-700.png)
- [Boeing b737-800](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/b737-800.png)
- [Boeing b737-8](https://i.ibb.co/59Cs2kB/texture-11-Copy-2.jpg)
- [Boeing b787-9](https://i.ibb.co/DLpSHqp/789plain.jpg)
- [Boeing b787-10](https://i.ibb.co/zr00FRy/texture-46.jpg)
- [Airbus a220-300](https://i.ibb.co/m4xW9Gc/a220.jpg)
- [Airbus a319-100](https://i.ibb.co/vkzQX1L/A319-New-UV.jpg)
- [Airbus a320neo](https://i.ibb.co/yXHSvXN/plain.jpg)
- [Airbus a330-900neo](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/a330neo.png)
- [Airbus a350-1000 XWB](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/a350-1000.png)
- [Airbus a350-900 XWB](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/a350-900.png)
- [Airbus a380](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/a380.jpg)
- [ATR 72-600](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/atr72.jpg)
- [Embraer ERJ145LR](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/erj145lr.png)
- [Bombardier CRJ-200](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/crj200.png)
- [Britten-Normal BN2](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/bn2.png)
- [SAAB 340](https://cdn.discordapp.com/attachments/1009138556410789918/1091314048894771200/tex.jpg)

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
