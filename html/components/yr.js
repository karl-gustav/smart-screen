import store from '../store.js';

const URL = 'https://www.yr.no/place/Norway/Rogaland/Haugesund/Sk%C3%A5redal/avansert_meteogram.svg';

export default {
    template: `
    <section>
        <img :src="url" :style="imgStyle">
    </section>
    `,
    data() {
        return {
            url: '',
            imgStyle: {
                "display": "block",
                "margin": "auto",
            },
        };
    },
    created() {
        store.watch(state => state.hourTick, state => this.url = URL + '?' + new Date().getTime());
    },
};
