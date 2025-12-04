// Ziqi Liu 251532729 ECE 9014 Group 8 Project - Client-side Validation Tools
function numberValidate(num, min, max, label = 'Number') {
    const errors = [];
    const value = Number(num);
    if (!Number.isInteger(value)) errors.push(`${label} must be an integer`);
    if (value < min || value > max) errors.push(`${label} must be between ${min} and ${max}`);
    if (max === Infinity && value < min) errors.push(`${label} must be at least ${min}`);
    return { value, errors };
}

function textValidate(text, maxLen, label = 'Text') {
    const errors = [];
    let value = String(text).trim();
    if (value.length > maxLen) {
        value = value.slice(0, maxLen);
        errors.push(`${label} exceeds maximum length of ${maxLen}, truncated.`);
    }
    return { value, errors };
}

export { numberValidate, textValidate };