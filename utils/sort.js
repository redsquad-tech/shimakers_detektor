module.exports.sortByAlphabet = (table, column) => {
    return table.sort((a, b) => a[column].localeCompare(b[column]));
}