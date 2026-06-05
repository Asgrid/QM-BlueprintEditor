class Tilemap {
    constructor (obj, w, h) {
        if (!obj)
            return;
        this.width = w;
        this.height = h;
        this.palette = obj.Palette.map(toNamespace);
        this.layermaps = [];
        let mainRoom = obj.Rooms[0];
        if (!mainRoom)
            throw new Error("No rooms???");
        for (const k in mainRoom.Tilemaps){
            if (k==="default")
                continue;
            this.layermaps.push({layer: toNamespace(k), tiles: this.tilemap_to_bytes(mainRoom.Tilemaps[k])});
        }
    }

    tilemap_to_bytes(base64) {
        return Array.from(Uint8Array.from(atob(base64), c => c.charCodeAt(0)))
    }

    bytes_to_tilemap(array){
        let t = "";
        for (const c of array){
            t+=String.fromCharCode(c);
        }
        return btoa(t);
    }

    get Layers(){
        return this.layermaps;
    }

    get Palette(){
        return this.palette;
    }

    setWidth(w) {
        let prevLength = this.width * this.height;
        this.width = Math.max(1, w);
        let newLength = this.width * this.height;

        for (var layer of this.layermaps) {
            layer.tiles.length = newLength;
            if (newLength > prevLength){
                layer.tiles.fill(0, -(newLength-prevLength))
            }
        }
    }

    setHeight(h) {
        let prevLength = this.width * this.height;
        this.height = Math.max(1, h);
        let newLength = this.width * this.height;

        for (var layer of this.layermaps) {
            layer.tiles.length = newLength;
            if (newLength > prevLength) {
                layer.tiles.fill(0, -(newLength-prevLength))
            }
        }
    }

    setPalette(guid, index) {
        this.palette[index] = guid;
        renderPalette();
        encodeBP();
    }

    setLayer(guid, index) {
        this.layermaps[index].layer = guid;
        renderLayers();
        encodeBP();
    }

    setTile(tile, layer, index) {
        if (tile == -1)
            tile=255;
        else if (tile < -1)
            tile = this.palette.length - 1;
        else if (tile>=this.palette.length)
            tile = 0;
        this.layermaps[layer].tiles[index] = tile;
        renderLayers();
        encodeBP();
    }

    addPalette() {
        this.palette.push("Tiles.Floor");
        renderPalette();
        encodeBP();
    }

    removePalette() {
        if (this.palette.length>1){
            this.palette.pop();
            renderPalette();
            encodeBP();
        }
    }

    addLayer() {
        this.layermaps.push({layer:"Layers.Floor", tiles: Array(this.width*this.height).fill(255)});
        renderLayers();
        encodeBP();
    }

    removeLayer() {
        if (this.layermaps.length>1){
            this.layermaps.pop();
            renderLayers();
            encodeBP();
        }
    }

    toJSON() {
        let paletteList = this.palette.map(toIDMap('Tiles'))
        let layerList = {};
        for (const map of this.layermaps) {
            layerList[toID('Layers', map.layer)] = this.bytes_to_tilemap(map.tiles);
        }
        return {
            "Palette": paletteList,
            "Rooms": [{
                "Bounds": {
                    "Position":{
                        "X": 0,
                        "Y": 0
                    },
                    "Size": {
                        "X": this.width,
                        "Y": this.height
                    }
                },
                "Tilemaps": layerList
            }],
            "Offset": {
                "X": 0,
                "Y": 0
            }
        }
    }
}