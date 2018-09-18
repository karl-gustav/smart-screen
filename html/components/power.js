import store from '../store.js';
import {getWatt} from '../services/fetch_helper.js';
import {show} from '../services/error_banner.js';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


export default {
    template: `
    <section id="container"></section>
    `,
    data() {
        return {};
    },
    mounted() {
        const chart = Highcharts.chart('container', {
          chart: {
            type: 'area'
          },
          title: {
            text: 'Power'
          },
          xAxis: {
            labels: {
                formatter() {
                    const date = new Date(this.value)
                    return `${date.getDate()}.${MONTH_NAMES[date.getMonth()]}`;
                },
            },
          },
          yAxis: {
            title: {
              text: 'Energy (Wh/W)'
            },
            labels: {
              formatter: function () {
                return this.value / 1000 + 'k';
              }
            }
          },
          backgroundColor: 'transparent',
          credits: {
            enabled: false
          },          series: [{
            name: 'Energy',
            data: []
          }, {
            name: 'power',
            data: []
          }]
        });

        store.watch(state => state.minuteTick, state =>
            getWatt()
                .then(function (response) {
                    const energy = response.result.filter(point => !!point.v);
                    const power = response.result.filter(point => !!point.eu);
                    return {
                        energy: energy.map(point => [Date.parse(point.d), +point.v]),
                        power: power.map(point => [Date.parse(point.d), +point.eu]),
                    };
                })
                .then(points => {
                    chart.series[0].setData(points.energy);
                    chart.series[1].setData(points.power);
                })
                .catch(err => show(`Got error in power.js widget: ${err}`))
        );

    },
}
