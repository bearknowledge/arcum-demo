function intlFormat(num, formatOptions) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 1,
        ...formatOptions,
    }).format(Math.round(num * 100) / 100);
}

export function abbreviate(num, formatOptions = {}) {
    if (num >= 1e6) return intlFormat(num / 1000000, formatOptions) + "M";
    if (num >= 1e3) return intlFormat(num / 1000, formatOptions) + "K";
    return intlFormat(num, formatOptions);
}
