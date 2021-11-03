exports.handler = async (context, event, callback) => {
  const response = new Twilio.twiml.VoiceResponse();

  response.play(
    {
      loop: 10,
    },
    'http://com.twilio.music.guitars.s3.amazonaws.com/Pitx_-_A_Thought.mp3'
  );

  return callback(null, response);
};
