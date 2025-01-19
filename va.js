function init(){
    vadiv = document.createElement("div");
    vadiv.id = "vadiv"
    vadiv.innerHTML = '<h5>Your Virtual Airlines<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="addAirline()" style="float: right; color: white;">+ Add airline</button></h5><ul id="valist" class=" geofs-list geofs-visible"></ul>'
    document.getElementById("liverylist").parentNode.appendChild(vadiv)
    links = localStorage.links.split(",");
    links.forEach(async function(e){
        await fetch("https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main/livery.json").then(res => res.json()).then(data => valiveryobj[e] = data)
    });
}

function loadAirline(name){
    valist = document.createElement("ul");
    document.getElementById("valist").appendChild(valist);
}

function addAirline(){
    links.append(prompt("Paste url to livery.json here!"));
    localStorage.links = links;
}



init();