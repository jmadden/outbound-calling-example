exports.handler = async (context, event, callback) => {
  console.log('AMD RESULT: ', event.AnsweredBy);
  const response = new Twilio.twiml.VoiceResponse();
  const dial = response.dial();
  dial.queue({ reservationSid: `${event.queue}` });
  return callback(null, response);
};
