/**
 * Stores the value of an element into a blueprint's palette.
 * Input element must have data-index attribute.
 * @param {HTMLInputElement} elem 
 */
function bindPalette(elem) {
    _Blueprint.Tilemaps.setPalette(elem.value, elem.dataset.index);
}

/**
 * Stores the value of an element into an entity's property.
 * @param {number} entityIndex - Entity position in blueprint list
 * @param {string} param - Property to modify
 * @param {string} value - Value of the property
 * @param {string} param2 - Extra argument (used for Prop and Buff)
 */
function bindEntity(entityIndex, param, value, param2 = undefined) {
    let ent = null;
    if (entityIndex<0) {
        let realIndex = Math.abs(entityIndex)-1;
        ent = _Blueprint.Entities[realIndex];
        ent = ent.Spawnable ?? ent.Receivable;
    } else
        ent = _Blueprint.Entities[entityIndex];
    switch (param) {
        case 'Id':
            ent.Id = value;
            break;
        case 'X':
            ent.Position.X = value;
            break;
        case 'Y':
            ent.Position.Y = value;
            break;
        case 'W':
            ent.Size.X = value;
            break;
        case 'H':
            ent.Size.Y = value;
            break;
        case 'Buff':
            ent.Buffs[param2] = value;
            break;
        case 'Prop':
            ent.Properties[param2] = value;
            break;
        default:
            throw new Error(`Unimplemented entity property: ${param}`);
    }
    updateEntity(ent, entityIndex);
}