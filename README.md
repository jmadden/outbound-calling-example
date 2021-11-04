# Outbound Calling Example

## Use Case

Connect an incoming call to a Twilio Phone number to another phone number or Voice Client address.

## Twilio Technologies Used

- [Phone Numbers](https://www.twilio.com/docs/phone-numbers)
- [Studio](https://www.twilio.com/docs/studio)
- [Programmable Voice](https://www.twilio.com/docs/voice)
  - [API](https://www.twilio.com/docs/voice/api)
  - [TwiML](https://www.twilio.com/docs/voice/twiml)
  - [AMD (Answering Machine Detection)](https://www.twilio.com/docs/voice/answering-machine-detection)
- [TaskRouter](https://www.twilio.com/docs/taskrouter)
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)
  - [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)

## Functions Explained

> **Important!**: Keep in mind this is demo code. If you use Functions in production you should take the proper steps to secure them when needed. Please review [Understanding Visibility of Functions](https://www.twilio.com/docs/runtime/functions-assets-api/api/understanding-visibility-public-private-and-protected-functions-and-assets) for more details.

`tr-event-handler.js` - This code is triggered any time an event is fired from TaskRouter. The code ignores all TaskRouter events except for two `reservation.created` and `reservation.wrapup`. `reservation.created` is used to activate the outbound call. The code that is triggered looks like this

```javascript
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
```

## Instructions for running Twilio Functions

1. Confirm you have Node version 12 or higher and npm installed on your computer. If you do not, install both.
2. From the root directory of this code in terminal run `npm install`.
3. When `npm install` finishes running. Copy the `.env-example` file and rename it to `.env`.
4. Fill out the `.env` file with the relevant information.
5. Be sure you have the Twilio CLI installed as well as the Serverless Plugin for the CLI.
   - [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)
   - [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)
6. Once you have the Twilio CLI installed and configured. From terminal run `twilio serverless:deploy`. This will push the Functions in this repository up to your Twilio account. There will be a new [Functions Service in your Twilio Console named call-router](https://console.twilio.com/us1/develop/functions/services?frameUrl=%2Fconsole%2Ffunctions%2Foverview%2Fservices%3Fx-target-region%3Dus1).

## Call Flow Explained

Using Twilio Studio, enqueue a call and create a Task in TaskRouter. Using TaskRouter Events, trigger an outbound call using the Programmable Voice API and Twilio Functions. The outbound call will include Answering Machine detection and a Status Callback URL. When the call connects we'll use TwiML to dial the queue and connect the calls.

## TaskRouter
