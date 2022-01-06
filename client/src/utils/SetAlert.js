import PubSub from 'pubsub-js';

import Constants from '../Constants';

export default function (message, type) {
    PubSub.publish(
        Constants.pubsub.topics.alert,
        { message, type }
    );
}