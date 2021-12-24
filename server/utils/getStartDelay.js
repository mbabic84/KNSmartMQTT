import moment from 'moment';

export default function (every, start) {
    let startFrom = start === "" ? moment.valueOf() : moment(start, ["H:m"]).valueOf();
    let currentTime = moment().valueOf();
    let delayedStartFrom = moment(startFrom + Math.ceil((currentTime - startFrom) / every) * every).valueOf();

    return delayedStartFrom - currentTime;
}