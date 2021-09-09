export function catchErrors(description) {
  switch (description) {
    case "This user already exists.":
      return "EXISTING_USER";
    case "Username must be alphanumeric with optional underscores.":
      return "INVALID_USERNAME";
    case "Username must be less than 16 and more than 3 characters.":
      return "USERNAME_LENGTH";
    case "Error creating the user.":
      return "NETWORK_ERROR";
    case "Invalid email address.":
      return "INVALID_EMAIL";
    case "This email is already being used.":
      return "EXISTING_EMAIL";
    case "Bad credentials.":
      return "WRONG_CREDENTIALS";
    case "You are banned.":
      return "BANNED";
    case "Invalid security code.":
      return "WRONG_SECURITY_CODE";
    case "A login link has been sent to your email.":
      return "TWO_FACTOR_EMAIL";
    case "Invalid login code.":
      return "TWO_FACTOR_EMAIL_ERROR";
    default:
      return "UNKNOWN_ERROR";
  }
}
