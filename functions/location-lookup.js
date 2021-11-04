// The purpose of this function is to mock making an API
// request to your backend and returning data about a location.
// This function only returns static data.
exports.handler = function (context, event, callback) {
  const json = {
    location: 'Pacific Health',
    locationId: '12345',
    locationPhone: '', //Put your destination phone number here.
  };
  return callback(null, json);
};
