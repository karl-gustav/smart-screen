import * as websocket from '../services/websocket.js';

const flexitHeatExchangerIdx = 83;
const flexitHeatingCoilIdx = 74;
const flexitThermostatIdx = 21;
const flexitInputAirIdx = 330;

export default {
    template: `
    <section>
        <h1>Ventilation:</h1>
        <table>
            <tr v-if="flexitHeatExchanger"><td>Heat Exchanger</td><td>{{flexitHeatExchanger}} %</td></tr>
            <tr v-if="flexitHeatingCoil"><td>Heat Element</td><td>{{flexitHeatingCoil}} %</td></tr>
            <tr v-if="flexitThermostat"><td>Thermostat</td><td>{{flexitThermostat}}°</td></tr>
            <tr v-if="flexitInputAir"><td>In air temperature</td><td>{{flexitInputAir}}°</td></tr>
        </table>
    </section>
    `,
    data() {
        return {
            flexitHeatExchanger: undefined,
            flexitHeatingCoil: undefined,
            flexitThermostat: undefined,
            flexitInputAir: undefined,
        };
    },
    created() {
        websocket.onIdx(flexitHeatExchangerIdx, device => this.flexitHeatExchanger = device.svalue[0]);
        websocket.onIdx(flexitHeatingCoilIdx, device => this.flexitHeatingCoil = device.svalue[0]);
        websocket.onIdx(flexitThermostatIdx, device => this.flexitThermostat = device.svalue[0]);
        websocket.onIdx(flexitInputAirIdx, device => this.flexitInputAir = device.svalue[0]);
    },
}
