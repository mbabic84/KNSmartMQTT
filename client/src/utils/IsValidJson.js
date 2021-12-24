export default function (json) {
    try {
        const config = JSON.parse(json);
        if (config && typeof config === 'object') {
            return true;
        }
    } catch (e) {
    }

    return false;
}