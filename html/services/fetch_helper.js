import store from '../store.js';

const SERVER_URL = 'http://10.0.0.5';

export function getWatt() {
    return get(SERVER_URL + '/json.htm?type=graph&sensor=counter&idx=615&range=day&method=1');
}

export function getDomoticzTemperature(idx) {
    return getDomoticzDevice(idx)
        .then(device => device.Temp);
}

export function getDomoticzDevice(id) {
    return get(SERVER_URL + '/json.htm?type=devices&rid=' + id)
        .then(data => data.result[0]);
}

export function getSunRiseSet() {
    return get(SERVER_URL + '/json.htm?type=command&param=getSunRiseSet');
}

export function get(url) {
    return fetch(url, {
        method: 'GET',
    })
        .then(handleFetchError)
        .then(res => res.json());
}

function handleFetchError(response) {
    if (!response.ok) {
        throw Error(`Server returned a ${response.status} error!`);
    }
    return response;
}
