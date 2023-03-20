let liveryobj;
let panelopen = 0;
let multiplayertexture

//init

async function init(){

    // Panel for list
    
    let listdiv = document.createElement("div");
    listdiv.innerHTML = '<ul data-noblur="true" data-onshow="{geofs.initializePreferencesPanel()}" data-onhide="{geofs.savePreferencesPanel()}" class="geofs-list geofs-toggle-panel geofs-autoland-list geofs-preferences"><h3><img src="https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/476df50f652cad420b5cd09684d65b7cf0e447c9/liveryselector-logo.svg" width="95%" title="Livery selector" style="display: block; margin-left: auto; margin-right: auto;"/></h3><div class="mdl-textfield mdl-js-textfield geofs-stopMousePropagation geofs-stopKeyupPropagation" style="width: 100%; padding-right: 86px;"><input class="mdl-textfield__input address-input" type="text" id="address" placeholder="Search liveries" onkeydown="search(this.value)" id="searchlivery"><label class="mdl-textfield__label" for="searchlivery">Search liveries</label></div><h6>Favorite liveries</h6><ul id="favorites" class="geofs-list geofs-visible"></ul><h6>Available liveries</h6><ul id="liverylist" class=" geofs-list geofs-visible"></ul></ul>'

    document.getElementsByClassName("geofs-ui-left")[0].appendChild(listdiv);

    // Button for panel
    let buttonDiv = document.createElement("div");
    buttonDiv.innerHTML = '<button class="mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly" data-toggle-panel=".geofs-autoland-list" data-tooltip-classname="mdl-tooltip--top" id="liverybutton" tabindex="0" data-upgraded=",MaterialButton" onclick="listLiveries()" title="Change livery">LIVERY<img src="https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/0230cb5c8438a70b770ff56fed81dfec6f4e9014/liveryselector-logo-small.svg" height="30px"/></button>'
    document.body.appendChild(buttonDiv);
    let element = document.getElementById("liverybutton");
    document.getElementsByClassName("geofs-ui-bottom")[0].insertBefore(element, document.getElementsByClassName("geofs-ui-bottom")[0].children[3]);

    let styles = document.createElement("div");
    styles.innerHTML = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/><style>.checked {text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;color: rgb(255,193,7); display: inline; text align: right; cursor: pointer;}.nocheck {text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;color: white; display: inline; text align: right; cursor: pointer;}</style>';
    document.body.appendChild(styles);

    //Load liveries


    await fetch("https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/livery.json").then(res => res.json()).then(data => liveryobj = data)

    //remove original buttons

    document.querySelectorAll('[data-livery]').forEach(function(e){
        e.parentElement.removeChild(e);
    })

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

function updateMultiplayer(){
    Object.values(multiplayer.visibleUsers).forEach(function(e){
        geofs.api.changeModelTexture(multiplayer.visibleUsers[e.id].model, multiplayertexture, 0);
        })
}

init();

let refreshMultiplayer = setInterval(function(){  
    updateMultiplayer();
}, 5000)