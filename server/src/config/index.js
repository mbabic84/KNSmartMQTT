import _ from "lodash";

import pgConfig from "../pg/configuration.js";

import Constants from "../Constants.js";

async function get(key) {
    return _.merge(
        Constants.defaults?.[key] || {},
        await pgConfig.get(key)
    )
}

export default {
    get
}