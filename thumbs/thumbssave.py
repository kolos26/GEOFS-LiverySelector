from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from time import sleep
import shutil

with open("main.js", "r") as file:
    LSscript = file.read()

ids = ["31"]
thumb_data = {
    "1": {
        "setup" : "geofs.aircraft.instance.parts.prop.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.6);geofs.camera.setPosition(-1, 0, 0.5);geofs.camera.setRotation(220, 20, 0);"
    },
    "2": {
        "setup" : "geofs.aircraft.instance.parts.prop.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.7);geofs.camera.setPosition(-1, 0, 0.5);geofs.camera.setRotation(220, 8, 0);"
    },
    "3": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.8);geofs.camera.setPosition(0, 0, 0.25);geofs.camera.setRotation(220, 10, 0);"
    },
    "4": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.9);geofs.camera.setPosition(-2, 0, 2);geofs.camera.setRotation(220, 15, 0);"
    },
    "5": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.7);geofs.camera.setPosition(0, 0, 0.5);geofs.camera.setRotation(220, 10, 0);"
    },
    "6": {
        "setup" : "geofs.aircraft.instance.parts.prop_left.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur_left.animations[1].type = 'hide';geofs.aircraft.instance.parts.prop_right.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur_right.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.8);geofs.camera.setPosition(-2, 0, .5);geofs.camera.setRotation(220, 10, 0);"
    },
    "7": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.9);geofs.camera.setPosition(0.5, 0, 0.5);geofs.camera.setRotation(220, 20, 0);"
    },
    "8": {
        "setup" : "geofs.aircraft.instance.parts.prop.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.7);geofs.camera.setPosition(-0.25, 0, 0);geofs.camera.setRotation(220, 10, 0);"
    },
    "9": {
        "setup" : "geofs.aircraft.instance.parts.mainrotor_1.animations[1].type = 'show';geofs.aircraft.instance.parts.mainrotor_2.animations[1].type = 'show';geofs.aircraft.instance.parts.mainrotor_3.animations[1].type = 'show';geofs.aircraft.instance.parts.mainrotor_4.animations[1].type = 'show';geofs.aircraft.instance.parts.bladeblur1.animations[1].type = 'hide';geofs.aircraft.instance.parts.bladeblur2.animations[1].type = 'hide';geofs.aircraft.instance.parts.bladeblur3.animations[1].type = 'hide';geofs.aircraft.instance.parts.bladeblur4.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.7);geofs.camera.setPosition(-0.25, 0, 0);geofs.camera.setRotation(220, 10, 0);"
    },
    "10": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.9);geofs.camera.setPosition(-7, 0, 2);geofs.camera.setRotation(220, 15, 0);geofs.camera.definitions[geofs.camera.currentModeName].distance=90;"
    },
    "11": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.9);geofs.camera.setPosition(-1, 0, 0);geofs.camera.setRotation(220, 10, 0);"
    },
    "12": {
        "setup" : "geofs.aircraft.instance.parts.prop.animations[0].type = 'show';geofs.aircraft.instance.parts.propblur.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.7);geofs.camera.setPosition(-1, 0, 0.5);geofs.camera.setRotation(220, 8, 0);"
    },
    "13": {
        "setup" : "geofs.aircraft.instance.parts.prop.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.9);geofs.camera.setPosition(-1.5, 0, 0);geofs.camera.setRotation(220, 9, 0);"
    },
    "14": {
        "setup" : "geofs.aircraft.instance.parts.propLeft.animations[0].type = 'show';geofs.aircraft.instance.parts.propblurLeft.animations[1].type = 'hide';geofs.aircraft.instance.parts.propRight.animations[0].type = 'show';geofs.aircraft.instance.parts.propblurRight.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.6);geofs.camera.setPosition(-0.25, 0, 0.25);geofs.camera.setRotation(220, 18, 0);"
    },
    "15": {
        "setup" : "geofs.aircraft.instance.parts.propLeft.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur_left.animations[1].type = 'hide';geofs.aircraft.instance.parts.propRight.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur_right.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.9);geofs.camera.setPosition(-2, 0, 0);geofs.camera.setRotation(220, 20, 0);"
    },
    "16": {
        "setup" : "geofs.aircraft.instance.parts.prop1.animations[1].type = 'show';geofs.aircraft.instance.parts.propblurLeft.animations[1].type = 'hide';geofs.aircraft.instance.parts.prop2.animations[1].type = 'show';geofs.aircraft.instance.parts.propblurRight.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.8);geofs.camera.setPosition(-4, 0, 0);geofs.camera.setRotation(220, 12, 0);"
    },
    "18": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.85);geofs.camera.setPosition(1.5, 0, -0.5);geofs.camera.setRotation(220, 20, 0);"
    },
    "20": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.2);geofs.camera.setPosition(5, 0, 0);geofs.camera.setRotation(220, 10, 0);geofs.camera.definitions[geofs.camera.currentModeName].distance=240;"
    },
    "21": {
        "setup" : "geofs.aircraft.instance.parts.prop.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.6);geofs.camera.setPosition(-0.5, 0, 0);geofs.camera.setRotation(220, 20, 0);"
    },
    "22": {
        "setup" : "geofs.aircraft.instance.parts.prop.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.7);geofs.camera.setPosition(-0.5, 0, 0);geofs.camera.setRotation(220, 14, 0);"
    },
    "23": {
        "setup" : "geofs.aircraft.instance.parts.prop.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.6);geofs.camera.setPosition(-1, 0, 0);geofs.camera.setRotation(220, 15, 0);"
    },
    "24": {
        "setup" : "geofs.aircraft.instance.parts.fanLeft.animations[0].type = 'show';geofs.aircraft.instance.parts.spinningFanLeft.animations[0].lt = 100000;geofs.aircraft.instance.parts.fanRight.animations[0].type = 'show';geofs.aircraft.instance.parts.spinningFanRight.animations[0].lt = 100000;",
        "camera": "geofs.camera.setFOV(0.9);geofs.camera.setPosition(-3, 0, 0);geofs.camera.setRotation(210, 10, 0);"
    },
    "25": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.9);geofs.camera.setPosition(-2, 0, 1);geofs.camera.setRotation(210, 10, 0);geofs.camera.definitions[geofs.camera.currentModeName].distance=80;"
    },
    "26": {
        "setup" : "geofs.aircraft.instance.parts.prop1.animations[1].type = 'show';geofs.aircraft.instance.parts.propblurleft.animations[1].type = 'hide';geofs.aircraft.instance.parts.prop2.animations[1].type = 'show';geofs.aircraft.instance.parts.propblurright.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.7);geofs.camera.setPosition(-2, 0, 1);geofs.camera.setRotation(220, 5, 0);"
    },
    "27": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(1.0);geofs.camera.setPosition(1, 0, 0.5);geofs.camera.setRotation(215, 10, 0);"
    },
    "28": {
        "setup" : "geofs.aircraft.instance.parts.propLeft.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur_left.animations[1].type = 'hide';geofs.aircraft.instance.parts.propRight.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur_right.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(0.7);geofs.camera.setPosition(-1, 0, 0);geofs.camera.setRotation(220, 10, 0);"
    },
    "29": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.8);geofs.camera.setPosition(1, 0, 0.5);geofs.camera.setRotation(220, 10, 0);"
    },
    "31": {
        "setup" : "geofs.aircraft.instance.parts.prop.animations[1].type = 'show';geofs.aircraft.instance.parts.propblur.animations[1].type = 'hide';",
        "camera": "geofs.camera.setFOV(1.0);geofs.camera.setPosition(-1.5, 0, 0);geofs.camera.setRotation(220, 15, 0);"
    },
    "40": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.6);geofs.camera.setPosition(-1, 0, 0);geofs.camera.setRotation(220, 20, 0);"
    },
    "41": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.9);geofs.camera.setPosition(-1.5, 0, 0);geofs.camera.setRotation(220, 15, 0);"
    },
    "52": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.8);geofs.camera.setPosition(0, 0, -0.25);geofs.camera.setRotation(220, 25, 0);"
    },
    "53": {
        "setup" : "",
        "camera": "geofs.camera.setFOV(0.9);geofs.camera.setPosition(0, 0, 0.5);geofs.camera.setRotation(220, 20, 0);"
    }
}

