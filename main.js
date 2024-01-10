let liveryobj;
let panelopen = 0;
let multiplayertexture

//init

async function init(){

    // Panel for list
    
    let listDiv = document.createElement("div");
    listDiv.setAttribute("id", "listDiv")
    listDiv.setAttribute("data-noblur", "true");
    listDiv.setAttribute("data-onshow", "{geofs.initializePreferencesPanel()}");
    listDiv.setAttribute("data-onhide", "{geofs.savePreferencesPanel()}");
    listDiv.setAttribute("class", "geofs-list geofs-toggle-panel geofs-livery-list geofs-visible")
    listDiv.innerHTML = '<h3><img src="https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/476df50f652cad420b5cd09684d65b7cf0e447c9/liveryselector-logo.svg" width="95%" title="LiverySelector" style="display: block; margin-left: auto; margin-right: auto;"/></h3><div class="mdl-textfield mdl-js-textfield geofs-stopMousePropagation geofs-stopKeyupPropagation" style="width: 100%; padding-right: 86px;"><input class="mdl-textfield__input address-input" type="text" placeholder="Search liveries" onkeydown="search(this.value)" id="searchlivery"><label class="mdl-textfield__label" for="searchlivery">Search liveries</label></div><h6>Favorite liveries</h6><ul id="favorites" class="geofs-list geofs-visible"></ul><h6>Available liveries</h6><ul id="liverylist" class=" geofs-list geofs-visible"></ul><h6 style="margin-bottom: -10px">Load external livery</h6><div id="customDiv" class="mdl-textfield mdl-js-textfield geofs-stopMousePropagation geofs-stopKeyupPropagation" style="width: 100%; padding-right: 86px;"></div><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="inputLivery()">Load livery</button>'
    document.getElementsByClassName("geofs-ui-left")[0].appendChild(listDiv);

    // Button for panel
    let buttonDiv = document.createElement("div");
    buttonDiv.innerHTML = '<button class="mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly" data-toggle-panel=".geofs-livery-list" data-tooltip-classname="mdl-tooltip--top" id="liverybutton" tabindex="0" data-upgraded=",MaterialButton" onclick="listLiveries()" title="Change livery">LIVERY<img src="https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/0230cb5c8438a70b770ff56fed81dfec6f4e9014/liveryselector-logo-small.svg" height="30px"/></button>'
    document.body.appendChild(buttonDiv);
    let element = document.getElementById("liverybutton");
    if (geofs.version >= 3.6){
        document.getElementsByClassName("geofs-ui-bottom")[0].insertBefore(element, document.getElementsByClassName("geofs-ui-bottom")[0].children[4]);
    } else {
        document.getElementsByClassName("geofs-ui-bottom")[0].insertBefore(element, document.getElementsByClassName("geofs-ui-bottom")[0].children[3]);
    }

    // Div for form loading custom liveries
    let customDiv = document.getElementById("customDiv");

    let styles = document.createElement("div");
    styles.innerHTML = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/><style>.checked {text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;color: rgb(255,193,7); display: inline; text align: right; cursor: pointer;}.nocheck {text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;color: white; display: inline; text align: right; cursor: pointer;}input[type="file"] {color: transparent;}input[type="file"]::-webkit-file-upload-button {visibility: hidden;}input[type="file"]::before {content: "UPLOAD IMAGE";display: inline-block;background-color: rgb(83,109,254);margin-right: -120px;outline: none;user-select: none;-webkit-user-select: none;cursor: pointer;color: white;height: 36px;padding-top: 12px;text-align:center;cursor: pointer;font-family: "Roboto","Helvetica","Arial",sans-serif;font-size: 14px;font-weight: 500;width:120px;border-radius: 2px;}input[name="textureInput"]{color: white;font-size: 14px;border-radius: 2px;font-family: "Roboto","Helvetica","Arial",sans-serif;height: 36px;display: inline-block;background-color: #729e8f;border: none;width: 65%;keyboard-events:none;}input[name="textureInput"]::placeholder{color: color: rgb(252, 252, 252);font-size: 14px;}</style>';
    document.body.appendChild(styles);

    //Load liveries


    await fetch("https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/livery.json").then(res => res.json()).then(data => liveryobj = data)

    //add button for pa28
    let pa28 = document.createElement("li");
    pa28.setAttribute("data-aircraft", "23");
    pa28.innerHTML = '<img src="/images/planes/pa28.png"> Piper PA-28 161 Warrior II';
    document.querySelectorAll("[data-aircraft='24']")[0].parentNode.insertBefore(pa28, document.querySelectorAll("[data-aircraft='24']")[0]);

    //remove original buttons

    Object.values(document.getElementsByClassName("geofs-liveries geofs-list-collapsible-item")).forEach(function(e){
        e.parentElement.removeChild(e);
    })

    Object.keys(liveryobj.aircrafts).forEach(function(e){
        document.querySelectorAll("[data-aircraft='"+ e +"']")[0].innerHTML = document.querySelectorAll("[data-aircraft='"+ e +"']")[0].innerHTML + '<img src="https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/0230cb5c8438a70b770ff56fed81dfec6f4e9014/liveryselector-logo-small.svg" height="30px"/>'
    });


}

function loadLivery(texture, index, parts){
    //change livery
    //console.log(texture.length);
    for(let i = 0; i<texture.length; i++){
        //console.log(i)
        //console.log(texture[i]+"-"+mode[i]+"-"+parts[i]);
        if (geofs.version == 2.9) {
            geofs.api.Model.prototype.changeTexture(texture[i], index[i], geofs.aircraft.instance.definition.parts[parts[i]]["3dmodel"]);
            } else {
            geofs.api.changeModelTexture(geofs.aircraft.instance.definition.parts[parts[i]]["3dmodel"]._model, texture[i], index[i]);
        }
        //change multiplayer texture
        multiplayertexture = texture;
    };
}

function inputLivery(){
    let airplane = geofs.aircraft.instance.id;
    let index = liveryobj.aircrafts[airplane].index;
    let parts = liveryobj.aircrafts[airplane].parts;
    let textures = liveryobj.aircrafts[airplane].liveries[0].texture;
    if (textures.filter(x => x=== textures[0]).length === textures.length) { // the same texture is used for all indexes and parts
        let texture = document.getElementsByName("textureInput")[0].value;
        loadLivery(Array(textures.length).fill(texture), index, parts);
    } else {
        let texture = [];
        document.getElementsByName("textureInput").forEach(function(e){
            texture.push(e.value)
        });
        loadLivery(texture, index, parts);
    }
}

function sortList(id) {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById(id);
    switching = true;
    while (switching) {
    switching = false;
    b = list.getElementsByTagName("LI");
    for (i = 0; i < (b.length - 1); i++) {
        shouldSwitch = false;
        if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
        }
    }
    if (shouldSwitch) {
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
    }
    }
}

