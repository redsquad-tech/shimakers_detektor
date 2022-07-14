export const sort_by_alphabet = (table, column) => {
    return table.sort((a, b) => a[column].localeCompare(b[column]));
};