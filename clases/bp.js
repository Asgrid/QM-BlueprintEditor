/**
 * Stores all blueprint data
 */
class Blueprint {
    /**
     * Creates blueprint object from base64 string.
     */
    constructor(text) {
        if (!text)
            return;
        try{
            let decode = atob(text);
            let obj = JSON.parse(decode);
            this.Version = obj.Version;
            this.Error = false;
            this.Size = obj.Size;
            this.Tilemaps = new Tilemap(obj.Tilemaps, obj.Size.X, obj.Size.Y);
            this.Entities = [];
            for (var ent of obj.Entities){
                this.Entities.push(new Entity(ent));
            }
        }catch(e){
            this.Error = true;
            console.log(e);
        }
    }

    setWidth(w) {
        this.Size.X = w;
        this.Tilemaps.setWidth(w);
        renderLayers();
        encodeBP();
    }

    setHeight(h) {
        this.Size.Y = h;
        this.Tilemaps.setHeight(h);
        renderLayers();
        encodeBP();
    }

    addEntity() {
        this.Entities.push(new Entity({}));
        renderEntities();
        encodeBP();
    }

    removeEntity(index){
        this.Entities.splice(index, 1);
        renderEntities();
        encodeBP();
    }

    /**
     * Encodes the blueprint data back into text.
     * @returns {string} base64 encoded text
     */
    toBase64() {
        try{
            let obj = {
                "Version": this.Version,
                "Size": this.Size,
                "Entities": this.Entities.map((e)=>e.toJson()),
                "Tilemaps": this.Tilemaps.toJSON()
            }
            let json = JSON.stringify(obj);
            let encode = btoa(json);
            this.Error=false;
            return encode;
        }catch (e){
            this.Error=true;
            console.log(e);
            throw e;
        }
    }
}