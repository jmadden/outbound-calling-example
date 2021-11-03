exports.handler = async (context, event, callback) => {
  const response = new Twilio.twiml.VoiceResponse();
  response.enqueue(
    {
      waitUrl: 'wait-music.xml',
    },
    'support'
  );
  return callback(null, response);
};
