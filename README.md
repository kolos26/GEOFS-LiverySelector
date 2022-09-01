# GEOFS-LiverySelector

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

In this time near all basic aircrafts are supported witch has originally more than one livery.The list of supported aircrafts with extra liveries is:
- Boeing b737-700
- Boeing b737-8
- Boeing b757-200
- Boeing b767-300er
- Boeing b787-9
- Boeing b787-10
- P8 Poseidon
- Airbus a220-300
- Airbus a319-100
- Airbus a320neo
- Airbus a350-900
- Airbus a350-1000
- Airbus a380
- Concorde
- ATR-72

### Planned aircrafts

I plan to support these aircrafts:
- b787-8
- dc3

## Feedback

Comments and feedback are most welcome, just add them as a [GitHub issue](https://github.com/kolos26/GEOFS-LiverySelector/issues).

## Known issues

- Livereies with partial texture files are not working, I will fix it as soon as it's possible.
- Multiplayer visibility will be developed in the next version.

## How to contribute?

I'm very happy if you contribute new liveries to this livery project!

At the time you can contribute liveries to the original Multiliveries aircrafts and the b737-700.

Here you can find the maps, that you can paint out:
- [Boeing b737-700](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/b737-700.png)
- [Boeing b737-8](https://raw.githubusercontent.com/Spice9/Geofs-Multiliveries/main/Base%20Maps/texture_11%20-%20Copy%20(2).jpg)
- [Boeing b787-9](https://i.ibb.co/DLpSHqp/789plain.jpg)
- [Boeing b787-10](https://i.ibb.co/zr00FRy/texture-46.jpg)
- [Airbus a220-300](https://i.ibb.co/m4xW9Gc/a220.jpg)
- [Airbus a319-100](https://i.ibb.co/vkzQX1L/A319-New-UV.jpg)
- [Airbus a320neo](https://raw.githubusercontent.com/Spice9/Geofs-Multiliveries/main/Base%20Maps/plain_2.jpg)
- [Airbus a350-100 XWB](https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/maps/a350-1000.png)

For these aircrafts (created by GX Development), instead of using maps, you can repaint the original texture files:
- [Boeing b757-200](https://geo-fs.com/backend/aircraft/repository/GXD04N_126645_238/texture.png)
- [Boeing b767-300er](https://geo-fs.com/backend/aircraft/repository/GXD03FI_126645_237/texture.png)
- [Airbus a350-900](https://geo-fs.com/backend/aircraft/repository/GXD05OQ_166617_239/texture.png)

> **Note**: In this project I'm only accepting real life liveries, so if you would like to fly with fictional liveries you can build your own liveries.json database. If you are done with a livery, send me as an issue or a pull request, so I can put it into the main datasbase.
