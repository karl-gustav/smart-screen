import store from '../store.js';

export default {
    template: `
    <section :style="sectionStyle">
        <h1 :style="hStyle">{{monthName}}</h1>
        <table :style="tableStyle">
            <tr>
                <th>M</th>
                <th>T</th>
                <th>O</th>
                <th>T</th>
                <th>F</th>
                <th>L</th>
                <th>S</th>
            </tr>
            <tr v-for="week in weeks">
                <td v-for="day in week" :style="day === today ? active : {}">
                    {{day}}
                </td>
            </tr>
        </table>
    </section>
    `,
    data() {
        return {
            sectionStyle: {
                "display": "flex",
                "flex-flow": "column wrap",
                "align-items": "center",
                "justify-content": "center",
            },
            hStyle: {
                "margin": 0,
            },
            tableStyle: {
                "text-align": "center",
                "vertical-align": "middle",
            },
            active: {
                "border-radius": "25%",
                "background-color": "rgba(238, 238, 238, 0.35)"
            },
        };
    },
    computed: {
        today() {
            return store.state.hourTick.getDate();
        },
        weeks() {
            return getWeeksArray(store.state.hourTick);
        },
        monthName() {
            return getMonthNameNo(store.state.hourTick);
        },
    },
}

function getWeeksArray(date) {
    return chunkArray(getDaysArray(date), 7);
}

function getMonthNameNo(date) {
    const monthNames = ["Januar","Februar","Mars","April","Mai","Juni","Juli","August","September","Oktober","November","Desember"];
    return monthNames[date.getMonth()];
}

function getDaysArray(date) {
    const firstWeekDay = getWeekdayOfFirstDayInMonth(date);
    const daysInMonth = getDaysInMonth(date);
    const days = Array(firstWeekDay); // fill days from previous months with empty
    for (var i = 1; i<(daysInMonth+1);i++) {
        days.push(i)
    }
    return days;
}

function getWeekdayOfFirstDayInMonth(date) {
    // Monday as nr 1, sunday as 7
    const first = firstDayMonth(date).getDay();
    return first === 0 ? 7 : first - 1;
}

function firstDayMonth(date) {
    return new Date(date.getFullYear(), date.getMonth());
}
function lastDayMonth(date) {
    return new Date(date.getFullYear(), date.getMonth()+1, 0);
}

function getDaysInMonth(date) {
    return lastDayMonth(date).getDate();
}

function chunkArray(array, size) {
    let chunks = [];
    for (let i=0,j=array.length; i<j; i+=size) {
        chunks.push(array.slice(i,i+size));
    }
    return chunks;
}
