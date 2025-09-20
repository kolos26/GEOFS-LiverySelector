const githubRepo = 'https://raw.githubusercontent.com/kolos26/GEOFS-LiverySelector/main';
let jsDelivr = 'https://cdn.jsdelivr.net/gh/kolos26/GEOFS-LiverySelector@main';
const noCommit = jsDelivr;
const version = '3.3.1';

const liveryobj = {};
const mpLiveryIds = {};
const mLiveries = {};
const origHTMLs = {};
const uploadHistory = JSON.parse(localStorage.lsUploadHistory || '{}');
const LIVERY_ID_OFFSET = 10e3;
const ML_ID_OFFSET = 1e3;
let links = [];
let airlineobjs = [];
let whitelist;
let mpAirlineobjs = {};

(async function init() {
    // latest commit fetch
    try {
        const res = await fetch(`https://api.github.com/repos/kolos26/GEOFS-LiverySelector/commits/main`);
        if (!res.ok) jsDelivr = githubRepo;
        const commit = (await res.json()).sha;
        if (!/^[a-f0-9]{40}$/.test(commit)) jsDelivr = githubRepo;
        jsDelivr = jsDelivr.replace("@main", `@${commit}`);
    } catch (err) {jsDelivr = githubRepo};
    
    // styles
    fetch(`${jsDelivr}/styles.css?` + Date.now()).then(async data => {
        const styleTag = createTag('style', { type: 'text/css' });
        styleTag.innerHTML = await data.text();
        document.head.appendChild(styleTag);
    });
    appendNewChild(document.head, 'link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' });

    //Load liveries (@todo: consider moving to listLiveries)
    fetch(`${jsDelivr}/livery.json?` + Date.now()).then(handleLiveryJson);
    
    // Panel for list
    const listDiv = appendNewChild(document.querySelector('.geofs-ui-left'), 'div', {
        id: 'listDiv',
        class: 'geofs-list geofs-toggle-panel livery-list',
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

    //Init airline databases
    if (localStorage.getItem('links') === null) {
        localStorage.links = '';
    } else {
        links = localStorage.links.split(",");
        links.forEach(async function (e) {
            await fetch(e).then(res => res.json()).then(data => airlineobjs.push(data));
            airlineobjs[airlineobjs.length - 1].url = e.trim();
        });
    }
    fetch(`${jsDelivr}/whitelist.json?` + Date.now()).then(res => res.json()).then(data => whitelist = data);

    // Start multiplayer
    setInterval(updateMultiplayer, 5000);

    window.addEventListener("keyup", function (e) {
        if (e.target.classList.contains("geofs-stopKeyupPropagation")) {
            e.stopImmediatePropagation();
        }
        if (e.key === "l") {
            LiverySelector.togglePanel();
        }
    });
})();

/**
 * @param {Response} data
 */
async function handleLiveryJson(data) {
    const json = await data.json();
    Object.keys(json).forEach(key => liveryobj[key] = json[key]);
    
    if (liveryobj.commit) jsDelivr = jsDelivr.replace("@main", "@" + liveryobj.commit)
    
    if (liveryobj.version != version) {
        document.querySelector('.livery-list h3').appendChild(
            createTag('a', {
                href: 'https://github.com/kolos26/GEOFS-LiverySelector/releases/latest',
                target: '_blank',
                style: 'display:block;width:100%;text-decoration:none;text-align:center;'
            }, 'Update available: ' + liveryobj.version)
        );
    }
    // mark aircraft with livery icons
    Object.keys(liveryobj.aircrafts).forEach(aircraftId => {
        if (liveryobj.aircrafts[aircraftId].liveries.length < 2) {
            return; // only show icon if there's more than one livery
        }
        const element = document.querySelector(`[data-aircraft='${aircraftId}']`);
        // save original HTML for later use (reload, aircraft change, etc..)
        if (element) {
            if (!origHTMLs[aircraftId]) {
                origHTMLs[aircraftId] = element.innerHTML;
            }

        // use orig HTML to concatenate so theres only ever one icon
        element.innerHTML = origHTMLs[aircraftId] +
            createTag('img', {
                src: `${noCommit}/liveryselector-logo-small.svg`,
                style: 'height:30px;width:auto;margin-left:20px;',
                title: 'Liveries available'
            }).outerHTML;

        if (liveryobj.aircrafts[aircraftId].mp != "disabled")
            element.innerHTML += createTag('small', {
                title: 'Liveries are multiplayer compatible\n(visible to other players)'
            }, '🎮').outerHTML;
        }
        });

}

/**
 * Triggers GeoFS API to load texture
 *
 * @param {string[]} texture
 * @param {number[]} index
 * @param {number[]} parts
 * @param {Object[]} mats
 */
function loadLivery(texture, index, parts, mats) {
    //change livery
    for (let i = 0; i < texture.length; i++) {
        const model3d = geofs.aircraft.instance.definition.parts[parts[i]]['3dmodel'];
        // check for material definition (for untextured parts)
        if (typeof texture[i] === 'object') {
            if (texture[i].material !== undefined) {
                const mat = mats[texture[i].material];
                model3d._model.getMaterial(mat.name)
                    .setValue(Object.keys(mat)[1], new Cesium.Cartesian4(...mat[Object.keys(mat)[1]], 1.0));
            }
            continue;
        }
        if (geofs.version == 2.9) {
            geofs.api.Model.prototype.changeTexture(texture[i], index[i], model3d);
        } else if (geofs.version >= 3.0 && geofs.version <= 3.7) {
            geofs.api.changeModelTexture(model3d._model, texture[i], index[i]);
        } else {
            geofs.api.changeModelTexture(model3d._model, texture[i], { index: index[i] });
        }
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
    document.querySelectorAll('.livery-submit input').forEach(f => formFields[f.id.replace('livery-submit-', '')] = f);
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
        credits: formFields.credits.value.trim(),
        texture: [],
        materials: {}
    };
    if (!json.name || json.name.trim() == '') {
        return;
    }
    const hists = [];
    const embeds = [];
    inputFields.forEach((f, i) => {
      console.log(f.type)
      if (f.type === "text"){
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
                title: airplane.labels[i] + ' (' + (Math.ceil(hist.size / 1024 / 10.24) / 100) + 'MB, ' + hist.width + 'x' + hist.height + ')',
                description: f.value,
                image: { url: f.value },
                fields: [
                    { name: 'Timestamp', value: new Date(hist.time * 1e3), inline: true },
                    { name: 'File ID', value: hist.id, inline: true },
                ]
            };
            if (hist.submitted) {
                if (!confirm('The following texture was already submitted:\n' + f.value + '\nContinue anyway?')) {
                    return;
                }
                embed.fields.push({ name: 'First submitted', value: new Date(hist.submitted * 1e3) });
            }
            embeds.push(embed);
            hists.push(hist);
            json.texture.push(f.value);
        } else {
            json.texture.push(textures[i]);
        }
        } else if (f.type === "color"){
            json.materials[f.id] = [parseInt(f.value.substring(1, 3), 16) / 255, parseInt(f.value.substring(3, 5), 16) / 255, parseInt(f.value.substring(5, 7), 16) / 255]
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
        body: JSON.stringify({ content: content.join('\n'), embeds })
    }).then(res => {
        hists.forEach(hist => {
            hist.submitted = hist.submitted || Math.round(new Date() / 1000);
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
 *  main livery list
 */
function listLiveries() {
    const livList = $('#liverylist').html('');
    livList[0].addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.onerror = null;
            e.target.src = defaultThumb;
        }
    }, true);
    // one big event listener instead of multiple event listeners
    $(livList).on('click', 'li, [data-idx]', function ({ target }) {
        const idx = $(target).closest('li').data('idx')
        , airplane = LiverySelector.liveryobj.aircrafts[geofs.aircraft.instance.id]
        , livery = airplane.liveries[idx];
        if (idx === void 0 || target.classList.contains("fa-star")) return; // avoid livery selection when favorite button is pressed
        livery.disabled || (loadLivery(livery.texture, airplane.index, airplane.parts, livery.materials),
        livery.mp != 'disabled' && setInstanceId(idx + (livery.credits?.toLowerCase() == 'geofs' ? '' : LIVERY_ID_OFFSET)));
    }); // uses || (logical OR) to run the right side code only if livery.disabled is falsy
    const tempFrag = document.createDocumentFragment()
    , thumbsDir = [noCommit, 'thumbs'].join('/')
    , acftId = geofs.aircraft.instance.id
    , defaultThumb = [thumbsDir, acftId + '.png'].join('/')
    , airplane = getCurrentAircraft(); // chained variable declarations
    $('#listDiv').attr('data-ac', acftId); // tells us which aircraft's liveries are loaded
    for (let i = 0; i < airplane.liveries.length; i++) {
        const e = airplane.liveries[i];
        if (e.disabled) return;
        const listItem = $('<li/>', {id: [acftId, e.name, 'button'].join('_'), class: 'geofs-visible livery-list-item'});
        listItem.data('idx', i).append($('<span/>', {class: 'livery-name'}).html(e.name));
        listItem.toggleClass('offi', acftId < 100); // if param2 is true, it'll add 'offi', if not, it will remove 'offi'
        if (acftId < 1000) {
            const thumb = $('<img/>', {loading: 'lazy'});
            thumb.attr('src', [thumbsDir, acftId, acftId + '-' + i + '.png'].join('/'));
            listItem.append(thumb);
        }
        if (e.credits && e.credits.length) {
            $('<small/>').text(`by ${e.credits}`).appendTo(listItem);
        }
        $('<span/>', {
            id: [acftId, e.name].join('_'),
            class: 'fa fa-star',
            onclick: 'LiverySelector.star(this)'
        }).appendTo(listItem);
        listItem.appendTo(tempFrag);
    }
    livList.append(tempFrag);
    sortList('liverylist');
    loadFavorites();
    sortList('favorites');
    loadAirlines();
    addCustomForm();
}

function loadFavorites() {
	const favorites = localStorage.getItem('favorites') ?? '';
    if (favorites === null) {
        localStorage.setItem('favorites', '');
    }
    $("#favorites").empty().on("click", "li", function ({ target }) { // clear the child elements & add event listener
		const $match = $(`#liverylist > [id='${$(target).attr("id").replace("_favorite", "_button")}']`) // find the matching livery list item
		if ($match.length === 0) return void ui.notification.show(`ID: ${$(target).attr("id")} is missing a liveryList counterpart.`)
		$match.click(); // click it to simulate onclick behavior and stuff
	});
    const list = favorites.split(',');
    const airplane = geofs.aircraft.instance.id;
    list.forEach(function (e) {
        if ((airplane == e.slice(0, airplane.length)) && (e.charAt(airplane.length) == '_')) {
            star(domById(e));
        }
    });
}

function loadAirlines() {
    domById("airlinelist").innerHTML = '';
    const airplane = getCurrentAircraft();
    const textures = airplane.liveries[0].texture;
    airlineobjs.forEach(function(airline) {
        let airlinename = appendNewChild(domById('airlinelist'), 'li', {
            style: "color:" + airline.color + ";background-color:" + airline.bgcolor + "; font-weight: bold;"
        });
        airlinename.innerText = airline.name;
        let removebtn = appendNewChild(airlinename, "button", {
            class: "mdl-button mdl-js-button mdl-button--raised mdl-button",
            style: "float: right; margin-top: 6px; background-color: #9e150b;",
            onclick: `LiverySelector.removeAirline("${airline.url}")`
        });
        removebtn.innerText = "- Remove airline";
        if (Object.keys(airline.aircrafts).includes(geofs.aircraft.instance.id)) {
            airline.aircrafts[geofs.aircraft.instance.id].liveries.forEach(function (e, i) {
                let listItem = appendNewChild(domById('airlinelist'), 'li', {
                    id: [geofs.aircraft.instance.id, e.name, 'button'].join('_'),
                    class: 'livery-list-item'
                });
                if ((textures.filter(x => x === textures[0]).length === textures.length) && textures.length !== 1) { // the same texture is used for all indexes and parts
                    const texture = e.texture[0];
                    listItem.onclick = () => {
                        loadLivery(Array(textures.length).fill(texture), airplane.index, airplane.parts);
                        if (airplane.mp != 'disabled' && whitelist.includes(airline.url.trim())) {
                            setInstanceId({url: airline.url, idx: i});
                        }
                    }
                } else {
                    listItem.onclick = () => {
                        loadLivery(e.texture, airplane.index, airplane.parts, e.materials);
                        if (airplane.mp != 'disabled' && whitelist.includes(airline.url.trim())) {
                            setInstanceId({url: airline.url, idx: i});
                        }
                    }
                }
                listItem.innerHTML = createTag('span', { class: 'livery-name' }, e.name).outerHTML;
                if (e.credits && e.credits.length) {
                    listItem.innerHTML += `<small>by ${e.credits}</small>`;
                }
            });
        }
    });
}

function addCustomForm() {
    document.querySelector('#livery-custom-tab-upload .upload-fields').innerHTML = '';
    document.querySelector('#livery-custom-tab-direct .upload-fields').innerHTML = '';
    const airplane = getCurrentAircraft();
    const textures = airplane.liveries[0].texture.filter(t => typeof t !== 'object');
    const placeholders = airplane.labels;
    if (textures.length){
    if (textures.filter(x => x === textures[0]).length === textures.length) { // the same texture is used for all indexes and parts
        createUploadButton(placeholders[0]);
        createDirectButton(placeholders[0]);
    } else {
        placeholders.forEach((placeholder, i) => {
            createUploadButton(placeholder);
            createDirectButton(placeholder, i);
        });
    }
    }
    if (airplane.liveries[0].materials) {
        airplane.liveries[0].materials.forEach((material, key) => {
            let partlist = [];
            airplane.liveries[0].texture.forEach((e, k) => {
                if (typeof(e) === 'object'){
                    if (e.material == key){
                        partlist.push(airplane.parts[k]);
                    }
                }
            });
            createColorChooser(material.name, Object.keys(material)[1], partlist);
            createUploadColorChooser(material.name, Object.keys(material)[1], partlist);
        })
    }
    // click first tab to refresh button status
    document.querySelector('.livery-custom-tabs li').click();
}
function debounceSearch (func) {
    let timeoutId = null;
    return (text) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(text);
        }, 250); // debounces for 250 ms
    };
}
const search = debounceSearch(text => {
    const liveries = document.getElementById('liverylist').children; // .children is better than .childNodes
    if (text == '') {
        for (const a of liveries) a.classList.add('geofs-visible')
        return;
    }
    text = text.toLowerCase(); // query string lowered here to avoid repeated calls
    for (let i = 0; i < liveries.length; i++) {
        const e = liveries[i]
        , v = e.classList.contains('geofs-visible')
        if (e.textContent.toLowerCase().includes(text)) { // textContent better than innerText
            if (!v) e.classList.add('geofs-visible');
        } else {
            if (v) e.classList.remove('geofs-visible');
        }
    };
})

