import store from '../store.js';

export default {
    template: `
        <h1 :style="clockStyle">{{clock}}</h1>
    `,
    data() {
        return {
            clockStyle: {
                "font-size": "15rem",
                "text-align": "center",
            },
        };
    },
    computed: {
        clock() {
            const now = store.state.secondTick;
            const hours = now.getHours().toString().padStart(2, 0);
            const minutes = now.getMinutes().toString().padStart(2, 0);
            return `${hours}:${minutes}`;
        },
    },
}
