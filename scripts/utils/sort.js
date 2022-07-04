const sort_by_alphabet = (table, column) => {
    return table.sort((a, b) => a[column].localeCompare(b[column]));
}

export default sort_by_alphabet;