function listLiveries(){
    document.getElementById("liverylist").innerHTML = "";

    let airplane = geofs.aircraft.instance.id;

    let index = liveryobj.aircrafts[airplane].index;
    let parts = liveryobj.aircrafts[airplane].parts;

    liveryobj.aircrafts[airplane].liveries.forEach(function(e){
        var dropdown = document.createElement('li');
//        dropdown.setAttribute("style", "display: table;")
        dropdown.setAttribute("onpointerenter", "this.style.background='#dedede'");
        dropdown.setAttribute("onpointerleave", "this.style.background='#ffffff'");
        dropdown.innerHTML = e.name;
        let star = document.createElement("span");
        star.setAttribute("class", "fa fa-star nocheck");
        star.setAttribute("id", geofs.aircraft.instance.id + "_" + e.name);
        star.setAttribute("onclick", "star(this)");
        star.setAttribute("style", "float: right; padding-top: 15px;")
        dropdown.appendChild(star);
        dropdown.style.display = "block";
        dropdown.setAttribute("id", geofs.aircraft.instance.id + "_" + e.name + "_button");
        document.getElementById("liverylist").appendChild(dropdown);
        dropdown.setAttribute("onclick", 'loadLivery(["'+ e.texture.toString().replaceAll(',', '","') +'"], ['+ index +"], ["+ parts +"])")
    })
    sortList("liverylist");
    loadFavorites();
    sortList("favorites");
    addCustomForm();
}

function search(text){
    //console.log("search");
    if (text === ""){
        listLiveries();
    }

    else {
        var liveries = document.getElementById("liverylist").childNodes;
        liveries.forEach(function(e){
            if (e.innerText.toLowerCase().includes(text.toLowerCase())){
                e.style.display = "block";
            }
            else {
                e.style.display = "none";
            }
        })
    }
}

