exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();

  if (event.EventType == 'reservation.created') {
    const task = JSON.parse(event.TaskAttributes);

    try {
      const callPractice = await client.calls.create({
        machineDetection: 'Enable',
        MachineDetectionSpeechThreshold: '1000',
        method: 'POST',
        statusCallback: `https://${context.DOMAIN_NAME}/status-callback`,
        statusCallbackMethod: 'POST',
        statusCallbackEvent: ['answered', 'completed'],
        url: `https://${context.DOMAIN_NAME}/dial-queue?queue=${event.ReservationSid}&from=${task.callerID}`,
        to: task.practicePhone,
        from: task.callerID,
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (event.EventType == 'reservation.wrapup') {
    try {
      const completeTask = await client.taskrouter
        .workspaces(event.WorkspaceSid)
        .tasks(event.TaskSid)
        .update({
          assignmentStatus: 'completed',
        });
    } catch (error) {
      console.error(error);
    }
  }
  response.setStatusCode(200);
  return callback(null, response);
};
