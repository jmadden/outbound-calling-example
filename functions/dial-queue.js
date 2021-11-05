exports.handler = async (context, event, callback) => {
  const { AnsweredBy, queueName } = event;

  console.log('AMD RESULT: ', AnsweredBy);
  console.log('QUEUE: ', queueName);

  const response = new Twilio.twiml.VoiceResponse();
  const dial = response.dial();

  dial.queue(queueName);
  return callback(null, response);
};
