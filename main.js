let liveryobj;
let panelopen = 0;



async function init(){

    //init class="geofs-list geofs-aircraft-list geofs-visible
    
    let listdiv = document.createElement("div");
    listdiv.innerHTML = '<ul data-noblur="true" data-onshow="{geofs.initializePreferencesPanel()}" data-onhide="{geofs.savePreferencesPanel()}" class="geofs-list geofs-toggle-panel geofs-autoland-list geofs-preferences"><ul id="liverylist" class="geofs-list geofs-visible"></ul></ul>'

    let sidePanel = document.getElementsByClassName("geofs-ui-left")[0]
    document.getElementsByClassName("geofs-ui-left")[0].appendChild(listdiv)

    // Toggle Button Code
    let buttonDiv = document.createElement("div");
    buttonDiv.innerHTML = '<button class="mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly" data-toggle-panel=".geofs-autoland-list" data-tooltip-classname="mdl-tooltip--top" id="liverybutton" tabindex="0" data-upgraded=",MaterialButton" onclick="listLiveries()">LIVERY</button>' //onclick="listLiveries()"
    document.body.appendChild(buttonDiv);
    document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(buttonDiv);
    let element = document.getElementById("liverybutton");
    document.getElementsByClassName("geofs-ui-bottom")[0].insertBefore(element, buttonDiv);

    //Load liveries


    await fetch("https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/livery.json?token=GHSAT0AAAAAABXBAM6UX3WPXPYDUKGXLU62YXCPCNQ")
        .then(res => res.json())
        .then(data => liveryobj = data)

}

init();


function listLiveries(){
    document.getElementById("liverylist").innerHTML = "";

    let airplane = geofs.aircraft.instance.id
    let mode = liveryobj.aircrafts[airplane].mode

    liveryobj.aircrafts[airplane].liveries.forEach(function(e){
        var dropdown = document.createElement('li');
        dropdown.innerHTML = e.name;
        document.getElementById("liverylist").appendChild(dropdown);
        if (geofs.version == 2.9) {
            dropdown.setAttribute("onclick", 'geofs.api.Model.prototype.changeTexture("' + e.texture + '", '+ mode +', geofs.aircraft.instance.definition.parts[0]["3dmodel"])');
            }
        if (geofs.version == 3.31) {
            dropdown.setAttribute("onclick", 'geofs.api.changeModelTexture(geofs.aircraft.instance.definition.parts[0]["3dmodel"]._model, "' + e.texture + '", '+ mode +')');
        }
    })
}
