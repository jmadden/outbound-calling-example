exports.handler = function (context, event, callback) {
  const json = {
    store: 'boston',
    storId: '12345',
  };
  return callback(null, json);
};
