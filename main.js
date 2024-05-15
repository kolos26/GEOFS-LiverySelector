const githubRepo = 'https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main';

let liveryobj;
let multiplayertexture;
let origHTMLs = {};

(function init() {

    // styles
    appendChild(document.body, 'div').innerHTML = generateStylesHTML();

    // Panel for list
    const listDiv = appendChild(document.querySelector('.geofs-ui-left'), 'div', {
        id: 'listDiv',
        class: 'geofs-list geofs-toggle-panel geofs-livery-list geofs-visible',
        'data-noblur': 'true',
        'data-onshow': '{geofs.initializePreferencesPanel()}',
        'data-onhide': '{geofs.savePreferencesPanel()}'
    });
    listDiv.innerHTML = generateListHTML();

    // Button for panel
    const geofsUiButton = document.querySelector('.geofs-ui-bottom');
    const liveryButton = appendChild(geofsUiButton, 'div', {}, geofs.version >= 3.6 ? 4 : 3);
    liveryButton.innerHTML = generateButtonPanelHTML();

    //remove original buttons
    const origButtons = document.getElementsByClassName('geofs-liveries geofs-list-collapsible-item');
    Object.values(origButtons).forEach(btn => btn.parentElement.removeChild(btn));

    //Load liveries (@todo: consider moving to listLiveries)
    fetch(`${githubRepo}/livery.json`).then(handleLiveryJson);

    // Start multiplayer (WIP)
    //setInterval(updateMultiplayer, 5000);
})();

/**
 * @param {Response} data
 */
function handleLiveryJson(data) {
    liveryobj = data.json();

    // mark aircraft with livery icons
    Object.keys(liveryobj.aircrafts).forEach(aircraftId => {
        const element = document.querySelector(`[data-aircraft='${aircraftId}']`);
        if (!origHTMLs[aircraftId])
            origHTMLs[aircraftId] = element.innerHTML;

        element.innerHTML = origHTMLs[aircraftId] +
            createTag('img', {src: `${githubRepo}/liveryselector-logo-small.svg`, height: '30px'}).outerHTML;
    });
}

/**
 * @returns {object} current aircraft from liveryobj
 */
function getCurrentAircraft() {
    return liveryobj.aircrafts[geofs.aircraft.instance.id];
}

/**
 * Triggers GeoFS API to load texture
 *
 * @param {string[]} texture
 * @param {number[]} index
 * @param {number[]} parts
 */
function loadLivery(texture, index, parts) {
    //change livery
    for (let i = 0; i < texture.length; i++) {
        const model3d = geofs.aircraft.instance.definition.parts[parts[i]]['3dmodel'];
        if (geofs.version == 2.9) {
            geofs.api.Model.prototype.changeTexture(texture[i], index[i], model3d);
        } else {
            geofs.api.changeModelTexture(model3d._model, texture[i], index[i]);
        }
        //change multiplayer texture
        multiplayertexture = texture;
    }
}

/**
 * Load liveries from text input fields
 */
function inputLivery() {
    let airplane = getCurrentAircraft();
    let textures = airplane.liveries[0].texture;
    let inputFields = document.getElementsByName('textureInput');
    if (textures.filter(x => x === textures[0]).length === textures.length) { // the same texture is used for all indexes and parts
        let texture = inputFields[0].value;
        loadLivery(Array(textures.length).fill(texture), airplane.index, airplane.parts);
    } else {
        let texture = [];
        inputFields.forEach(e => texture.push(e.value));
        loadLivery(texture, airplane.index, airplane.parts);
    }
}

