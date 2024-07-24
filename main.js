const githubRepo = 'https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main';

let liveryobj;
let multiplayertexture;
let origHTMLs = {};
let uploadHistory = JSON.parse(localStorage.lsUploadHistory || '{}');

(function init() {

    // styles
    fetch(`${githubRepo}/styles.css`).then(async data => {
        const styleTag = createTag('style',{type:'text/css'});
        styleTag.innerHTML = await data.text();
        document.head.appendChild(styleTag);
    });
    appendNewChild(document.head, 'link', {rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'});

    // Panel for list
    const listDiv = appendNewChild(document.querySelector('.geofs-ui-left'), 'div', {
        id: 'listDiv',
        class: 'geofs-list geofs-toggle-panel livery-list geofs-visible',
        'data-noblur': 'true',
        'data-onshow': '{geofs.initializePreferencesPanel()}',
        'data-onhide': '{geofs.savePreferencesPanel()}'
    });
    listDiv.innerHTML = generateListHTML();

    // Button for panel
    const geofsUiButton = document.querySelector('.geofs-ui-bottom');
    const insertPos = geofs.version >= 3.6 ? 4 : 3;
    geofsUiButton.insertBefore(generatePanelButtonHTML(), geofsUiButton.children[insertPos]);

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
async function handleLiveryJson(data) {
    liveryobj = await data.json();

    // mark aircraft with livery icons
    Object.keys(liveryobj.aircrafts).forEach(aircraftId => {
        const element = document.querySelector(`[data-aircraft='${aircraftId}']`);
        // save original HTML for later use (reload, aircraft change, etc..)
        if (!origHTMLs[aircraftId]) {
            origHTMLs[aircraftId] = element.innerHTML;
        }

        // use orig HTML to concatenate so theres only ever one icon
        element.innerHTML = origHTMLs[aircraftId] +
            createTag('img', {src: `${githubRepo}/liveryselector-logo-small.svg`, height: '30px'}).outerHTML;
    });
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
        } else if (geofs.version >= 3.0 && geofs.version <= 3.7) {
            geofs.api.changeModelTexture(model3d._model, texture[i], index[i]);
        } else {
            geofs.api.changeModelTexture(model3d._model, texture[i], {index:index[i]});
        }
        //change multiplayer texture
        multiplayertexture = texture;
    }
}

/**
 * Load liveries from text input fields
 */
function inputLivery() {
    const airplane = getCurrentAircraft();
    const textures = airplane.liveries[0].texture;
    const inputFields = document.getElementsByName('textureInput');
    if (textures.filter(x => x === textures[0]).length === textures.length) { // the same texture is used for all indexes and parts
        const texture = inputFields[0].value;
        loadLivery(Array(textures.length).fill(texture), airplane.index, airplane.parts);
    } else {
        const texture = [];
        inputFields.forEach(e => texture.push(e.value));
        loadLivery(texture, airplane.index, airplane.parts);
    }
}

/**
 * Submit livery for review
 */
function submitLivery() {
    const airplane = getCurrentAircraft();
    const textures = airplane.liveries[0].texture;
    const inputFields = document.getElementsByName('textureInput');
    const formFields = {};
    document.querySelectorAll('.livery-submit input').forEach(f => formFields[f.id.replace('livery-submit-','')] = f);
    if (!localStorage.liveryDiscordId || localStorage.liveryDiscordId.length < 6) {
        return alert('Invalid Discord User id!');
    }
    if (formFields.liveryname.value.trim().length < 3) {
        return alert('Invalid Livery Name!');
    }
    if (!formFields['confirm-perms'].checked || !formFields['confirm-legal'].checked) {
        return alert('Confirm all checkboxes!');
    }
    const json = {
        name: formFields.liveryname.value.trim(),
        credits: '',
        texture: []
    };
    if (!json.name || json.name.trim()=='') {
        return;
    }
    const hists = [];
    const embeds = [];
    inputFields.forEach((f,i) => {
        f.value = f.value.trim();
        if (f.value.match(/^https:\/\/.+/i)) {
            const hist = Object.values(uploadHistory).find(o => o.url == f.value);
            if (!hist) {
                return alert('Only self-uploaded imgbb links work for submitting!');
            }
            if (hist.expiration > 0) {
                return alert('Can\' submit expiring links! DISABLE "Expire links after one hour" option and re-upload texture:\n' + airplane.labels[i]);
            }
            const embed = {
                title: airplane.labels[i] + ' (' + (Math.ceil(hist.size/1024/10.24)/100) + 'MB, '+hist.width +'x' + hist.height +')',
                description: f.value,
                image: { url: f.value },
                fields: [
                    { name: 'Timestamp', value: new Date(hist.time*1e3), inline: true },
                    { name: 'File ID', value: hist.id, inline: true },
                ]
            };
            if (hist.submitted) {
                if (!confirm('The following texture was already submitted:\n' + f.value + '\nContinue anyway?')) {
                    return;
                }
                embed.fields.push({ name: 'First submitted', value: new Date(hist.submitted*1e3) });
            }
            embeds.push(embed);
            hists.push(hist);
            json.texture.push(f.value);
        } else {
            json.texture.push(textures[i]);
        }
    });
    if (!embeds.length)
        return alert('Nothing to submit, upload images first!');

    let content = [
        `Livery upload by <@${localStorage.liveryDiscordId}>`,
        `__Plane:__ \`${geofs.aircraft.instance.id}\` ${geofs.aircraft.instance.aircraftRecord.name}`,
        `__Livery Name:__ \`${json.name}\``,
        '```json\n' + JSON.stringify(json, null, 2) + '```'
    ];

    fetch(atob(liveryobj.dapi), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({content: content.join('\n'), embeds })
    }).then(res => {
        hists.forEach(hist => {
            hist.submitted = hist.submitted || Math.round(new Date()/1000);
        });
        localStorage.lsUploadHistory = JSON.stringify(uploadHistory);
    });
}

function sortList(id) {
    const list = domById(id);
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
    domById('liverylist').innerHTML = '';

    const airplane = getCurrentAircraft();
    airplane.liveries.forEach(function (e) {
        let listItem = appendNewChild(domById('liverylist'), 'li', {
            id: [geofs.aircraft.instance.id, e.name, 'button'].join('_'),
            class: 'livery-list-item'
        });
        listItem.onclick = () => loadLivery(e.texture, airplane.index, airplane.parts);
        listItem.innerHTML = e.name;
        if (e.credits && e.credits.length) {
            listItem.innerHTML += `<small>by ${e.credits}</small>`;
        }

        appendNewChild(listItem, 'span', {
            id: [geofs.aircraft.instance.id, e.name].join('_'),
            class: 'fa fa-star nocheck',
            onclick: 'LiverySelector.star(this)'
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
    domById('favorites').innerHTML = '';
    const list = localStorage.favorites.split(',');
    const airplane = geofs.aircraft.instance.id;
    list.forEach(function (e) {
        if ((airplane == e.slice(0, airplane.length)) && (e.charAt(airplane.length) == '_')) {
            star(domById(e));
        }
    });
}

function addCustomForm() {
    document.querySelector('#livery-custom-tab-upload .upload-fields').innerHTML = '';
    document.querySelector('#livery-custom-tab-direct .upload-fields').innerHTML = '';
    const airplane = getCurrentAircraft();
    const textures = airplane.liveries[0].texture;
    const placeholders = airplane.labels;
    if (textures.filter(x => x === textures[0]).length === textures.length) { // the same texture is used for all indexes and parts
        createUploadButton(placeholders[0]);
        createDirectButton(placeholders[0]);
    } else {
        placeholders.forEach((placeholder,i)=>{
            createUploadButton(placeholder);
            createDirectButton(placeholder,i);
        });
    }
    // click first tab to refresh button status
    document.querySelector('.livery-custom-tabs li').click();
}

function search(text) {
    if (text === '') {
        listLiveries();
    } else {
        const liveries = domById('liverylist').childNodes;
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
    if (e == 'fa fa-star nocheck') {
        const btn = domById([element.id, 'button'].join('_'));
        const fbtn = appendNewChild(domById('favorites'), 'li', { id: elementId, class: 'livery-list-item' });
        fbtn.onclick = btn.onclick;
        fbtn.innerText = btn.firstChild.data;

        let list = localStorage.favorites.split(',');
        list.push(element.id);
        list = [...new Set(list)];
        localStorage.favorites = list;

    } else if (e == 'fa fa-star checked') {
        domById('favorites').removeChild(domById(elementId));
        const list = localStorage.favorites.split(',');
        const index = list.indexOf(element.id);
        if (index !== -1) {
            list.splice(index, 1);
        }
        localStorage.favorites = list;
    }
    //style animation
    e.toggle('checked');
    e.toggle('nocheck');
}

/**
 * @param {string} id
 */
function createUploadButton(id) {
    const customDiv = document.querySelector('#livery-custom-tab-upload .upload-fields');
    appendNewChild(customDiv, 'input', {
        type: 'file',
        onchange: 'LiverySelector.uploadLivery(this)'
    });
    appendNewChild(customDiv, 'input', {
        type: 'text',
        name: 'textureInput',
        class: 'mdl-textfield__input address-input',
        placeholder: id,
        id: id
    });
    appendNewChild(customDiv, 'br');
}

/**
 * @param {string} id
 * @param {number} i
 */
function createDirectButton(id,i) {
    const customDiv = document.querySelector('#livery-custom-tab-direct .upload-fields');
    appendNewChild(customDiv, 'input', {
        type: 'file',
        onchange: 'LiverySelector.loadLiveryDirect(this,'+i+')'
    });
    appendNewChild(customDiv, 'span').innerHTML = id;
    appendNewChild(customDiv, 'br');
}

/**
 * @param {HTMLInputElement} fileInput
 * @param {number} i
 */
function loadLiveryDirect(fileInput, i) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        const airplane = getCurrentAircraft();
        const textures = airplane.liveries[0].texture;
        const newTexture = event.target.result;
        if (i === undefined) {
            loadLivery(Array(textures.length).fill(newTexture), airplane.index, airplane.parts);
        } else {
            // doesnt use loadLivery so no multiplayer, direct doesn't work it anyway
            geofs.api.changeModelTexture(
                geofs.aircraft.instance.definition.parts[airplane.parts[i]]["3dmodel"]._model,
                newTexture,
                {index:airplane.index[i]}
            );
        }
        fileInput.value = null;
    });
    // read file (if there is one)
    fileInput.files.length && reader.readAsDataURL(fileInput.files[0]);
}

/**
 * @param {HTMLInputElement} fileInput
 */
function uploadLivery(fileInput) {
    if (!fileInput.files.length)
        return;
    if (!localStorage.imgbbAPIKEY) {
        alert('No imgbb API key saved! Check API tab');
        fileInput.value = null;
        return;
    }
    const form = new FormData();
    form.append('image', fileInput.files[0]);
    if (localStorage.liveryAutoremove)
        form.append('expiration', (new Date()/1000) * 60 * 60);

    const settings = {
        'url': `https://api.imgbb.com/1/upload?key=${localStorage.imgbbAPIKEY}`,
        'method': 'POST',
        'timeout': 0,
        'processData': false,
        'mimeType': 'multipart/form-data',
        'contentType': false,
        'data': form
    };

    $.ajax(settings).done(function (response) {
        const jx = JSON.parse(response);
        console.log(jx.data.url);
        fileInput.nextSibling.value = jx.data.url;
        fileInput.value = null;
        if (!uploadHistory[jx.data.id]) {
            uploadHistory[jx.data.id] = jx.data;
            localStorage.lsUploadHistory = JSON.stringify(uploadHistory);
        }
    });
}

function handleCustomTabs(e){
    e = e || window.event;
    const src = e.target || e.srcElement;
    const tabId = src.innerHTML.toLocaleLowerCase();
    // iterate all divs and check if it was the one clicked, hide others
    domById('customDiv').querySelectorAll(':scope > div').forEach(tabDiv => {
        if (tabDiv.id != ['livery-custom-tab', tabId].join('-')) {
            tabDiv.style.display =  'none';
            return;
        }
        tabDiv.style.display = '';
        // special handling for each tab, could be extracted
        switch (tabId) {
            case 'upload': {
                const fields = tabDiv.querySelectorAll('input[type="file"]');
                fields.forEach(f => localStorage.imgbbAPIKEY ? f.classList.remove('err') : f.classList.add('err'));
                const discordId = (!!localStorage.liveryDiscordId);
                tabDiv.querySelector('.livery-submit .api').style.display = discordId ? '' : 'none';
                tabDiv.querySelector('.livery-submit .no-api').style.display = discordId ? 'none' : '';
            } break;

            case 'download': {
                reloadDownloadsForm(tabDiv);
            } break;

            case 'api': {
                reloadSettingsForm();
            } break;
        }
    });

}

/**
 * reloads texture files for current airplane
 *
 * @param {HTMLElement} tabDiv
 */
function reloadDownloadsForm(tabDiv) {
    const airplane = getCurrentAircraft();
    const liveries = airplane.liveries;
    const defaults = liveries[0];
    const fields = tabDiv.querySelector('.download-fields');
    fields.innerHTML = '';
    liveries.forEach((livery,liveryNo) => {
        appendNewChild(fields, 'h7').innerHTML = livery.name;
        const wrap = appendNewChild(fields, 'div');
        livery.texture.forEach((href,i) => {
            if (liveryNo>0 && href == defaults.texture[i]) return;
            const link = appendNewChild(wrap,'a',{href,target:'_blank',
                class:"mdl-button mdl-button--raised mdl-button--colored"
            });
            link.innerHTML = airplane.labels[i];
        });
    });
}

/**
 * reloads settings form after changes
 */
function reloadSettingsForm() {
    const apiInput = domById('livery-setting-apikey');
    apiInput.placeholder = localStorage.imgbbAPIKEY ?
        'API KEY SAVED ✓ (type CLEAR to remove)' :
        'API KEY HERE';

    const removeCheckbox = domById('livery-setting-remove');
    removeCheckbox.checked = (localStorage.liveryAutoremove==1);

    const discordInput = domById('livery-setting-discordid');
    discordInput.value = localStorage.liveryDiscordId||'';
}

/**
 * saves setting, gets setting key from event element
 *
 * @param {HTMLElement} element
 */
function saveSetting(element) {
    const id = element.id.replace('livery-setting-','');
    switch (id) {
        case 'apikey': {
            if (element.value.length) {
                if (element.value.trim().toLowerCase() == 'clear') {
                    delete localStorage.imgbbAPIKEY;
                } else {
                    localStorage.imgbbAPIKEY = element.value.trim();
                }
                element.value = '';
            }
        } break;

        case 'remove': {
            localStorage.liveryAutoremove = element.checked ? '1' : '0';
        } break;

        case 'discordid': {
            localStorage.liveryDiscordId = element.value.trim();
        } break;
    }
    reloadSettingsForm();
}

/**
 * @returns {object} current aircraft from liveryobj
 */
function getCurrentAircraft() {
    return liveryobj.aircrafts[geofs.aircraft.instance.id];
}

function updateMultiplayer() {
    Object.values(multiplayer.visibleUsers).forEach(function (e) {
        geofs.api.changeModelTexture(multiplayer.visibleUsers[e.id].model, multiplayertexture, 0);
    });
}

/******************* Utilities *********************/

/**
 * @param {string} id Div ID to toggle, in addition to clicked element
 */
function toggleDiv(id) {
    const div = domById(id);
    const target = window.event.target;
    if (target.classList.contains('closed')) {
        target.classList.remove('closed');
        div.style.display='';
    } else {
        target.classList.add('closed');
        div.style.display='none';
    }
}

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
function appendNewChild(parent, tagName, attributes = {}, pos = -1) {
    const child = createTag(tagName, attributes);
    if (pos < 0) {
        parent.appendChild(child);
    } else {
        parent.insertBefore(child, parent.children[pos]);
    }

    return child;
}

/**
 * @param {string} elementId
 * @returns {HTMLElement}
 */
function domById(elementId) {
    return document.getElementById(elementId);
}

/******************* HTML & CSS Templates *********************/

/**
 * @returns {string} HTML template for main panel
 */
function generateListHTML() {
    return `
        <h3><img src="${githubRepo}/liveryselector-logo.svg" class="livery-title" title="LiverySelector" /></h3>

        <div class="livery-searchbar mdl-textfield mdl-js-textfield geofs-stopMousePropagation geofs-stopKeyupPropagation">
            <input class="mdl-textfield__input address-input" type="text" placeholder="Search liveries" onkeyup="LiverySelector.search(this.value)" id="searchlivery">
            <label class="mdl-textfield__label" for="searchlivery">Search liveries</label>
        </div>

        <h6 onclick="LiverySelector.toggleDiv('favorites')">Favorite liveries</h6>
        <ul id="favorites" class="geofs-list geofs-visible"></ul>

        <h6 onclick="LiverySelector.toggleDiv('liverylist')">Available liveries</h6>
        <ul id="liverylist" class=" geofs-list geofs-visible"></ul>

        <h6 onclick="LiverySelector.toggleDiv('customDiv')" class="closed">Load external livery</h6>
        <div id="customDiv" class="mdl-textfield mdl-js-textfield geofs-stopMousePropagation geofs-stopKeyupPropagation" style="display:none;">
            <ul class="livery-custom-tabs" onclick="LiverySelector.handleCustomTabs()">
                <li>Upload</li>
                <li>Direct</li>
                <li>Download</li>
                <li>API</li>
            </ul>
            <div id="livery-custom-tab-upload" style="display:none;">
                <div>Paste URL or upload image to generate imgbb URL</div>
                <div class="upload-fields"></div>
                <div><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="LiverySelector.inputLivery()">Load livery</button></div>
                <div class="livery-submit geofs-list-collapsible-item">Contribute to the LiverySelector Database
                    <div class="geofs-collapsible no-api">-&gt; Fill in API key and Discord User ID in API tab.</div>
                    <div class="geofs-collapsible api">
                        <label for="livery-submit-liveryname">Livery Name</label>
                        <input type="text" id="livery-submit-liveryname" class="mdl-textfield__input address-input">
                        <input type="checkbox" id="livery-submit-confirm-perms">
                        <label for="livery-submit-confirm-perms">I am the author and have created the textures myself or have the permission from the author to use those textures.</label>
                        <input type="checkbox" id="livery-submit-confirm-legal">
                        <label for="livery-submit-confirm-legal">I confirm the textures are safe for all ages, are non-offensive and appropriate for the game and don't violate any laws or other regulations.</label>
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="LiverySelector.submitLivery()">Submit livery for review</button>
                        <small>
                          By submitting you also agree to our <a href="https://discord.gg/2tcdzyYaWU" target="_blank">Discord</a> server rules.
                          Failing to comply may result in exclusion from further submits.
                        </small>
                    </div>
                </div>
            </div>
            <div id="livery-custom-tab-direct" style="display:none;">
                <div>Load texture directly in client, no upload.</div>
                <div class="upload-fields"></div>
            </div>
            <div id="livery-custom-tab-download" style="display:none;">
                <div>Download textures for current Airplane:</div>
                <div class="download-fields"></div>
            </div>
            <div id="livery-custom-tab-api" style="display:none;">
              <div>
                <label for="livery-setting-apikey">Paste your imgbb API key here (<a href="https://api.imgbb.com" target="_blank">get key</a>)</label>
                <input type="text" id="livery-setting-apikey" class="mdl-textfield__input address-input" onchange="LiverySelector.saveSetting(this)">
                <input type="checkbox" id="livery-setting-remove" onchange="LiverySelector.saveSetting(this)">
                <label for="livery-setting-remove">Expire links after one hour<br><small>(only for testing, disable when submitting to the database!)</small></label>
                <label for="livery-setting-discordid">Discord User ID (<a href="https://support.discord.com/hc/en-us/articles/206346498" target="_blank">howto</a>)</label>
                <input type="number" id="livery-setting-discordid" class="mdl-textfield__input address-input" onchange="LiverySelector.saveSetting(this)">
              </div>
            </div>
        </div>
`;
}

/**
 * @returns {HTMLElement} HTML template for main menu livery button
 */
function generatePanelButtonHTML() {
    const liveryButton = createTag('button', {
        title: 'Change livery',
        id: 'liverybutton',
        class: 'mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly',
        onclick: 'LiverySelector.listLiveries()',
        'data-toggle-panel': '.livery-list',
        'data-tooltip-classname': 'mdl-tooltip--top',
        'data-upgraded': ',MaterialButton'
    });
    liveryButton.innerHTML = createTag('img', {src: `${githubRepo}/liveryselector-logo-small.svg`, height: '30px'}).outerHTML;

    return liveryButton;
}

window.LiverySelector = {
    liveryobj,
    saveSetting,
    toggleDiv,
    loadLiveryDirect,
    handleCustomTabs,
    listLiveries,
    star,
    search,
    inputLivery,
    uploadLivery,
    submitLivery,
    uploadHistory
};