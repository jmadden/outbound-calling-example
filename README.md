# Outbound Calling Example Code

## Use Case

Connect an incoming call to a Twilio Phone number to another phone number or Voice Client address.

## Requirements

- A [Twilio](https://twilio.com) account
- Node.js version 12 or higher and npm
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) with the [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)

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

## Call Flow Explained

Using Twilio Studio, enqueue a call and create a Task in TaskRouter. Using TaskRouter Events, trigger an outbound call using the Programmable Voice API and Twilio Functions. The outbound call will include Answering Machine detection and a Status Callback URL. When the call connects we'll use TwiML to dial the queue and connect the calls.

## Functions Explained

> **Important!**: Keep in mind this is demo code. If you use Functions in production you should take the proper steps to secure them when needed. Please review [Understanding Visibility of Functions](https://www.twilio.com/docs/runtime/functions-assets-api/api/understanding-visibility-public-private-and-protected-functions-and-assets) for more details.

#### [tr-event-handler.js](functions/tr-event-handler.js)

This code is triggered any time an event is fired from TaskRouter. The code ignores all TaskRouter events except for two, `reservation.created` and `reservation.wrapup`. `reservation.created` is used to activate the outbound call. The outbound call code that is triggered looks like this:

```javascript
const callPractice = await client.calls.create({
  machineDetection: 'Enable',
  MachineDetectionSpeechThreshold: '1000',
  method: 'POST',
  statusCallback: `https://${context.DOMAIN_NAME}/status-callback`,
  statusCallbackMethod: 'POST',
  url: `https://${context.DOMAIN_NAME}/dial-queue?queue=${event.ReservationSid}&from=${task.callerID}`,
  to: task.practicePhone,
  from: task.callerID,
});
```

- In the above code sample note that we've enabled Answering Machine Detection. The results of AMD are sent to the `url`.
- The `url` is triggered when the call connects. Note how we are sending the `queue` and `from` as parameters to that URL. The code at that URL is responsible for dialing the queue where the call is waiting as well as examining the results of AMD and making a decision as to how to proceed with the call.

#### [dial-queue.js](functions/dial-queue.js)

This code generates TwiML instructing the call the has been enqueued to dequeue. Due to the nature of this call going through TaskRouter, the queue will always be named the value of the Task Reservation SID.

In this example code we do not do anything with the AMD information other than `console.log()` it, so you can review it's value. Ultimately you could use the value returned by `AnsweredBy` to generate different TwiML vs the the TwiML currently being use to dequeue the call.

#### [status-callback.js](functions/status-callback.js)

This code simply console.logs call information that is returned when the call completes. Here is where you could add custome code to handle/record call failures. Find more information on this topic here: https://www.twilio.com/docs/usage/webhooks/voice-webhooks#call-status-callbacks

## Instructions for running Twilio Functions

1. Confirm you have Node version 12 or higher and npm installed on your computer. If you do not, install both.
2. From the root directory of this code in terminal run `npm install`.
3. When `npm install` finishes running. Copy the `.env-example` file and rename it to `.env`.
4. Fill out the `.env` file with the relevant information.
5. Be sure you have the Twilio CLI installed as well as the Serverless Plugin for the CLI.
   - [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)
   - [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)
6. Once you have the Twilio CLI installed and configured. From terminal run `twilio serverless:deploy`. This will push the Functions in this repository up to your Twilio account. There will be a new [Functions Service in your Twilio Console named call-router](https://console.twilio.com/us1/develop/functions/services?frameUrl=%2Fconsole%2Ffunctions%2Foverview%2Fservices%3Fx-target-region%3Dus1).

## TaskRouter Explained

For this example code we'll set up TaskRouter with one TaskQueue, one Worker, and one Workflow filter.
If you've put your Twilio credentials in the `.env` file then you can run `node createDemoTr.js` from terminal. This will generate a new [TaskRouter Workspace](https://console.twilio.com/us1/develop/taskrouter/workspaces?frameUrl=/console/taskrouter/workspaces) called Call Router.
