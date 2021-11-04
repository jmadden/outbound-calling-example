exports.handler = async (context, event, callback) => {
  const response = new Twilio.Response();

  console.log('CALL STATUS: ', event);

  response.setStatusCode(200);
  return callback(null, response);
};
