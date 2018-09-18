import * as websocket from '../services/websocket.js';

const garageDoorIdx = 551;

export default {
    template: `
    <section>
        <h1>Doors:</h1>
        <table>
            <tr v-if="garageDoorIsOpen !== undefined"><td>Garage door</td><td>{{garageDoorIsOpen ? 'open!' : 'closed'}}</td></tr>
        </table>
    </section>
    `,
    data() {
        return {
            garageDoorIsOpen: undefined,
        };
    },
    created() {
        websocket.onIdx(garageDoorIdx, device => this.garageDoorIsOpen = device.nvalue !== 0);
    },
}
