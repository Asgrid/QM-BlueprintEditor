/**
 * Renders the form elements for a blueprint's palette.
 */
function renderPalette() {
    let palList = $('bpPalettes');
    let html = '';
    let i = 0;
    for (let pal of _Blueprint.Tilemaps.Palette) {
        html+=`<li><p><b>${i}</b>:<space></space>`;
        html+=$idInput(i, pal, 'TilesList', 'pal', 'bindPalette(this)');
        html+=`</p></li>`;
        i+=1;
    }
    palList.innerHTML = html;
}

/**
 * Renders the form elements for a blueprint's layers.
 */
function renderLayers() {
    let layerList = $('bpLayers');
    layerList.innerHTML = '';
    let i = 0;
    if ($('chGrid').checked) {
        for (let {layer, tiles} of _Blueprint.Tilemaps.Layers) {
            layerList.innerHTML+=$gridInput(i, layer, tiles);
            i++;
        }
    } else {
        for (let {layer, tiles} of _Blueprint.Tilemaps.Layers) {
            layerList.innerHTML+=$layerInput(i, layer, tiles);
            i++;
        }
    }
}

/**
 * Renders the form elements for all entities.
 */
function renderEntities() {
    let entityList = $('bpEntities');
    let html = '';
    let i = 0;
    for (let ent of _Blueprint.Entities) {
        html += `<fieldset id="fldEnt_${i}">`;
        html +=renderEntity(ent, i);
        html += `</fieldset>`;
        i+=1;
    }
    entityList.innerHTML = html;
}

/**
 * Re-renders one entity's form, leaving the rest untouched.
 */
function updateEntity(entity, index) {
    if (index>=0) {
        $('fldEnt_'+index).innerHTML = renderEntity(entity, index);
    } else {
        let parent = Math.abs(index)-1;
        $('fldEnt_'+parent).innerHTML = renderEntity(_Blueprint.Entities[parent], parent);
    }
}

/**
 * Renders the form elements for one entity in the list.
 * @param {Entity} entity 
 * @param {number} index 
 */
function renderEntity(entity, index) {
    let i;
    let html =  `   <legend>${entity.Id}</legend>
                    <p>
                        <b>Id</b>:<space></space>`;
    html+=$idInput(index, entity.Id,
                    entity.isStack
                    ? (entity.Parent.Receivable ? 'ReceivablesList' : 'SpawnablesList')
                    : 'EntitiesList',
                    'ent_id', `bindEntity(${index}, 'Id', this.value)`);
    html += `           <space></space>
                        <button onclick="_Blueprint.removeEntity(${index})">🗑</button>
                    </p>`;

    if (entity.Position) {
        html += `   <p>
                        <b>Position</b>:
                        <space></space>
                        <input type="number" value="${entity.Position.X}" onchange="bindEntity(${index}, 'X', this.value)">
                        <space></space> , <space></space>
                        <input type="number" value="${entity.Position.Y}" onchange="bindEntity(${index}, 'Y', this.value)">
                    </p>`;
    }

    if (entity.Size) {
        html += `   <p>
                        <b>Size</b>:
                        <space></space>
                        <input type="number" value="${entity.Size.X}" onchange="bindEntity(${index}, 'W', this.value)">
                        <space></space> x <space></space>
                        <input type="number" value="${entity.Size.Y}" onchange="bindEntity(${index}, 'H', this.value)">
                    </p>`;
    }

    if (entity.Buffs) {
        html += `<p>
                    <b>Buffs:</b>
                    <space></space>
                    <button onclick="_Blueprint.getEntity(${index}).removeBuff()">-</button>
                    <button onclick="_Blueprint.getEntity(${index}).addBuff()">+</button>
                </p>
                <ul>`;

        i = 0;
        for (let b of entity.Buffs) {
            html += `<li><b>${i}</b>: <space></space>`;
            html += $idInput(i, b, 'BuffsList', `ent_${index}_buff_`, `bindEntity(${index}, 'Buff', this.value, ${i})`);
            i++;
            html += '</li>';
        }
        html += '</ul>';
    }

    i = 0;

    // -- Generic properties --
    for (let {Key, Value} of entity.getPropertyList()) {
        html += `<p>
                    <b>${Key}</b>:
                    <space></space>`;
        if ($(Key+'List')) {
            html += $idInput(i, Value, Key+'List', `ent_${index}_prop_`, `bindEntity(${index}, 'Prop', this.value, '${Key}')`);
        } else {
            html += `<input id="ent_${index}_prop_${i}" value="${Value}" onchange="bindEntity(${index}, 'Prop', this.value, '${Key}')"/>`;
        }
        html +=`    <space></space>
                    <button onclick="_Blueprint.getEntity(${index}).removeProperty('${Key}')">🗑</button>
                </p>`;
    }

    // -- Special properties --
    if (entity.Projectile !== null) {
        html +=`<p>
                    <b>Projectile:</b>
                    <space></space>`;
        html += $idInput(index, entity.Projectile, 'ProjectilesList', `ent_proj_`, `bindEntity(${index}, 'Prop', this.value, 'Projectile')`);
        html += `   <button onclick="_Blueprint.getEntity(${index}).removeProjectile()">🗑</button>
                </p>`;
    }

    if (entity.Spawnable !== null) {
        if (entity.isStack) {
            html+=` <p>
                        <b>Spawnable:</b>
                        <space></space>`;
            html += $idInput(index, entity.Spawnable, 'SpawnablesList', `ent_spawnable_`, `bindEntity(${index}, 'Prop', this.value, 'Spawnable')`);
            html += `<button onclick="_Blueprint.getEntity(${index}).setProperty('Spawnable', null)">🗑</button>
                </p>`;
        } else {
            html+=` <p>
                        <b>Spawnable:</b>
                        <space></space>
                        <button onclick="_Blueprint.getEntity(${index}).setProperty('Spawnable', null)">🗑</button>`;
            html += `<fieldset id="fldEnt_${index}_spawnable">`;
            html += renderEntity(entity.Spawnable, -index-1);
            html += `</fieldset>`;
        }
    }

    if (entity.Receivable !== null) {
        if (entity.isStack) {
            html+=` <p>
                        <b>Receivable:</b>
                        <space></space>`;
            html += $idInput(index, entity.Receivable, 'ReceivablesList', `ent_receivable_`, `bindEntity(${index}, 'Prop', this.value, 'Receivable')`);
            html += `<button onclick="_Blueprint.getEntity(${index}).setProperty('Receivable', null)">🗑</button>
                </p>`;
        } else {
            html+=` <p>
                        <b>Receivable:</b>
                        <space></space>
                        <button onclick="_Blueprint.getEntity(${index}).setProperty('Receivable', null)">🗑</button>`;
            html += `<fieldset id="fldEnt_${index}_receivable">`;
            html += renderEntity(entity.Receivable, -index-1);
            html += `</fieldset>`;
        }
    }

    //'Add property' button
    html += `<p>
                <input id="ent_${index}_newprop">
                <button onclick="
                    let txt = $('ent_${index}_newprop');
                    _Blueprint.getEntity(${index}).addProperty(txt.value);
                ">Add property</button>
            </p>
        </fieldset>`;
    return html;
}