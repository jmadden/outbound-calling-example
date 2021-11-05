// The purpose of this function is to mock making an API
// request to your backend and returning data about a location.
// This function only returns static data.
exports.handler = function (context, event, callback) {
  const json = {
    location: 'Pacific Health',
    locationId: '12345',
    locationPhone: '+14158786346',
    queueName: 'Pacific_Health',
    queueSid: 'QUaaebc05b9cbe87ace0864443eb364f6d',
  };
  return callback(null, json);
};
