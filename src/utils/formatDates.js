export const formatDateMMYY = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${month}/${year % 100}`;
};