function changeMaterial(name, color, type, partlist){
    let r = parseInt(color.substring(1, 3), 16) / 255
    let g = parseInt(color.substring(3, 5), 16) / 255
    let b = parseInt(color.substring(5, 7), 16) / 255
    partlist.forEach(part => {
        geofs.aircraft.instance.definition.parts[part]['3dmodel']._model.getMaterial(name).setValue(type, new Cesium.Cartesian4(r, g, b, 1.0));
    });
}

/**
 * Mark as favorite
 *
 * @param {HTMLElement} element
 */
function star(element) {
    const e = element.classList;
    const elementId = [element.id, 'favorite'].join('_');
	let list = localStorage.getItem('favorites').split(',');
    if (e.contains("checked")) {
        domById('favorites').removeChild(domById(elementId));
        const index = list.indexOf(element.id);
        if (index !== -1) {
            list.splice(index, 1);
        }
        localStorage.setItem('favorites', list);
    } else {
		const btn = domById([element.id, 'button'].join('_'));
        const fbtn = appendNewChild(domById('favorites'), 'li', { id: elementId, class: 'livery-list-item' });
        // fbtn.onclick = btn.onclick; // moved to loadFavorites
        fbtn.innerText = btn.children[0].innerText;
		
        list.push(element.id);
        localStorage.setItem('favorites', [...new Set(list)]);
    }
    //style animation
    e.toggle('checked');
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
function createDirectButton(id, i) {
    const customDiv = document.querySelector('#livery-custom-tab-direct .upload-fields');
    appendNewChild(customDiv, 'input', {
        type: 'file',
        onchange: 'LiverySelector.loadLiveryDirect(this,' + i + ')'
    });
    appendNewChild(customDiv, 'span').innerHTML = id;
    appendNewChild(customDiv, 'br');
}

function createColorChooser(name, type, partlist) {
    const customDiv = document.querySelector('#livery-custom-tab-direct .upload-fields');
    appendNewChild(customDiv, 'input', {
        type: 'color',
        name: name,
        class: 'colorChooser',
        onchange: `changeMaterial("${name}", this.value, "${type}", [${partlist}])`
    });
    appendNewChild(customDiv, 'span', {style:'padding-top: 20px; padding-bottom: 20px;'}).innerHTML = name;
    appendNewChild(customDiv, 'br');
}


function createUploadColorChooser(name, type, partlist) {
    const customDiv = document.querySelector('#livery-custom-tab-upload .upload-fields');
    appendNewChild(customDiv, 'input', {
        type: 'color',
        name: "textureInput",
        id: name,
        class: 'colorChooser',
        onchange: `changeMaterial("${name}", this.value, "${type}", [${partlist}])`
    });
    appendNewChild(customDiv, 'span', {style:'padding-top: 20px; padding-bottom: 20px;'}).innerHTML = name;
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
            geofs.api.changeModelTexture(
                geofs.aircraft.instance.definition.parts[airplane.parts[i]]["3dmodel"]._model,
                newTexture,
                { index: airplane.index[i] }
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
        form.append('expiration', (new Date() / 1000) * 60 * 60);

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
        if (!uploadHistory[jx.data.id] || (uploadHistory[jx.data.id].expiration !== jx.data.expiration)) {
            uploadHistory[jx.data.id] = jx.data;
            localStorage.lsUploadHistory = JSON.stringify(uploadHistory);
        }
    });
}