function sortList(id) {
    const list = document.getElementById(id);
    let i, switching, b, shouldSwitch;
    switching = true;
    while (switching) {
        switching = false;
        b = list.getElementsByTagName('LI');
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

/**
 * Generate main livery list
 */
function listLiveries() {
    document.getElementById('liverylist').innerHTML = '';

    let airplane = getCurrentAircraft();
    airplane.liveries.forEach(function (e) {
        let listItem = appendChild(document.getElementById('liverylist'), 'li', {
            id: [geofs.aircraft.instance.id, e.name, 'button'].join('_'),
            onpointerenter: "this.style.background='#dedede'",
            onpointerleave: "this.style.background='#ffffff'",
            onclick: () => loadLivery(e.texture, airplane.index, airplane.parts)
        });
        listItem.innerHTML = e.name;
        listItem.style.display = "block";

        appendChild(listItem, 'span', {
            id: [geofs.aircraft.instance.id, e.name].join('_'),
            class: 'fa fa-star nocheck',
            style: 'float: right; padding-top: 15px;',
            onclick: 'star(this)'
        });
    });
    sortList('liverylist');
    loadFavorites();
    sortList('favorites');
    addCustomForm();
}

function loadFavorites() {
    if (localStorage.getItem('favorites') === null) {
        localStorage.favorites = '';
    }
    document.getElementById('favorites').innerHTML = '';
    let list = localStorage.favorites.split(",");
    let airplane = geofs.aircraft.instance.id;
    list.forEach(function (e) {
        if ((airplane == e.slice(0, airplane.length)) && (e.charAt(airplane.length) == '_')) {
            star(document.getElementById(e));
        }
    });
}

function addCustomForm() {
    document.getElementById('customDiv').innerHTML = '';
    const airplane = getCurrentAircraft();
    const textures = airplane.liveries[0].texture;
    const placeholders = airplane.labels;
    if (textures.filter(x => x === textures[0]).length === textures.length) { // the same texture is used for all indexes and parts
        createUploadButton(placeholders[0]);
    } else {
        placeholders.forEach(createUploadButton);
    }
}

function search(text) {
    if (text === "") {
        listLiveries();
    } else {
        var liveries = document.getElementById("liverylist").childNodes;
        liveries.forEach(function (e) {
            const found = e.innerText.toLowerCase().includes(text.toLowerCase());
            e.style.display = found ? 'block' : 'none';
        });
    }
}

/**
 * Mark as favorite
 *
 * @param {HTMLElement} element
 */
function star(element) {
    const e = element.classList;
    const elementId = [element.id, 'favorite'].join('_');
    if (e == "fa fa-star nocheck") {
        const btn = document.getElementById([element.id, 'button'].join('_'));
        const fbtn = appendChild(document.getElementById('favorites'), 'li', {
            id: elementId,
            onclick: btn.getAttribute('onclick')
        });
        fbtn.innerText = btn.innerText;

        let list = localStorage.favorites.split(',');
        list.push(element.id);
        list = [...new Set(list)];
        localStorage.favorites = list;

    } else if (e == "fa fa-star checked") {
        document.getElementById("favorites").removeChild(document.getElementById(elementId));
        let list = localStorage.favorites.split(',');
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

/**
 * @param {string} id
 */
function createUploadButton(id) {
    const customDiv = document.getElementById('customDiv');
    appendChild(customDiv, 'input', {
        type: 'file',
        onchange: 'uploadLivery(this)',
        style: 'marginRight = -120px;'
    });
    appendChild(customDiv, 'input', {
        type: 'text',
        name: 'textureInput',
        class: 'mdl-textfield__input address-input',
        placeholder: id,
        id: id
    });
    appendChild(customDiv, 'br');
}

function uploadLivery(e) {
    var form = new FormData();
    form.append("image", e.files[0]);

    var settings = {
        "url": `https://api.imgbb.com/1/upload?key=${localStorage.imgbbAPIKEY}`,
        "method": 'POST',
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

/**
 * disabled for now @todo: ask whats this about
 */
function updateMultiplayer() {
    Object.values(multiplayer.visibleUsers).forEach(function (e) {
        geofs.api.changeModelTexture(multiplayer.visibleUsers[e.id].model, multiplayertexture, 0);
    });
}

/******************* Utilities *********************/

/**
 * Create tag with <name attributes=...
 *
 * @param {string} name
 * @param {object} attributes
 * @returns {HTMLElement}
 */
function createTag(name, attributes = {}) {
    const el = document.createElement(name);
    Object.keys(attributes).forEach(k => el.setAttribute(k, attributes[k]));

    return el;
}

/**
 * Creates a new element <tagName attributes=...
 * appends to parent and returns the child for later access
 *
 * @param {HTMLElement} parent
 * @param {string} tagName
 * @param {object} attributes
 * @param {number} pos insert in Nth position (default append)
 * @returns {HTMLElement}
 */
function appendChild(parent, tagName, attributes = {}, pos=-1) {
    const child = createTag(tagName, attributes);
    if (pos < 0) {
        parent.appendChild(child);
    } else {
        parent.insertBefore(child, parent.children[pos]);
    }

    return child;
}

/******************* HTML & CSS Templates *********************/

/**
 * @returns {string} HTML template for main panel
 */
function generateListHTML() {
    return `
        <h3><img src="${githubRepo}/liveryselector-logo.svg" width="95%" title="LiverySelector" style="display: block; margin-left: auto; margin-right: auto;"/></h3>
        
        <div class="mdl-textfield mdl-js-textfield geofs-stopMousePropagation geofs-stopKeyupPropagation" style="width: 100%; padding-right: 86px;">
            <input class="mdl-textfield__input address-input" type="text" placeholder="Search liveries" onkeydown="search(this.value)" id="searchlivery">
            <label class="mdl-textfield__label" for="searchlivery">Search liveries</label>
        </div>
        
        <h6>Favorite liveries</h6>
        <ul id="favorites" class="geofs-list geofs-visible"></ul>
        
        <h6>Available liveries</h6>
        <ul id="liverylist" class=" geofs-list geofs-visible"></ul>
        
        <h6 style="margin-bottom: -10px">Load external livery</h6>
        <div id="customDiv" class="mdl-textfield mdl-js-textfield geofs-stopMousePropagation geofs-stopKeyupPropagation" style="width: 100%; padding-right: 86px;"></div>
        
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="inputLivery()">Load livery</button>
`;
}

/**
 * @returns {HTMLElement} HTML template for main menu livery button
 */
function generateButtonPanelHTML() {
    const liveryButton = createTag('button', {title: 'Change livery',
        id: 'liverybutton',
        class: 'mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly',
        onclick: listLiveries(),
        'data-toggle-panel': '.geofs-livery-list',
        'data-tooltip-classname': 'mdl-tooltip--top',
        'data-upgraded': ",MaterialButton"
    });
    liveryButton.innerHTML = 'LIVERY' + createTag('img', {src: `${githubRepo}/liveryselector-logo-small.svg`, height: "30px"}).outerHTML;

    return liveryButton;
}

/**
 * @returns {string} HTML template
 */
function generateStylesHTML() {
    return `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/><style>
        .checked {
            text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;
            color: rgb(255, 193, 7);
            display: inline;
            text align: right;
            cursor: pointer;
        }
        
        .nocheck {
            text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;
            color: white;
            display: inline;
            text align: right;
            cursor: pointer;
        }
        
        input[type="file"] {
            color: transparent;
        }
        
        input[type="file"]::-webkit-file-upload-button {
            visibility: hidden;
        }
        
        input[type="file"]::before {
            content: "UPLOAD IMAGE";
            display: inline-block;
            background-color: rgb(83, 109, 254);
            margin-right: -120px;
            outline: none;
            user-select: none;
            -webkit-user-select: none;
            cursor: pointer;
            color: white;
            height: 36px;
            padding-top: 12px;
            text-align: center;
            cursor: pointer;
            font-family: "Roboto", "Helvetica", "Arial", sans-serif;
            font-size: 14px;
            font-weight: 500;
            width: 120px;
            border-radius: 2px;
        }
        
        input[name="textureInput"] {
            color: white;
            font-size: 14px;
            border-radius: 2px;
            font-family: "Roboto", "Helvetica", "Arial", sans-serif;
            height: 36px;
            display: inline-block;
            background-color: #729e8f;
            border: none;
            width: 65%;
            keyboard-events: none;
        }
        
        input[name="textureInput"]::placeholder {
            color: color: rgb(252, 252, 252);
            font-size: 14px;
        }
      </style>`;
}