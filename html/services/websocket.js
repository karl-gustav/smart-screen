
import {show} from '../services/error_banner.js';
const listeners = new Map();
let ws;
let serverVersion;

const READY_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
}

export function connect(url) {
    ws = new WebSocket(url);
    ws.addEventListener('open', function (event) {
        console.log('Connected to WebSocket:', ws.url);
    });
    ws.addEventListener('close', function (err) {
        ws = null;
        show('Lost connection to WebSocket, retrying in 1 second: ' + JSON.stringify(err));
        setTimeout(() => connect(url), 1000);
    });
    ws.addEventListener('message', messageHandler);
}

export function onIdx(idx, fn) {
    listeners.set(idx, fn);
    send({
        refreshIdx: idx,
    });
}

export function send(message) {
    if (!ws || ws.readyState !== READY_STATE.OPEN) {
        setTimeout(() => send(message), 500);
    } else {
        console.log("sending ws message back to server", message)
        ws.send(JSON.stringify(message));
    }
}

function messageHandler(event) {
    const message = JSON.parse(event.data);
    if (!serverVersion) {
        serverVersion = message.serverVersion;
    }
    if (serverVersion !== message.serverVersion) {
        ws.close(1000, 'Reloading page because server version was different!');
        location.reload(true);
    }
    const listener = listeners.get(+message.device.idx);
    if (listener) {
        listener(message.device);
    }
    console.log('Got WebSocket message:', message)
};
