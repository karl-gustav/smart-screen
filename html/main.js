import store from './store.js';
import './components/index.js';
import * as websocket from './services/websocket.js';

console.log("Connecting to websocket")
websocket.connect(`ws://${location.host}/ws`)

new Vue({
    template: `
        <section>
            <header></header>
            <main class="widgets">
                <clock class="widget"></clock>
                <calendar class="widget"></calendar>
                <power class="widget fixedwidth"></power>
                <temperature class="widget small"></temperature>
                <weather class="widget"></weather>
                <doors class="widget"></doors>
                <ventilation class="widget"></ventilation>
                <yr class="widget"></yr>
            </main>
            <footer></footer>
        </section>
    `,
    store,
}).$mount('#app');
