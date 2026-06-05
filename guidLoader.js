var NAMESPACES = {};

function loadGUIDs() {
    for (let tag in GUIDS) {
        if (tag == 'default') continue;
        for (let id in GUIDS[tag]) {
            if (id == 'default' || id == 'Tags') continue;
            NAMESPACES[GUIDS[tag][id]] = tag + '.' + id;
        }
    }

    //Tiles
    let ids = getTagList('Tiles');
    let list = $('tileList');
    for (let t of ids) {
        list.innerHTML += `<option value="${t}"></option>`;
    }

    //Layers
    ids = getTagList('Layers');
    list = $('layerList');
    for (let l of ids) {
        list.innerHTML += `<option value="${l}"></option>`;
    }

    //Buffs
    ids = getTagList('Buffs');
    list = $('buffList');
    for (let l of ids) {
        list.innerHTML += `<option value="${l}"></option>`;
    }

    //Entities
    ids = getTagList('Entities');
    list = $('entityList');
    for (let l of ids) {
        list.innerHTML += `<option value="${l}"></option>`;
    }
}

function getTagList(name) {
    let tag = GUIDS[name];
    let all = [];
    for (let l in tag) {
        if (l == 'default') continue;
        if (l == 'Tags') {
            for (let t of tag.Tags) {
                all.push(...getTagList(t));
            }
            continue;
        }
        all.push(l);
    }
    return all;
}

function toID(namespace, txt) {
    if (txt === null) return null;
    let split = txt.split('.');
    if (split.length == 2) {
        // Explicit namespace
        let ns = split[0];
        let name = split[1];
        if (Object.hasOwn(GUIDS, ns) && Object.hasOwn(GUIDS[ns], name))
            return GUIDS[ns][name];
    } else if (Object.hasOwn(GUIDS[namespace], txt)) {
        // Implicit namespace
        return GUIDS[namespace][txt];
    }
    return txt; // Give up
}

function toIDMap(namespace) {
    return (x) => toID(namespace, x);
}

function toNamespace(id) {
    return NAMESPACES[id] ?? id;
}

function checkNamespace(name) {
    return Object.hasOwn(GUIDS, name);
}