function star(element){
    let e = element.classList;
    //console.log(e);
    //console.log("clicked");
    if (e == "fa fa-star nocheck"){
        //console.log("checked");
        let btn = document.getElementById(element.id +"_button");
        let fbtn = document.createElement("li");
        fbtn.innerText = btn.innerText;
        fbtn.setAttribute("id", element.id + "_favorite");
        fbtn.setAttribute("onclick", btn.getAttribute('onclick'));
        document.getElementById("favorites").appendChild(fbtn);
        let list = localStorage.favorites.split(",");
        list.push(element.id);
        list = [...new Set(list)]
        localStorage.favorites = list;

    }
    else if (e == "fa fa-star checked"){
        //console.log("checked out");
        document.getElementById("favorites").removeChild(document.getElementById(element.id + "_favorite"));
        let list = localStorage.favorites.split(",");
        let index = list.indexOf(element.id);
        if (index !== -1) {
            list.splice(index, 1);
        }
        localStorage.favorites = list;
    }
    //style animation
    e.toggle("checked");
    e.toggle("nocheck");
}

function loadFavorites(){
    document.getElementById("favorites").innerHTML = "";
    let list = localStorage.favorites.split(",");
    //console.log(list);
    let airplane =  geofs.aircraft.instance.id;
    list.forEach(function(e){
        //console.log(e.slice(0, airplane.length));
        if ((airplane == e.slice(0, airplane.length)) && (e.charAt(airplane.length) == "_")){
            star(document.getElementById(e));
            //console.log(document.getElementById("favorites").innerHTML);
        }
    })
}

function addCustomForm(){
    customDiv.innerHTML = "";
    let airplane = geofs.aircraft.instance.id;
    let textures = liveryobj.aircrafts[airplane].liveries[0].texture;
    let placeholders = liveryobj.aircrafts[airplane].labels;
    if (textures.filter(x => x=== textures[0]).length === textures.length) { // the same texture is used for all indexes and parts
        let uploadButton = document.createElement("input");
        uploadButton.setAttribute("type", "file");
        uploadButton.setAttribute("onchange", "uploadLivery(this)");
        uploadButton.style.marginRight = "-120px";
        customDiv.appendChild(uploadButton);
        let textureInput = document.createElement("input");
        textureInput.setAttribute("type", "text");
        textureInput.setAttribute("name", "textureInput");
        textureInput.setAttribute("class", "mdl-textfield__input address-input");
        textureInput.setAttribute("placeholder", placeholders[0]);
        textureInput.setAttribute("id", placeholders[0]);
        customDiv.appendChild(textureInput);
        customDiv.appendChild(document.createElement("br"));
    } else {
        placeholders.forEach(function(e){
            let uploadButton = document.createElement("input");
            uploadButton.setAttribute("type", "file");
            uploadButton.setAttribute("onchange", "uploadLivery(this)");
            uploadButton.style.marginRight = "-120px";
            customDiv.appendChild(uploadButton);
            let textureInput = document.createElement("input");
            textureInput.setAttribute("type", "text");
            textureInput.setAttribute("name", "textureInput");
            textureInput.setAttribute("class", "mdl-textfield__input address-input");
            textureInput.setAttribute("placeholder", e);
            textureInput.setAttribute("id", e);
            customDiv.appendChild(textureInput);
            customDiv.appendChild(document.createElement("br"));
        });
    }
}

function uploadLivery(e){
    var form = new FormData();
    form.append("image", e.files[0]);

    var settings = {
        "url": "https://api.imgbb.com/1/upload?key=" + localStorage.imgbbAPIKEY,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };


    $.ajax(settings).done(function (response) {
        var jx = JSON.parse(response);
        console.log(jx.data.url);
        e.nextSibling.value = jx.data.url;
    });
}

function updateMultiplayer(){
    Object.values(multiplayer.visibleUsers).forEach(function(e){
        geofs.api.changeModelTexture(multiplayer.visibleUsers[e.id].model, multiplayertexture, 0);
        })
}

init();

let refreshMultiplayer = setInterval(function(){  
    updateMultiplayer();
}, 5000);