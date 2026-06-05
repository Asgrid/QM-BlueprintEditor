function renderPalette() {
    let palList = $('bpPalettes');
    let html = '';
    let i = 0;
    for (let pal of _Blueprint.Tilemaps.Palette) {
        html+=`<li><p><b>${i}</b>:<space></space>`;
        html+=$idInput(i, pal, 'tileList', 'pal', 'bindPalette(this)');
        html+=`</p></li>`;
        i+=1;
    }
    palList.innerHTML = html;
}

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

function updateEntity(entity, index){
    $('fldEnt_'+index).innerHTML = renderEntity(entity, index);
}

function renderEntity(entity, index) {
    let i;
    let html =  `   <legend>${entity.Id}</legend>
                    <p>
                        <b>Id</b>:<space></space>`;
    html+=$idInput(index, entity.Id, 'entityList', 'ent_id', `bindEntity(${index}, 'Id', this.value)`);
    html += `           <space></space>
                        <button onclick="_Blueprint.RemoveEntity(${index})">🗑</button>
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
                    <button onclick="_Blueprint.Entities[${index}].removeBuff()">-</button>
                    <button onclick="_Blueprint.Entities[${index}].addBuff()">+</button>
                </p>
                <ul>`;

        i = 0;
        for (let b of entity.Buffs) {
            html += `<li><b>${i}</b>: <space></space>`;
            html += $idInput(i, b, 'buffList', `ent_${index}_buff_`, `bindEntity(${index}, 'Buff', this.value, ${i})`);
            i++;
            html += '</li>';
        }
        html += '</ul>';
    }

    i = 0;
    for (let {Key, Value} of entity.getPropertyList()) {
        html += `<p>
                    <b>${Key}</b>:
                    <space></space>`;
        if (checkNamespace('Props.'+Key)) {
            html += $idInput(i, Value, Key+'List', `ent_${index}_prop_`, `bindEntity(${index}, 'Prop', this.value, '${Key}')`);
        } else {
            html += `<input id="ent_${index}_prop_${i}" value="${Value}" onchange="bindEntity(${index}, 'Prop', this.value, '${Key}')"/>`;
        }
        html +=`    <space></space>
                    <button onclick="_Blueprint.Entities[${index}].removeProperty('${Key}')">🗑</button>
                </p>`;
    }

    if (entity.Projectile !== null) {
        html +=`<p>
                    <b>Projectile:</b>
                    <space></space>`;
        html += $idInput(index, entity.Projectile, 'projectileList', `ent_proj_`, `bindEntity(${index}, 'Prop', this.value, 'Projectile')`);
        html += `   <button onclick="_Blueprint.Entities[${index}].removeProjectile()">🗑</button>
                </p>`;
    }

    if (entity.Spawnable !== null) {
        if (entity.isStack) {
            html+=` <p>
                        <b>Spawnable:</b>
                        <space></space>`;
            html += $idInput(index, entity.Spawnable, 'spawnableList', `ent_spawnable_`, `bindEntity(${index}, 'Prop', this.value, 'Spawnable')`);
            html += `<button onclick="_Blueprint.Entities[${index}].setProperty('Spawnable', null)">🗑</button>
                </p>`;
        } else {
            html+=` <p>
                        <b>Spawnable:</b>
                        <space></space>
                        <button onclick="_Blueprint.Entities[${index}].setProperty('Spawnable', null)">🗑</button>`;
            html += renderEntity(entity.Spawnable, -1);
        }
    }

    html += `<p>
                <input id="ent_${index}_newprop">
                <button onclick="
                    let txt = $('ent_${index}_newprop');
                    _Blueprint.Entities[${index}].addProperty(txt.value);
                ">Add property</button>
            </p>
        </fieldset>`;
    return html;
}