import * as websocket from '../services/websocket.js';

const bedroomIdx = 57;
const livingRoomIdx = 55;
const outsideIdx = 85;

export default {
    template: `
    <section>
        <h1>Temperatures:</h1>
        <table>
            <tr v-if="outsideTemp"><td>Outside</td><td>{{outsideTemp}}°</td></tr>
            <tr v-if="bedroomTemp"><td>Bedroom</td><td>{{bedroomTemp}}°</td></tr>
            <tr v-if="livingRoomTemp"><td>Living room</td><td>{{livingRoomTemp}}°</td></tr>
            <tr v-if="livingRoomMoisture"><td>Moisture</td><td>{{livingRoomMoisture}} %</td></tr>
        </table>
    </section>
    `,
    data() {
        return {
            outsideTemp: undefined,
            livingRoomTemp: undefined,
            livingRoomMoisture: undefined,
            bedroomTemp: undefined,
        };
    },
    created() {
        websocket.onIdx(outsideIdx, device => this.outsideTemp = device.svalue[0]);
        websocket.onIdx(livingRoomIdx, device => {
            this.livingRoomTemp = device.svalue[0];
            this.livingRoomMoisture = device.svalue[1];
        });
        websocket.onIdx(bedroomIdx, device => this.bedroomTemp = device.svalue[0]);
    },
}
