class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    (this.message = message),
      (this.statusCode = statusCode < 400),
      (this.data = data);
  }
}

export { ApiResponse };
