class Entity {
    /*
    Properties : {[k : string]: any} = $state({});
    Id : string = $state("");
    Size : {X : number, Y : number} = {X: 1, Y:1};
    Position : {X: number, Y : number} = {X: 0, Y: 0};
    Buffs: string[] = $state([]);
    Spawnable: Entity | string | null = $state(null);
    Receivable: Entity | string | null = $state(null);
    Projectile: string | null = $state(null);
    isStack : boolean = false;
    */

    constructor(obj, stack = undefined) {
        if (stack)
            this.isStack = true;
        else
            this.isStack = false;
        this.Properties = {};
        this.Id = '';
        this.Size = {X: 1, Y: 1};
        this.Position = {X: 0, Y: 0};
        this.Buffs = [];
        this.Spawnable = null;
        this.Receivable = null;
        this.Projectile = null;
        for (let prop in obj) {
            if (prop=='default') continue;
            switch (prop) {
                case "Entity":
                    this.Id = toNamespace(obj[prop]);
                    break;
                case "Size":
                    this.Size = obj[prop];
                    break;
                case "Position":
                    this.Position = obj[prop];
                    break;
                case "Buffs":
                    let list = [];
                    for (var buff of obj[prop]) {
                        list.push(toNamespace(buff));
                    }
                    this.Buffs = list;
                    break;
                case "Spawnable":
                    if (obj[prop] !== null) {
                        if (stack)
                            this.Spawnable = toNamespace(obj[prop]);
                        else
                            this.Spawnable = new Entity(obj[prop], this);
                    } else
                        this.Spawnable = null;
                    break;
                case "Receivable":
                    if (obj[prop] !== null) {
                        if (stack)
                            this.Receivable = toNamespace(obj[prop]);
                        else
                            this.Receivable = new Entity(obj[prop], this);
                    } else
                        this.Receivable = null;
                    break;
                case "Projectile":
                    this.Projectile = toNamespace(obj[prop]);
                    break;
                default:
                    this.Properties[prop] = toNamespace(obj[prop]);
                    break;
            }
        }
    }

    getPropertyList() {
        let list = [];
        for (let prop in this.Properties) {
            list.push({ "Key": prop, "Value": this.Properties[prop] });
        }
        return list;
    }

    setProperty(Key, Value){
        this.Properties[Key] = Value;
        renderEntities();
        encodeBP();
    }

    addBuff() {
        this.Buffs.push("");
        renderEntities();
        encodeBP();
    }

    setBuff(buff, index) {
        this.Buffs[index] = buff;
        renderEntities();
        encodeBP();
    }

    removeBuff() {
        this.Buffs.pop();
        renderEntities();
        encodeBP();
    }

    removeSpawnable() {
        this.Spawnable = null;
        renderEntities();
        encodeBP();
    }

    removeProjectile() {
        this.Projectile = null;
        renderEntities();
        encodeBP();
    }

    addProperty(key) {
        switch (key) {
            case "Spawnable":
                if (this.isStack)
                    this.Spawnable = "?";
                else
                    this.Spawnable = new Entity({}, this);
                break;
            case "Receivable":
                if (this.isStack)
                    this.Receivable = "?";
                else
                    this.Receivable = new Entity({}, this);
                break;
            case "Projectile":
                this.Projectile = "?";
                break;
            default:
                this.Properties[key] = null;
                break;
        }
        renderEntities();
        encodeBP();
    }

    removeProperty(key) {
        delete this.Properties[key];
        renderEntities();
        encodeBP();
    }

    toJson() {
        let buffs = [];
        for (let b of this.Buffs) {
            buffs.push(toID('Buffs', b));
        }

        let obj = {
            "Entity": toID('Spawnables', this.Id),
            "Position": this.Position,
            "Size": this.Size,
            "Buffs": buffs
        };
        if (this.Spawnable) {
            obj["Spawnable"] = this.isStack
                ? (
                    this.Spawnable
                        ? toID('Spawnables', this.Spawnable)
                        : null
                )
                : (this.Spawnable)?.toJson();
        }
        if (this.Receivable) {
            obj["Receivable"] = this.isStack
                ? (
                    this.Spawnable
                        ? toID('Spawnables', this.Spawnable)
                        : null
                )
                : (this.Spawnable)?.toJson();
        }
        if (this.Projectile) {
            obj["Projectile"] = toID('Spawnables', this.Projectile);
        }
        for (let prop in this.Properties) {
            if (prop === "default")
                continue;
            if (checkNamespace(prop))
                obj[prop] = toID(prop, this.Properties[prop]);
            else
                obj[prop] = this.Properties[prop];
        }

        return obj;
    }
}