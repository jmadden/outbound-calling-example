exports.handler = async (context, event, callback) => {
  const { AnsweredBy, queue } = event;

  console.log('AMD RESULT: ', AnsweredBy);
  console.log('QUEUE: ', `+${queue.trim()}`);

  const response = new Twilio.twiml.VoiceResponse();
  const dial = response.dial();

  dial.queue(`+${queue.trim()}`);
  return callback(null, response);
};
