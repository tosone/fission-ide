import * as util from 'util';

export default {
  message: (error: Error, message: any): Error => {
    error.message = util.format(error.message, JSON.stringify(message));
    return error;
  },
  ErrorFileNotExist: { "name": "NotExist", "message": "No such a file or director： %s" },
  ErrorUnknown: { "name": "Unknown", "message": "Unknown error: %s" },
  ErrorServer: { "name": "Server", "message": "Server error: %s" }
}
