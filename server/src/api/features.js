import pgFeatures from "../pg/features.js";
import pgHistory from "../pg/history.js";

async function get(request, response) {
    const features = await pgFeatures.get();
    response.send(features);
}

async function set(request, response) {
    const feature = await pgFeatures.set(request.body);
    response.send(feature);
}

async function setConfig(request, response) {
    const feature = await pgFeatures.setConfig(request.body);
    response.send(feature);
}

async function getChartData(request, response) {
    const chartData = await pgHistory
        .getForFeature({
            featureKey: request.query.featureKey,
            since: request.query.since
        });

    response.send(chartData);
}

export default {
    get,
    set,
    setConfig,
    getChartData
}