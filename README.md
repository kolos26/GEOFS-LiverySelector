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

## Features

For every supported aircraft you can find the list of avaliable liveries in the **LIVERY** menu. Here you can star your favourite liveries to show them on the top and search for any livery. I'm only planning to support real-life liveries, because most people do not want to share their personal liveries.

Loading local personal liveries is also a planned feature just as writing the full multiplayer visibility.

## How to use

You can use LiverySelector without installation, or you can add it to your Tampermonkey browser addon.

**Both versions download the list of newest aircrafts every time you start GeoFS, you don't have to do anything after installation.**

### Quick test without installation

You can use the LiverySelector without installation: just copy and paste the [main.js](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/main.js) into the browser console.

You need to do that every time you want to use LiverySelector.
For the first time you need to paste this line into the console:

```localStorage.favorites = "";```

### Install into Tampermonkey (recommended)

You can also find the [Tampermonkey](https://www.tampermonkey.net/) compatible version of LiverySelector in the Releases menu and add it to your Tampermonkey addon.

For the first time you need to paste this line into the console:

```localStorage.favorites = "";```

## Aircrafts

In this time near all basic aircrafts are supported witch has originally more than one livery. The list of supported aircrafts with extra liveries is:
- Boeing b737-700
- Boeing b737-800
- Boeing b737-8
- Boeing b757-200
- Boeing b767-300er
- Boeing b787-9
- Boeing b787-10
- Bombardier CRJ-700
- Boeing P8 Poseidon
- Airbus a220-300
- Airbus a319-100
- Airbus a320neo
- Airbus a330-900neo
- Airbus a350-900
- Airbus a350-1000
- Airbus a380
- Concorde
- ATR-72
- Embraer erj145LR
- SAAB 340
- Britten-Normal BN2 Islander
- Bombardier Dash8-q400
- Bombardier CRJ-200
- Douglas dc3
- Lockheed P38 Lightning
- General Dynamics F16 Fighning Falcon

## Feedback

Comments and feedback are most welcome, just add them as a [GitHub issue](https://github.com/kolos26/GEOFS-LiverySelector/issues).
Please fill out [this anonymous survey](https://forms.gle/6j9XmhJgpdoWwTTJ6), to help my work, and let me know which aircraft would you like to fly the most.

> **[You can join to our discord server, to keep yourself up to date about the new features.](https://discord.gg/ZW7zh9FXYN)**




## Known issues

- Version 1 works no longer, please update to 2.0.0!

## How to contribute?

I'm very happy if you contribute new liveries to this livery project!

At the time you can contribute liveries to the original Multiliveries aircrafts (b787-9, b787-10, b737-8, b737-800, a320neo, a220-300, a319-100, erj145lr, saab340), the b737-700, a350-900, a350-1000, b757-200, b767-300er, ATR 72-600, BN2, dash8 and crj200.

Here you can find the maps, that you can paint out:
- [Boeing b737-700](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/b737-700.png)
- [Boeing b737-800](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/b737-800.png)
- [Boeing b737-8](https://i.ibb.co/59Cs2kB/texture-11-Copy-2.jpg)
- [Boeing b787-9](https://i.ibb.co/DLpSHqp/789plain.jpg)
- [Boeing b787-10](https://i.ibb.co/zr00FRy/texture-46.jpg)
- [Airbus a220-300](https://i.ibb.co/m4xW9Gc/a220.jpg)
- [Airbus a319-100](https://i.ibb.co/vkzQX1L/A319-New-UV.jpg)
- [Airbus a320neo](https://i.ibb.co/yXHSvXN/plain.jpg)
- [Airbus a330-900neo](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/a330-900.png)
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

> **Note**: In this project I'm only accepting real life liveries (historical planes, and planes on order are also welcome, I also accept liveries that were planned, and there is also at least one official picture drawn by the airline), so if you would like to fly with fictional liveries you can build your own liveries.json database. **If you are done with a livery, send me as an issue or a pull request, so I can put it into the main datasbase**, if you are sending it as an issue, please add a "livery" label too, to make the process faster.

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
