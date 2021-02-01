import * as util from 'util';

export default {
  message: (error: Error, message: any): Error => {
    util.format(error.message, message);
    return error;
  },
  ErrorFileNotExist: { "name": "NotExist", "message": "No such a file or director： %o" },
  ErrorUnknown: { "name": "Unknown", "message": "Unknown error: %o" },
  ErrorServer: { "name": "Server", "message": "Server error: %o" }
}
