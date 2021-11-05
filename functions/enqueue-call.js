exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();
  const response = new Twilio.twiml.VoiceResponse();

  const { practicePhone, callerId, queueName, queueSid } = event;
  console.log('CALL FROM: ', callerId);
  console.log('ENQUEUING CALL FOR: ', practicePhone);

  //1. Generate enqueue TwiML
  response.enqueue(
    { waitUrl: `https://${context.DOMAIN_NAME}/hold` },
    `${queueName}`
  );

  //2. Look for active calls
  const busy = await client.calls.list({
    status: 'in-progress',
    to: practicePhone,
    limit: 1,
  });

  if (busy.length === 0) {
    try {
      const callPractice = await client.calls.create({
        machineDetection: 'Enable',
        MachineDetectionSpeechThreshold: '1000',
        method: 'POST',
        statusCallback: `https://${context.DOMAIN_NAME}/status-callback?queueName=${queueName}&queueSid=${queueSid}`,
        statusCallbackMethod: 'POST',
        statusCallbackEvent: ['completed'],
        url: `https://${context.DOMAIN_NAME}/dial-queue?queueName=${queueName}`,
        to: practicePhone,
        from: callerId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  console.log(busy);

  return callback(null, response);
};
