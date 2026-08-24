from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from time import sleep
import shutil
import json

with open("main.js", "r") as file:
    LSscript = file.read()

with open("./thumbs/thumbs.json", "r") as data:
    thumb_data = json.loads(data.read())

with open("./livery.json", "r") as data:
    livery_json = json.loads(data.read())

#setup
chrome_options = webdriver.ChromeOptions()
prefs = {'profile.default_content_setting_values.automatic_downloads': 1}
chrome_options.add_experimental_option("prefs", prefs)
chrome_options.add_argument("--mute-audio")
chrome_options.add_argument("--headless=new")
driver = webdriver.Chrome(options = chrome_options)
driver.implicitly_wait(15)
driver.set_window_size(3200, 2400)
driver.get("https://www.geo-fs.com/geofs.php?la=45&lo=-15&al=1500&h=70")
driver.find_element(by=By.CLASS_NAME, value="fc-button-label").click()
driver.find_element(by=By.XPATH, value="/html/body/div[1]/div[3]/a").click()
sleep(5)
print("ad script")
driver.execute_script("document.getElementsByClassName('geofs-adbanner')[0].remove()")
sleep(5)
print("LS script")
driver.execute_script(LSscript)
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
WebDriverWait(driver, 60).until(
        lambda d: d.execute_script("return window.setupReady === true;")
    )

for id in thumb_data:
    if len(livery_json["aircrafts"][id]["liveries"]) > thumb_data[id]["idx"]:
        print(f"get plane {id}")
        driver.execute_script(f"geofs.aircraft.instance.change({id})")
        sleep(10)
        print("prop script")
        driver.execute_script(thumb_data[id]["setup"])
        sleep(5)
        driver.execute_script("geofs.resetFlight()")
        driver.switch_to.alert.accept()
        driver.execute_script("geofs.doPause()")
        sleep(5)
        print("camera script")
        driver.execute_script(thumb_data[id]["camera"])
        sleep(5)
        print("shoot script")
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
                        ctx.fillText("PLACEHOLDER", 200, 440);
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
                shootAll("""+str(thumb_data[id]["idx"])+""");
                }, 5000);
                """)
        WebDriverWait(driver, 3600).until(
            lambda d: d.execute_script("return window.shootReady === true;")
        )
        print(f"generated {id}")
        fileid = thumb_data[id]["idx"]
        while True:
            try:
                print(f"{id}-{fileid}.png")
                shutil.move(f"/home/kolos26/Downloads/{id}-{fileid}.png", f"./thumbs/{id}/{id}-{fileid}.png")
                fileid += 1
            except:
                thumb_data[id]["idx"] = fileid
                with open("./thumbs/thumbs.json", "w") as data:
                    data.write(json.dumps(thumb_data))
                break
    else:
        print(f"skip plane {id}")


driver.quit()
with open("./thumbs/thumbs.json", "w") as data:
    data.write(json.dumps(thumb_data))