function bindPalette(elem) {
    _Blueprint.Tilemaps.setPalette(elem.value, elem.dataset.index);
}

function bindEntity(entityIndex, param, value, param2 = undefined) {
    let ent = _Blueprint.Entities[entityIndex];
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