#setup
chrome_options = webdriver.ChromeOptions()
prefs = {'profile.default_content_setting_values.automatic_downloads': 1}
chrome_options.add_experimental_option("prefs", prefs)
chrome_options.add_argument("--headless=new")
driver = webdriver.Chrome(options = chrome_options)
driver.implicitly_wait(15)
driver.set_window_size(3200, 2400)
driver.get("https://www.geo-fs.com/geofs.php")
driver.find_element(by=By.CLASS_NAME, value="fc-button-label").click()
driver.find_element(by=By.XPATH, value="/html/body/div[1]/div[3]/a").click()

for id in ids:
    driver.get(f"https://www.geo-fs.com/geofs.php?a={id}&la=45&lo=-15&al=1500&h=160")
    sleep(5)
    driver.execute_script("window.setupReady = false")
    print("ad script")
    driver.execute_script("document.getElementsByClassName('geofs-adbanner')[0].remove()")
    sleep(5)
    print("prop script")
    driver.execute_script(thumb_data[id]["setup"])
    sleep(5)
    driver.execute_script("geofs.resetFlight()")
    driver.switch_to.alert.accept()
    driver.execute_script("geofs.doPause()")
    sleep(5)
    print("LS script")
    driver.execute_script(LSscript)
    sleep(5)
    print("camera script")
    driver.execute_script(thumb_data[id]["camera"])
    sleep(5)
    print("background script")
    driver.execute_script("""geofs.api.viewer.scene.globe.show = false;
            geofs.api.viewer.scene.backgroundColor = new Cesium.Color(1, 1, 1, 1);
            setTimeout(() => {
                geofs.fx.atmosphere.destroy();
                geofs.buildings.destroy();
                geofs.trees.destroy();
                geofs.preferences.weather.localTime = 16;
                weather.setDateAndTime();
                window.setupReady = true;
            },1);
            """)
    sleep(5)
    print("shoot script")
    WebDriverWait(driver, 60).until(
        lambda d: d.execute_script("return window.setupReady === true;")
    )
    driver.execute_script("""
            function createTag(name, attributes = {}, content = '') {
                const el = document.createElement(name);
                Object.keys(attributes || {}).forEach(k => el.setAttribute(k, attributes[k]));
                if (('' + content).length) {
                    el.innerHTML = content;
                }
                return el;
            }

            function shoot (liveryId, w = 640, h = 480) {
                geofs.api.viewer.scene.render();
                const sceneImg = geofs.api.viewer.scene.canvas;
                const canvas = createTag('canvas', {width: w, height: h});
                const ctx = canvas.getContext('2d');
                if (liveryId===undefined) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.globalAlpha = 0.5;
                    ctx.font = '20px "Bahnschrift"';
                    ctx.fillStyle = "grey";
                    ctx.fillText("PLACEHOLDER", 100, 220);
                }
                ctx.drawImage(sceneImg, 0, 0, canvas.width, canvas.height);
                const filename = geofs.aircraft.instance.id + (liveryId!==undefined?'-'+liveryId:'');
                const a = document.createElement('a');
                a.setAttribute('href', canvas.toDataURL('image/png'));
                a.setAttribute('download', filename + '.png');
                a.click();
            }

            function shootAll(idx) {
                const airplane = window.LiverySelector.liveryobj.aircrafts[geofs.aircraft.instance.id];
                if (idx === undefined) {
                    return shootAll(0);
                }
                if (airplane.liveries[idx] === undefined) {
                    window.shootReady = true;
                    return console.log('done');
                }
                const livery = airplane.liveries[idx];
                //loadLivery(livery.texture, airplane.index, airplane.parts);
                const res = [];
                for (let i = 0; i < airplane.index.length; i++) {
                    const model3d = geofs.aircraft.instance.definition.parts[airplane.parts[i]]['3dmodel'];
                    //geofs.api.changeModelTexture(model3d._model, livery.texture[i], {index:index[i]});
                    const d = model3d._model._rendererResources.textures[airplane.index[i]];
                    res.push(
                        Cesium.Resource.fetchImage({
                            url: livery.texture[i]
                        }).then((e) => {
                            d.copyFrom({
                                source: e
                            });
                            d.generateMipmap();
                        })
                    );
                }
                Promise.all(res).then(() => {
                    shoot(idx);
                    setTimeout(() => shootAll(idx + 1), 1000);
                }).catch((e) => {
                    console.log('Error on', airplane.liveries[idx], e);
                    setTimeout(() => shootAll(idx + 1), 1);
                });
            }
            window.shootReady = false;
            geofs.togglePause();
            geofs.doPause();
            //shoot("del");
            setTimeout(() => {
            shootAll();
            }, 5000);
            """)
    WebDriverWait(driver, 1200).until(
        lambda d: d.execute_script("return window.shootReady === true;")
    )
    print(f"generated {id}")
    fileid = 0
    while True:
        try:
            print(f"{id}-{fileid}.png")
            shutil.move(f"/home/kolos26/Downloads/{id}-{fileid}.png", f"./thumbs/{id}/{id}-{fileid}.png")
            fileid += 1
        except:
            break


driver.quit()