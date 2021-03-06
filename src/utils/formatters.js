/**
 * Format number for display.
 *
 * @param {number} value Number to format.
 * @param {number} [precision=8] Decimals precision.
 *
 * @returns {string} Formatter number for display.
 */
export const formatNumber = (value, precision = 8) => {
  if (isNaN(value)) {
    return "-";
  }

  return value.toFixed(precision);
};

/**
 * Add thousands separator in string numeric value.
 *
 * @param {string} value String numeric value.
 * @param {string} [separator=" "] Thousands separator character.
 * @param {number} [precision=2] Fractional digits precision.
 * @returns {string} String numeric value with added thousands separator chars.
 */
export const addThousandsSeparator = (value, separator = " ", precision = 2) => {
  const valueNumber = parseFloat(value);

  if (typeof valueNumber === "number") {
    let finalValue = String(
      valueNumber.toLocaleString("en-US", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }),
    );
    return finalValue.replace(/,/g, separator);
  }

  return "";
};

/**
 * Format price for display.
 *
 * Numbers greater than 1 show 2 digits precision, floats show 8 digits precision.
 *
 * @param {number|string} price Price to format.
 * @param {string} [nanDisplay] Value to display when price is NaN.
 * @param {string} [thousandSeparator] Character to use for thousand separator.
 *
 * @returns {string} Formatter price for display.
 */
export const formatPrice = (price, nanDisplay = "-", thousandSeparator = " ") => {
  const priceFloat = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(priceFloat)) {
    return nanDisplay;
  }

  let precision = 8;
  let formattedPrice = priceFloat.toFixed(precision);
  if (priceFloat > 1 || priceFloat < -1) {
    precision = 2;
  }

  return addThousandsSeparator(formattedPrice, thousandSeparator, precision);
};
