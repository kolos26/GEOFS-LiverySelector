let liveryobj;
let panelopen = 0;



async function init(){

    //init class="geofs-list geofs-aircraft-list geofs-visible
    
    let listdiv = document.createElement("div");
    listdiv.innerHTML = '<ul data-noblur="true" data-onshow="{geofs.initializePreferencesPanel()}" data-onhide="{geofs.savePreferencesPanel()}" class="geofs-list geofs-toggle-panel geofs-autoland-list geofs-preferences"><ul id="liverylist" class="geofs-list geofs-visible"></ul><input type="text" placeholder="Search liveries" onkeydown="search(this.value)" /></ul>'

    let sidePanel = document.getElementsByClassName("geofs-ui-left")[0]
    document.getElementsByClassName("geofs-ui-left")[0].appendChild(listdiv)

    // Toggle Button Code
    let buttonDiv = document.createElement("div");
    buttonDiv.innerHTML = '<button class="mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly" data-toggle-panel=".geofs-autoland-list" data-tooltip-classname="mdl-tooltip--top" id="liverybutton" tabindex="0" data-upgraded=",MaterialButton" onclick="listLiveries()">LIVERY</button>' //onclick="listLiveries()"
    document.body.appendChild(buttonDiv);
    document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(buttonDiv);
    let element = document.getElementById("liverybutton");
    document.getElementsByClassName("geofs-ui-bottom")[0].insertBefore(element, buttonDiv);

    let styles = document.createElement("div");
    styles.innerHTML = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/><style>.checked {text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;color: rgb(255,193,7); display: inline; text align: right; cursor: pointer;}.nocheck {text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;color: white; display: inline; text align: right; cursor: pointer;}</style>';
    document.body.appendChild(styles);

    //Load liveries


    await fetch("https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/livery.json")
        .then(res => res.json())
        .then(data => liveryobj = data)

}

init();

function sortList() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("liverylist");
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

    let airplane = geofs.aircraft.instance.id
    let mode = liveryobj.aircrafts[airplane].mode
    let star = document.createElement("span");
    star.setAttribute("class", "fa fa-star nocheck");

    liveryobj.aircrafts[airplane].liveries.forEach(function(e){
        var dropdown = document.createElement('li');
        dropdown.innerHTML = e.name;
        star.setAttribute("id", e.name);
        dropdown.style.display = "block";
        dropdown.appendChild(star);
        document.getElementById("liverylist").appendChild(dropdown);
        if (geofs.version == 2.9) {
            dropdown.setAttribute("onclick", 'geofs.api.Model.prototype.changeTexture("' + e.texture + '", '+ mode +', geofs.aircraft.instance.definition.parts[0]["3dmodel"])');
            }
        if (geofs.version == 3.31) {
            dropdown.setAttribute("onclick", 'geofs.api.changeModelTexture(geofs.aircraft.instance.definition.parts[0]["3dmodel"]._model, "' + e.texture + '", '+ mode +')');
        }
    })
    sortList();
}

function search(text){
    console.log("search");
    if (text === ""){
        listLiveries();
    }

    else {
        var liveries = document.getElementById("liverylist").childNodes;
        liveries.forEach(function(e){
            if (e.innerText.includes(text)){
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
    console.log(e);
    console.log("clicked");
    if (e == "fa fa-star nocheck"){
        console.log("checked");
        //save to list here
    }
    else if (e == "fa fa-star checked"){
        console.log("checked out");
        //remove from list here
    }
    //style animation
    e.toggle("checked");
    e.toggle("nocheck");
}