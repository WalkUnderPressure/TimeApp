const isValidDate = (date) => {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
};

function FormatToTime(date) {
    return new Date(date).toLocaleTimeString({}, { hour12: false });
}

function FormatToDate(date) {
    const dateT = new Date(date).toLocaleDateString();
    const timeT = FormatToTime(date);

    return `${dateT} ${timeT}`;
}

export {
    isValidDate,
    FormatToTime,
    FormatToDate,
};
