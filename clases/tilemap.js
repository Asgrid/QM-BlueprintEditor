class Tilemap {
    /**
     * Stores and handles map data
     * @param {object} obj - JSON data for this tilemap
     * @param {number} w - tilemap width
     * @param {number} h - tilemap height
     * @returns 
     */
    constructor (obj, w, h) {
        if (!obj)
            return;

        this.width = w;
        this.height = h;

        // Converts tile GUIDs into readable names
        this.palette = obj.Palette.map(toNamespace);
        this.layermaps = [];
        let mainRoom = obj.Rooms[0];

        if (!mainRoom)
            throw new Error("No rooms???");

        for (const k in mainRoom.Tilemaps){
            if (k==="default")
                continue;
            // Converts layer GUIDs into readable names, and stores the associated tile data
            this.layermaps.push({layer: toNamespace(k), tiles: this.tilemap_to_bytes(mainRoom.Tilemaps[k])});
        }
    }

    /**
     * Transforms a base64 string into an array of bytes, which is how the game stores map data.
     * @param {string} base64 
     * @returns {Array<number>}
     */
    tilemap_to_bytes(base64) {
        return Array.from(Uint8Array.from(atob(base64), c => c.charCodeAt(0)))
    }

    /**
     * Transforms an array of bytes into a base64 string.
     * @param {Array<number>} array 
     * @returns {string}
     */
    bytes_to_tilemap(array){
        let t = "";
        for (const c of array){
            t+=String.fromCharCode(c);
        }
        return btoa(t);
    }

    /**
     * Changes the width of the tilemap and re-adjusts the present tiles.
     * @param {number} w 
     */
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

    /**
     * Changes the height of the tilemap and re-adjusts the present tiles.
     * @param {number} h 
     */
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

    /**
     * Sets the tile ID to be used in the palette at the specified index.
     * @param {string} guid
     * @param {number} index 
     */
    setPalette(guid, index) {
        this.palette[index] = guid;
        renderPalette();
        encodeBP();
    }

    /**
     * Sets the layer ID to be used at the specified index.
     * @param {string} guid 
     * @param {number} index 
     */
    setLayer(guid, index) {
        this.layermaps[index].layer = guid;
        renderLayers();
        encodeBP();
    }

    /**
     * Sets the palette index to be used at the specified layer and position.
     * @param {number} tile - Palette index
     * @param {number} layer - Layer index
     * @param {number} index - Tile index
     */
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

    /**
     * Adds a floor tile to the palette list.
     */
    addPalette() {
        this.palette.push("Tiles.Floor");
        renderPalette();
        encodeBP();
    }

    /**
     * Removes the last tile from the palette list.
     */
    removePalette() {
        if (this.palette.length>1){
            this.palette.pop();
            renderPalette();
            encodeBP();
        }
    }

    /**
     * Adds a floor layer to the list.
     */
    addLayer() {
        this.layermaps.push({layer:"Layers.Floor", tiles: Array(this.width*this.height).fill(255)});
        renderLayers();
        encodeBP();
    }

    /**
     * Removes the last layer from the list.
     */
    removeLayer() {
        if (this.layermaps.length>1){
            this.layermaps.pop();
            renderLayers();
            encodeBP();
        }
    }

    /**
     * Stores the tilemap data into a JSON object.
     * @returns {string}
     */
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