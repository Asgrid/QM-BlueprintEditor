function $(id) { return document.getElementById(id); }
function $$(select) { return document.querySelectorAll(select); }

var _Blueprint = undefined;

/**
 * Page initialization.
 */
function init() {
    loadGUIDs();
}

/**
 * Default test blueprint to make sure everything works.
 * Contains a brazier with all available properties set to a non-default option.
 */
function defaultBP() {
    $('txtBlueprint').value = 'eyJWZXJzaW9uIjoiMC4xMS4yMS44IiwiU2l6ZSI6eyJYIjoxLCJZIjoxfSwiRW50aXRpZXMiOlt7IkVudGl0eSI6IlF1ZXN0TWFzdGVyOkJyYXppZXIiLCJQb3NpdGlvbiI6eyJYIjowLjAsIlkiOjAuMH0sIkNvbmRpdGlvbiI6ImM0NGVhOTRhNmI4ZmY0ZTMwOTIyNmE1NDQ3YzI4NDU4IiwiR3JvdXAiOiIxN2Y1Y2Q0YjAzM2MzNDU0OWFlNDU4ZGYxZmUwZmFkMCIsIklsbHVtaW5hdGlvbiI6ZmFsc2UsIkJ1ZmZzIjpbIlF1ZXN0TWFzdGVyOkZpcmUiLCJRdWVzdE1hc3RlcjpFdGVybmFsbHlGcm96ZW4iXSwiU2l6ZSI6eyJYIjoxLCJZIjoxfSwiUHJvamVjdGlsZSI6IlF1ZXN0TWFzdGVyOkZpcmViYWxsIiwiSW52ZXJzaW9uIjoiUmVndWxhciIsIkR1cmF0aW9uIjoiUXVlc3RNYXN0ZXI6T25lU2Vjb25kIiwiSXNJbnZpc2libGUiOnRydWUsIkF0dGFjaG1lbnQiOiI3MWRjODhlZjFjNGZhNDUxZWI0ODA2OGI0NTBjMWMxMiIsIkZvY3VzIjoiUXVlc3RNYXN0ZXI6QWx3YXlzRm9jdXMifV0sIlRpbGVtYXBzIjp7IlBhbGV0dGUiOlsiUXVlc3RNYXN0ZXI6Rmxvb3IiXSwiUm9vbXMiOlt7IkJvdW5kcyI6eyJQb3NpdGlvbiI6eyJYIjotMywiWSI6NH0sIlNpemUiOnsiWCI6MSwiWSI6MX19LCJUaWxlbWFwcyI6eyI5ZjVhMjM1ZjA4MzkzODE0NWJmMWEyODZkM2YzMzU2MiI6IkFBPT0ifX1dLCJPZmZzZXQiOnsiWCI6LTMsIlkiOjR9fX0=';
    decodeBP();
}

/**
 * Decodes the entered base64 text into blueprint data and renders the form.
 */
function decodeBP() {
    let txt = $('txtBlueprint').value;
    if (!txt)
        return;
    let bp = _Blueprint = new Blueprint(txt);
    if (bp.Error) {
        $('divMain').style.display = 'none';
        $('divBPError').style.display = 'block';
        return;
    }

    $('divMain').style.display = 'block';
    $('divBPError').style.display = 'none';
    $('txtWidth').value = bp.Size.X;
    $('txtHeight').value = bp.Size.Y;
    $('lblVersion').value = bp.Version;

    renderPalette();
    renderLayers();
    renderEntities();
}

/**
 * Re-encodes the blueprint data into base64.
 */
function encodeBP() {
    $('txtBlueprint').value = _Blueprint.toBase64();
}