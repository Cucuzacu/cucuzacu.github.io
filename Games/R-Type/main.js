var tstates = 0;
var running;
var event_next_event;

function loadRomData()
{
    var path = "R-Type.sms";
    console.log("Loading ROM from " + path);
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.send(null);
    if (request.status !== 200 && request.status !== 0) return [];
    return request.response;
}

function loadGame()
{
    setTimeout(go, 100);
}

function go() {
    window.focus();
    z80_init();
    miracle_init();
    miracle_reset();
    loadRom('R-Type.sms', loadRomData());
    start();
    document.getElementById('screen').style.display = 'block';
}