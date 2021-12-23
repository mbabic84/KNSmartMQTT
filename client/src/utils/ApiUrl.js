import Config from "../Config"

export default function () {
    const protocol =
        Config.server?.protocol
        || window?.location?.protocol
        || "http";

    const hostname =
        Config.server?.host
        || window?.location?.hostname
        || "localhost";

    const port =
        Config.server?.port
        || window?.location?.port
        || '80';

    return `${protocol}//${hostname}:${port}`;
}