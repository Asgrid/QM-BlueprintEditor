var NAMESPACES = {};

/**
 * Loads namespaces and fills existing datalist elements.
 */
function loadGUIDs() {
    let lists = [];
    for (let tag in GUIDS) {
        if (tag == 'default') continue;
        for (let id in GUIDS[tag]) {
            if (id == 'default' || id == '_Tags' || id == '_Props') continue;
            NAMESPACES[GUIDS[tag][id]] = tag + '.' + id;
        }

        let p = GUIDS[tag]['_Props'];
        if (!p) continue;
        if (p.createList) {
            let list = document.createElement('datalist');
            list.id = (p.listName ?? tag)+'List';
            list.dataset.tag = tag;
            lists.push(list);
        }
    }

    // Create datalists for autocompletion
    let body = $('divBody');
    for (let list of lists) {
        ids = getTagList(list.dataset.tag);
        for (let l of ids) {
            list.innerHTML += `<option value="${l}"></option>`;
        }
        body.appendChild(list);
    }
}

/**
 * Returns all IDs that belong to a specific tag.
 * @param {string} name 
 * @returns {string[]}
 */
function getTagList(name, withNS = false) {
    let tag = GUIDS[name];
    let all = [];
    for (let l in tag) {
        if (l == 'default' || l == '_Props') continue;
        if (l == '_Tags') {
            for (let t of tag._Tags) {
                all.push(...getTagList(t, withNS));
            }
            continue;
        }
        all.push(withNS ? `${name}.${l}` : l);
    }
    return all;
}

/**
 * Finds the respective ID for an alias.
 * @param {string} namespace - Tag
 * @param {string} txt - Name or label
 * @returns 
 */
function toID(namespace, txt) {
    if (txt === null || txt === undefined) return null;
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
    } else {
        // Search inside included tags
        let names = getTagList(namespace, true);
        for (let n of names){
            if (n.endsWith('.'+txt)){
                return toID(namespace, n);
            }
        }
    }
    return txt; // Give up
}

/**
 * Returns a mapping function for the specified namespace.
 * @param {string} namespace 
 */
function toIDMap(namespace) {
    return (x) => toID(namespace, x);
}

/**
 * Returns the namespace and label that represents a GUID.
 * @param {string} id 
 */
function toNamespace(id) {
    return NAMESPACES[id] ?? id;
}

/**
 * Returns whether a tag exists in GUIDs.
 * @param {string} name 
 */
function checkNamespace(name) {
    return Object.hasOwn(GUIDS, name);
}