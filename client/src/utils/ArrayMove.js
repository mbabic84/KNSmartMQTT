export default function (array, oldIndex, newIndex) {
    const arrayToModify = [...array];
    const element = arrayToModify[oldIndex];

    arrayToModify.splice(oldIndex, 1);
    arrayToModify.splice(newIndex, 0, element);

    return arrayToModify;
}