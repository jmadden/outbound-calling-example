// The purpose of this function is to mock making an API
// request to your backend and returning data about a location.
// This function only returns static data.
exports.handler = function (context, event, callback) {
  const json = {
    location: 'boston',
    locationId: '12345',
    locationPhone: '',
  };
  return callback(null, json);
};
