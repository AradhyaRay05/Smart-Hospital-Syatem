export function success(data, message = "Success") {
  return { success: true, message, data };
}

export function failure(message = "Something went wrong", errors = null) {
  return { success: false, message, errors };
}
