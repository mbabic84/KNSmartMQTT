const indexes = {};

export function cycle(key, values) {
    let index = indexes[key] || 0;

    if (values.length <= index) {
        index = 0;
    }

    const value = values[index];

    indexes[key] = ++index;

    return value;
}