class Entity {
    /**
     * Stores and handles Entity data
     * @param {object} obj - JSON data for this entity
     * @param {Entity} stack - Parent entity (used with spawnable/receivable properties)
     */
    constructor(obj, stack = undefined) {
        this.Parent = stack;
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
        this.Message = null;
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
                case "Message":
                    this.Message = obj[prop];
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

    /**
     * Returns a list of all generic properties.
     * @returns [{Key, Value}]
     */
    getPropertyList() {
        let list = [];
        for (let prop in this.Properties) {
            list.push({ "Key": prop, "Value": this.Properties[prop] });
        }
        return list;
    }

    /**
     * Sets the value of a generic property.
     * @param {string} Key 
     * @param {string} Value 
     */
    setProperty(Key, Value){
        this.Properties[Key] = Value;
        renderEntities();
        encodeBP();
    }

    /**
     * Adds an empty buff field.
     */
    addBuff() {
        this.Buffs.push("");
        renderEntities();
        encodeBP();
    }

    /**
     * Sets the buff ID at the specified index.
     * @param {string} buff 
     * @param {number} index 
     */
    setBuff(buff, index) {
        this.Buffs[index] = buff;
        renderEntities();
        encodeBP();
    }

    /**
     * Removes the last buff in the list.
     */
    removeBuff() {
        this.Buffs.pop();
        renderEntities();
        encodeBP();
    }

    /**
     * Removes the Spawnable property.
     */
    removeSpawnable() {
        this.Spawnable = null;
        renderEntities();
        encodeBP();
    }

    /**
     * Removes the Receivable property.
     */
    removeReceivable() {
        this.Receivable = null;
        renderEntities();
        encodeBP();
    }

    /**
     * Removes the Message property.
     */
    removeMessage() {
        this.Message = null;
        renderEntities();
        encodeBP();
    }

    /**
     * Removes the Projectile property.
     */
    removeProjectile() {
        this.Projectile = null;
        renderEntities();
        encodeBP();
    }

    /**
     * Adds a property with a given name. Some properties are handled as special cases, the rest are generic fields.
     * @param {string} key 
     */
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
            case "Message":
                this.Message = "";
                break;
            default:
                this.Properties[key] = null;
                break;
        }
        renderEntities();
        encodeBP();
    }

    /**
     * Removes a generic property.
     * @param {string} key 
     */
    removeProperty(key) {
        delete this.Properties[key];
        renderEntities();
        encodeBP();
    }

    /**
     * Stores this Entity's data as a JSON object, converting namespaces back into QM IDs.
     * @returns {object} entity data object
     */
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

        //Message
        if (this.Message) {
            obj.Message = this.Message;
        }

        //Spawnable
        if (this.Spawnable) {
            obj["Spawnable"] = this.isStack
                ? (
                    this.Spawnable
                        ? toID('Spawnables', this.Spawnable)
                        : null
                )
                : (this.Spawnable)?.toJson();
        }

        //Receivable
        if (this.Receivable) {
            obj["Receivable"] = this.isStack
                ? (
                    this.Spawnable
                        ? toID('Spawnables', this.Spawnable)
                        : null
                )
                : (this.Spawnable)?.toJson();
        }

        //Projectile
        if (this.Projectile) {
            obj["Projectile"] = toID('Spawnables', this.Projectile);
        }
        
        //Generics
        for (let prop in this.Properties) {
            if (prop === "default")
                continue;
            // If this property has a set of values specified in GUIDs 
            if (checkNamespace(prop))
                obj[prop] = toID(prop, this.Properties[prop]);
            else
                obj[prop] = this.Properties[prop];
        }

        return obj;
    }
}