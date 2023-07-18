import axios from 'axios';

import { default as config } from '../config.mjs';

export async function emitMetric({ name, labelName, labelValue, source, metric }) {
    const payload = `${name},${labelName}=${labelValue},source=${source} metric=${metric}`;
    const response = await axios.post(
        `https://influx-prod-24-prod-eu-west-2.grafana.net/api/v1/push/influx/write`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${config.grafana.httpMetrics.userId}:${config.grafana.httpMetrics.apiKey}`,
                "Content-Type": "text/plain"
            }
        }
    );

    console.log(JSON.stringify({
        action: "grafana-emit",
        name,
        [labelName]: labelValue,
        source,
        metric,
        status: response.status
    }));
}