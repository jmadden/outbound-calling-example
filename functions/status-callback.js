exports.handler = async (context, event, callback) => {
  const response = new Twilio.Response();
  const client = context.getTwilioClient();

  const { To, queueSid, queueName } = event;

  // Check for calls in the queue.
  try {
    const queuedCalls = await client.queues(queueSid).fetch();
    // Dequeue call at the front of the queue
    if (queuedCalls.currentSize > 0) {
      const frontQueue = await client.queues(queueSid).members('Front').fetch();

      const callDetails = await client.calls(frontQueue.callSid).fetch();

      console.log('DEQUEING CALLER: ', callDetails.from);

      const callPractice = await client.calls.create({
        machineDetection: 'Enable',
        MachineDetectionSpeechThreshold: '1000',
        method: 'POST',
        statusCallback: `https://${context.DOMAIN_NAME}/status-callback?queueName=${queueName}&queueSid=${queueSid}`,
        statusCallbackMethod: 'POST',
        statusCallbackEvent: ['completed'],
        url: `https://${context.DOMAIN_NAME}/dial-queue?queueName=${queueName}`,
        to: To,
        from: callDetails.from,
      });
    } else {
      console.log('CALL QUEUE IS EMPTY');
    }
  } catch (error) {
    console.log(error);
  }

  response.setStatusCode(200);
  return callback(null, response);
};
