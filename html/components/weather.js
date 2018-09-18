import * as websocket from '../services/websocket.js';
import store from '../store.js';
import {getSunRiseSet} from '../services/fetch_helper.js';
import {show} from '../services/error_banner.js';

const windSpeedIdx = 594;
const bedroomIdx = 57;

export default {
    template: `
    <section>
        <h1>Weather:</h1>
        <table>
            <tr v-if="windSpeed"><td>Wind speed</td><td>{{windSpeed}} m/s</td></tr>
            <tr v-if="pressure"><td>Pressure</td><td>{{pressure}} hPa</td></tr>
            <tr v-if="untilSunset && untilSunset.seconds >= 0">
                <td>Sunset</td>
                <td>{{untilSunset.hours}}h {{untilSunset.minutes}}m</td>
            </tr>
            <tr v-if="untilSunrise && untilSunrise.seconds >= 0">
                <td>Sunrise</td>
                <td>{{untilSunrise.hours}}h {{untilSunrise.minutes}}m</td>
            </tr>
        </table>
    </section>
    `,
    data() {
        return {
            windSpeed: undefined,
            pressure: undefined,
            untilSunset: undefined,
            untilSunrise: undefined,
            sunRiseSet: undefined,
        };
    },
    created() {
        websocket.onIdx(windSpeedIdx, device => this.windSpeed = (parseFloat(device.svalue[2])/10).toFixed(1));
        websocket.onIdx(bedroomIdx, device => this.pressure = device.svalue[3]);
        store.watch(state => state.hourTick, now =>
            getSunRiseSet()
                .then(sunRiseSet => this.sunRiseSet = sunRiseSet)
                .catch(err => show(`Got error when getting sun rise/set data: ${err}`))
        );
        store.watch(state => state.secondTick, now => {
            if (this.sunRiseSet) {
                const serverTime = new Date(this.sunRiseSet.ServerTime);
                this.untilSunset = timeDiff(setTimeOnDate(this.sunRiseSet.Sunset, serverTime), now);
                this.untilSunrise = timeDiff(setTimeOnDate(this.sunRiseSet.Sunrise, serverTime), now);
            }
        });
    },
};

function setTimeOnDate(time, date) {
    const parts = time.split(':');
    const hours = +parts[0];
    const minutes = +parts[1];
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
}

function timeDiff(time1, time2) {
    const output = {}
    let totalSeconds = (time1.getTime() - time2.getTime()) / 1000;
    output.hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    output.minutes = Math.floor(totalSeconds / 60);
    output.seconds = Math.floor(totalSeconds % 60);
    return output;
}