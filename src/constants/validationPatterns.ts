/**
 * TaskPulse Enterprise - Validation Patterns
 * Strictly aligned with Robolab enterprise validation standards
 */
export const validations = {
  email: /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+[1-9]\d{1,14}$/, // E.164 international format
  clientCode: /^[a-zA-Z0-9][a-zA-Z0-9\s-]*$/,
  organizationName: /^[a-zA-Z0-9\s\-&.,()]+$/,
  name: /^[a-zA-Z\s\-']+$/,
  validName: /^(?=.*[A-Za-z]).+$/, // Name with at least one letter
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*!#&])[A-Za-z\d@$%*!#&]{8,}$/,
};
