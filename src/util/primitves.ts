/**
 * Converts a given String into a number. If conversion is not possible,
 * it instead returns the provided default number `defaultNum`.
 *
 * @param {string | undefined} envVar A String variable to convert to a number.
 * @param {number} [defaultNum=-1] A number to return as a default if `envVar`
 *  is undefined or cannot be converted to a number.
 * @returns {number} The number representation of `envVar` or the provided
 *  `defaultNum`.
 */
export function getStrAsNumberOrDefault(
  envVar: string | undefined,
  defaultNum = -1,
): number {
  // Convert to number
  const nEnvVar = Number(envVar);
  // Return if number, else undefined
  if (typeof nEnvVar === 'number' && !Number.isNaN(nEnvVar)) {
    return nEnvVar;
  } else {
    return defaultNum;
  }
}
