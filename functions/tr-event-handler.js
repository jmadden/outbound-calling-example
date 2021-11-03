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
        statusCallback: 'https://<TWILIO FUNCTION DOMAIN>/status-callback',
        statusCallbackMethod: 'POST',
        statusCallbackEvent: ['answered', 'completed'],
        url: `https://<TWILIO FUNCTION DOMAIN>/dial-queue?queue=${event.ReservationSid}&from=${task.callerID}`,
        to: task.practicePhone,
        from: task.callerID,
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (event.EventType == 'reservation.wrapup') {
    const completeTask = await client.taskrouter
      .workspaces(event.WorkspaceSid)
      .tasks(event.TaskSid)
      .update({
        assignmentStatus: 'completed',
      });

    console.log('🐶🐶🐶🐶', completeTask);
  }
  response.setStatusCode(200);
  return callback(null, response);
};
