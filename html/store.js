const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const store = new Vuex.Store({
    state: {
        secondTick: new Date(),
        minuteTick: new Date(),
        hourTick: new Date(),
        dayTick: new Date(),
    },
    actions: {
        startTimers({ commit }) {
            setInterval(() => {
                commit('tickSecond');
            }, second);

            setInterval(() => {
                commit('tickMinute');
            }, minute);

            setInterval(() => {
                commit('tickHour');
            }, hour);

            setInterval(() => {
                commit('tickDay');
            }, day);

            setTimeout(() => {
                commit('tickSecond');
                commit('tickMinute');
                commit('tickHour');
                commit('tickDay');
            });
        },
    },
    mutations: {
        tickSecond(state) {
            state.secondTick = new Date();
        },
        tickMinute(state) {
            state.minuteTick = new Date();
        },
        tickHour(state) {
            state.hourTick = new Date();
        },
        tickDay(state) {
            state.dayTick = new Date();
        },
    },
});

store.dispatch('startTimers');

export default store;
