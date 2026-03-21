/* 
  class representing structure of response returned by server action
*/

export class ServerActionResponse {
  constructor(
    success = false,
    message = "",
    data = [],
    errors = {},
    status_code = 200,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.status_code = status_code;
  }

  // setters

  set success(suc) {
    //check if suc is boolean
    if (typeof suc === "boolean") {
      this._success = suc;
    } else {
      //   this._success = false;

      //throw error
      throw new Error("Server Action Response:success must be boolean");
    }
  }

  set message(msg) {
    //check if msg is string
    if (typeof msg === "string") {
      this._message = msg;
    } else {
      //throw error
      throw new Error("Server Action Response: message must be string");
    }
  }

  set data(data) {
    if (!Array.isArray(data)) {
      throw new Error("Data must be array!!");
    }
    this._data = data;
  }

  set errors(errors) {
    this._errors = errors;
  }

  set status_code(status_code) {
    // check if status code is number and valid http status code
    if (
      typeof status_code === "number" &&
      status_code >= 100 &&
      status_code < 600
    ) {
      this._status_code = status_code;
    } else {
      //throw error
      throw new Error("Server Action Response: invalid status code");
    }
  }

  // getters

  get success() {
    return this._success;
  }

  get message() {
    return this._message;
  }

  get data() {
    return this._data;
  }

  get errors() {
    return this._errors;
  }

  get status_code() {
    return this._status_code;
  }
}
