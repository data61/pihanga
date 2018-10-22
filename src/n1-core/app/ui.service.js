function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class UiService {
  static getErrorMessageFrom(backendError) {
    let errorMessage;
    if (backendError) {
      const errorResponse = backendError.response;
      if (errorResponse.status < 500 && errorResponse.title && errorResponse.detail) {
        errorMessage =
          `${capitaliseFirstLetter(errorResponse.title)}: ` +
          `${capitaliseFirstLetter(errorResponse.detail)}`;
      }
    }

    return errorMessage;
  }
}
