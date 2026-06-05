function $idInput(index, value, datalist, name, callback) {
    return `<input list="${datalist}" data-index=${index} id="${name}${index}" value="${value}" onchange="${callback}"/>`;
}

function $layerInput(index, layer, tiles) {    
    let html = `<li><input list="layerList" data-index="${index}" id="lay${index}" value="${layer}"
                    onchange="_Blueprint.Tilemaps.setLayer(this.value, ${index})"><space></space>`;
    let ti = 0;
    for (let t of tiles) {
        html+=`<input type="number" class="tileIndex" id="tile_${index}_${ti}" value="${t==255 ? -1 : t}"
                onchange="_Blueprint.Tilemaps.setTile(this.value, ${index}, ${ti});">`;
        ti+=1;
    }
    html+='</li>';
    return html;
}

function $gridInput(index, layer, tiles) {
    let w = _Blueprint.Size.X;
    let h = _Blueprint.Size.Y;
    let html = `<li><input list="layerList" data-index="${index}" id="lay${index}" value="${layer}"
                    onchange="_Blueprint.Tilemaps.setLayer(this.value, ${index})">
                <table class="tileGrid" style="--bpWidth: ${w}; --bpHeight: ${h}">
                    <tbody>
                        <tr>`;
    let i = 0;
    let ti = 0;
    for (let t of tiles) {
        html+=`<td><input type="number" class="tileIndex" id="tile_${index}_${ti}" value="${t==255 ? -1 : t}"
                onchange="_Blueprint.Tilemaps.setTile(this.value, ${index}, ${ti});"></td>`;
        i++;
        ti++;
        if (i==w){
            html+='</tr><tr>';
            i=0;
        }
    }
    html+='</tr></tbody></table></li>';
    return html;
}