function handleCustomTabs(e) {
    e = e || window.event;
    const src = e.target || e.srcElement;
    const tabId = src.innerHTML.toLocaleLowerCase();
    // iterate all divs and check if it was the one clicked, hide others
    domById('customDiv').querySelectorAll(':scope > div').forEach(tabDiv => {
        if (tabDiv.id != ['livery-custom-tab', tabId].join('-')) {
            tabDiv.style.display = 'none';
            return;
        }
        tabDiv.style.display = '';
        // special handling for each tab, could be extracted
        switch (tabId) {
            case 'upload': {
                const fields = tabDiv.querySelectorAll('input[type="file"]');
                fields.forEach(f => localStorage.imgbbAPIKEY ? f.classList.remove('err') : f.classList.add('err'));
                const apiKeys = !!localStorage.liveryDiscordId && !!localStorage.imgbbAPIKEY;
                tabDiv.querySelector('.livery-submit .api').style.display = apiKeys ? '' : 'none';
                tabDiv.querySelector('.livery-submit .no-api').style.display = apiKeys ? 'none' : '';
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
    liveries.forEach((livery, liveryNo) => {
        const textures = livery.texture.filter(t => typeof t !== 'object');
        if (!textures.length) return; // ignore material defs
        appendNewChild(fields, 'h7').innerHTML = livery.name;
        const wrap = appendNewChild(fields, 'div');
        textures.forEach((href, i) => {
            if (typeof href === 'object') return;
            if (liveryNo > 0 && href == defaults.texture[i]) return;
            const link = appendNewChild(wrap, 'a', {
                href, target: '_blank',
                class: "mdl-button mdl-button--raised mdl-button--colored"
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
    removeCheckbox.checked = (localStorage.liveryAutoremove == 1);

    const discordInput = domById('livery-setting-discordid');
    discordInput.value = localStorage.liveryDiscordId || '';
}

/**
 * saves setting, gets setting key from event element
 *
 * @param {HTMLElement} element
 */
function saveSetting(element) {
    const id = element.id.replace('livery-setting-', '');
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

async function addAirline() {
    let url = prompt("Enter URL to the json file of the airline:");
    if (!links.includes(url)) {
        links.push(url);
        localStorage.links += `,${url}`
        await fetch(url).then(res => res.json()).then(data => airlineobjs.push(data));
        airlineobjs[airlineobjs.length - 1].url = url.trim();
        loadAirlines();
    } else {
        alert("Airline already added");
    }
}
function removeAirline(url) {
    removeItem(links, url.trim());
    if (links.toString().charAt(0) === ","){
        localStorage.links = links.toString().slice(1);
    } else {
        localStorage.links = links.toString();
    }
    airlineobjs.forEach(function (e, index) {
        if (e.url.trim() === url.trim()) {
            airlineobjs.splice(index, 1);
        }
    });
    loadAirlines();
}

/**
 * @returns {object} current aircraft from liveryobj
 */
function getCurrentAircraft() {
    return liveryobj.aircrafts[geofs.aircraft.instance.id];
}

function setInstanceId(id) {
    geofs.aircraft.instance.liveryId = id;
}

async function updateMultiplayer() {
    const users = Object.values(multiplayer.visibleUsers);

    const texturePromises = users.map(async u => {
        const liveryEntry = liveryobj.aircrafts[u.aircraft];
        let textures = [];

        let otherId = u.currentLivery;

        // if (!liveryEntry || !u.model || liveryEntry.mp == 'disabled') {
        if (!liveryEntry || !u.model) { // TODO change back, testing
            return; // without livery or disabled
        }

        if (mpLiveryIds[u.id] === otherId) {
            return; // already updated
        }

        mpLiveryIds[u.id] = otherId;

        if (otherId >= ML_ID_OFFSET && otherId < LIVERY_ID_OFFSET) {
            textures = getMLTexture(u, liveryEntry); // ML range 1k–10k
        } else if (
            (otherId >= LIVERY_ID_OFFSET && otherId < LIVERY_ID_OFFSET * 2) ||
            typeof otherId === "object"
        ) {
            textures = await getMPTexture(u, liveryEntry); // LS range 10k+10k
        } else {
            return; // game-managed livery
        }

        textures.forEach(texture => {
            if (texture.material !== undefined) {
                applyMPMaterial(
                    u.model,
                    texture.material,
                    texture.type,
                    texture.color
                );
            } else {
                applyMPTexture(
                    texture.uri,
                    texture.tex,
                    img => u.model.changeTexture(img, { index: texture.index })
                );
            }
        });
    });

    await Promise.all(texturePromises); // wait for all user updates to complete
}


/**
 * Fetch and resize texture to expected format
 * @param {string} url
 * @param {sd} tex
 * @param {function} cb
 */
function applyMPTexture(url, tex, cb) {
    try {
        Cesium.Resource.fetchImage({ url }).then(img => {
            const canvas = createTag('canvas', { width: tex._width, height: tex._height });
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            cb(canvas.toDataURL('image/png'));
        });
    } catch (e) {
        console.log('LSMP', !!tex, url, e);
    }
}

function applyMPMaterial(model, name, type, color){
    model._model.getMaterial(name).setValue(type, new Cesium.Cartesian4(...color, 1.0));
}

/**
 * @param {object} u
 * @param {object} liveryEntry
 */
async function getMPTexture(u, liveryEntry) {
    const otherId = u.currentLivery - LIVERY_ID_OFFSET;
    const textures = [];
    console.log(u.currentLivery, typeof(u.currentLivery));
    // check model for expected textures
    const uModelTextures = u.model._model._rendererResources.textures;
    if (!u.currentLivery) return []; // early return in case of missing livery
    if (typeof(u.currentLivery) === "object") { //currentLivery is object -> virtual airline liveries
        console.log("VA detected");
        console.log(u.currentLivery);
        if ( mpAirlineobjs[u.currentLivery.url] === undefined) {
            await fetch(u.currentLivery.url).then(res => res.json()).then(data => mpAirlineobjs[u.currentLivery.url] = data);
            console.log(mpAirlineobjs[u.currentLivery.url]);
        }
        const texturePromises = liveryEntry.mp.map(async e => {
            if (e.textureIndex !== undefined) {
                return {
                    uri: mpAirlineobjs[u.currentLivery.url].aircrafts[u.aircraft].liveries[u.currentLivery.idx].texture[e.textureIndex],
                    tex: uModelTextures[e.modelIndex],
                    index: e.modelIndex
                };
            } else if (e.material !== undefined) {
                const mat = mpAirlineobjs[u.currentLivery.url].aircrafts[u.aircraft].liveries[u.currentLivery.idx].materials[e.material];
                const typeKey = Object.keys(mat)[1];
                return {
                    material: mat.name,
                    type: typeKey,
                    color: mat[typeKey]
                };
            } else if (e.mosaic !== undefined) {
                const mosaicTexture = await generateMosaicTexture(
                    e.mosaic.base,
                    e.mosaic.tiles,
                    mpAirlineobjs[u.currentLivery.url].aircrafts[u.aircraft].liveries[u.currentLivery.idx].texture
                );
                return {
                    uri: mosaicTexture,
                    tex: uModelTextures[e.modelIndex],
                    index: e.modelIndex
                };
            }
        });

        const resolvedTextures = await Promise.all(texturePromises);
        textures.push(...resolvedTextures);
    } else {
        const texturePromises = liveryEntry.mp.map(async e => {
            if (e.textureIndex !== undefined) {
                return {
                    uri: liveryEntry.liveries[otherId].texture[e.textureIndex],
                    tex: uModelTextures[e.modelIndex],
                    index: e.modelIndex
                };
            } else if (e.material !== undefined) {
                const mat = liveryEntry.liveries[otherId].materials[e.material];
                const typeKey = Object.keys(mat)[1];
                return {
                    material: mat.name,
                    type: typeKey,
                    color: mat[typeKey]
                };
            } else if (e.mosaic !== undefined) {
                const mosaicTexture = await generateMosaicTexture(
                    e.mosaic.base,
                    e.mosaic.tiles,
                    liveryEntry.liveries[otherId].texture
                );
                return {
                    uri: mosaicTexture,
                    tex: uModelTextures[e.modelIndex],
                    index: e.modelIndex
                };
            }
        });

        const resolvedTextures = await Promise.all(texturePromises);
        textures.push(...resolvedTextures);
    }
    console.log("getMPtexture\n", textures);
    return textures;
}

/**
 * @param {object} u
 * @param {object} liveryEntry
 */
function getMLTexture(u, liveryEntry) {
    if (!mLiveries.aircraft) {
        fetch(atob(liveryobj.mapi)).then(data => data.json()).then(json => {
            Object.keys(json).forEach(key => mLiveries[key] = json[key]);
        });
        return [];
    }
    const liveryId = u.currentLivery - ML_ID_OFFSET;
    const textures = [];
    const texIdx = liveryEntry.labels.indexOf('Texture');
    if (texIdx !== -1) {
        textures.push({
            uri: mLiveries.aircraft[liveryId].mptx,
            tex: u.model._model._rendererResources.textures[liveryEntry.index[texIdx]],
            index: liveryEntry.index[texIdx]
        });
    }
    return textures;
}

async function generateMosaicTexture(url, tiles, textures) {
    const baseImage = await Cesium.Resource.fetchImage({ url });
    const canvas = createTag('canvas', { width: baseImage.width, height: baseImage.height });
    const ctx = canvas.getContext('2d');

    // Draw the base image first
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Create an array of Promises for drawing all tiles
    const drawTilePromises = tiles.map(async (tile) => {
        const image = await Cesium.Resource.fetchImage({ url: textures[tile.textureIndex] });
        ctx.drawImage(
            image,
            tile.sx, tile.sy, tile.sw, tile.sh,
            tile.dx, tile.dy, tile.dw, tile.dh
        );
    });

    // Wait for all tiles to be drawn
    await Promise.all(drawTilePromises);

    // Now canvas is fully rendered; return the data URL
    console.log(canvas.toDataURL());
    return canvas.toDataURL('image/png');
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
        div.style.display = '';
    } else {
        target.classList.add('closed');
        div.style.display = 'none';
    }
}

/**
 * Create tag with <name attributes=...
 *
 * @param {string} name
 * @param {Object} attributes
 * @param {string|number} content
 * @returns {HTMLElement}
 */
function createTag(name, attributes = {}, content = '') {
    const el = document.createElement(name);
    Object.keys(attributes || {}).forEach(k => el.setAttribute(k, attributes[k]));
    if (('' + content).length) {
        el.innerHTML = content;
    }
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

function removeItem(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);
    if (index !== -1) {
        array.splice(index, 1);
    }
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
        <h3><img src="${noCommit}/liveryselector-logo.svg" class="livery-title" title="LiverySelector" /></h3>

        <div class="livery-searchbar mdl-textfield mdl-js-textfield geofs-stopMousePropagation geofs-stopKeyupPropagation">
            <input class="mdl-textfield__input address-input" type="text" placeholder="Search liveries" onkeyup="LiverySelector.search(this.value)" id="searchlivery">
            <label class="mdl-textfield__label" for="searchlivery">Search liveries</label>
        </div>

        <h6 onclick="LiverySelector.toggleDiv('favorites')">Favorite liveries</h6>
        <ul id="favorites" class="geofs-list geofs-visible"></ul>

        <h6 onclick="LiverySelector.toggleDiv('liverylist')">Available liveries</h6>
        <ul id="liverylist" class="geofs-list geofs-visible"></ul>

        <h6 onclick="LiverySelector.toggleDiv('airlinelist')">Virtual airlines</h6><button class="mdl-button mdl-js-button mdl-button--raised mdl-button" style="background-color: #096628; color: white;" onclick="LiverySelector.addAirline()">+ Add airline</button>
        <ul id="airlinelist" class="geofs-list geofs-visible"></ul>

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
                        <label for="livery-submit-credits">Author</label>
                        <input type="text" id="livery-submit-credits" class="mdl-textfield__input address-input">
                        <input type="checkbox" id="livery-submit-confirm-perms">
                        <label for="livery-submit-confirm-perms">I am the author and have created the textures myself or have the permission from the author to use those textures.</label><br>
                        <input type="checkbox" id="livery-submit-confirm-legal">
                        <label for="livery-submit-confirm-legal">I confirm the textures are safe for all ages, are non-offensive and appropriate for the game and don't violate any laws or other regulations.</label>
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="LiverySelector.submitLivery()">Submit livery for review</button>
                        <small>
                          Join our <a href="https://discord.gg/2tcdzyYaWU" target="_blank">Discord</a> to follow up on your contributions.
                          By submitting you agree to the Discord server rules. Failing to comply may result in exclusion from further submits.
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
        <br/>
        <a href="https://cdn.jsdelivr.net/gh/kolos26/GEOFS-LiverySelector@main/tutorial.txt" target="_blank"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button">Open tutorial</button></a><br/>
        <a href="https://discord.gg/2tcdzyYaWU" target="_blank"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button">Join our discord server</button></a><br/>
        <a href="https://github.com/kolos26/GEOFS-LiverySelector" target="_blank"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button">Visit our Github page</button></a><br/>
        <a href="mailto:LiverySelector20220816@gmail.com" target="_blank"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button">Contact us: LiverySelector20220816@gmail.com</button></a><br/>
`;
}

/**
 * @returns {HTMLElement} HTML template for main menu livery button
 */
function generatePanelButtonHTML() {
    const liveryButton = createTag('button', {
        title: 'Change livery',
        id: 'liverybutton',
        onclick: 'LiverySelector.togglePanel()',
        class: 'mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly',
        'data-toggle-panel': '.livery-list',
        'data-tooltip-classname': 'mdl-tooltip--top',
        'data-upgraded': ',MaterialButton'
    });
    liveryButton.innerHTML = createTag('img', { src: `${noCommit}/liveryselector-logo-small.svg`, height: '30px' }).outerHTML;

    return liveryButton;
}

function togglePanel() {
    const p = document.getElementById('listDiv');
    console.time('listLiveries');
    p.dataset.ac != geofs.aircraft.instance.id && window.LiverySelector.listLiveries();
    console.timeEnd('listLiveries');
}

window.LiverySelector = {
    liveryobj,
    loadLivery,
    saveSetting,
    toggleDiv,
    loadLivery,
    loadLiveryDirect,
    handleCustomTabs,
    listLiveries,
    star,
    search,
    inputLivery,
    uploadLivery,
    submitLivery,
    uploadHistory,
    loadAirlines,
    addAirline,
    removeAirline,
    airlineobjs,
    togglePanel
};

