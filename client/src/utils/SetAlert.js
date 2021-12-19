import { v4 as uuid } from 'uuid';
import _ from 'lodash';

export default function (message, type, alerts, setAlerts) {
    setAlerts([
        ...alerts,
        {
            key: uuid(),
            type,
            message,
            created: Date.now()
        }
    ])
}