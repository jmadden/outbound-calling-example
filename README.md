# Using Only Studio and Functions Make Outbound Calls

## Use Case

Connect an incoming call to a Twilio Phone number to a Studio IVR. Enqueue the call and place an outbound call that connects the queued call upon answer.
Example Use: Using a Twilio phone number to call

## Requirements

- A [Twilio](https://twilio.com) account
- Node.js version 14 or higher and npm
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

1. Phone call comes into a Twilio phone number.
2. Call connects to a Studio IVR and traverses the IVR.
3. Studio enqueues the call and creates a Task that is sent to TaskRouter.
4. TaskRouter routes the Task to a Worker and a Task Reservation is created.
5. The Reservation created event trigger's a webhook to a Twilio Function.
6. The Twilio Function uses the Reservation and Task information to create an outbound call using the voice API. The outbound call is set up with Answering Machine Detection and a Status Callback URL.
7. When the call connects, TwiML is activated that calls into the call queue using the Reservation SID as the name of the call queue. This dequeues the call and the enquued caller and the outbound called are connected.
8. When the call completes the Task Reservation goes into Wrapping and that activates code that Completes the associated Task.

## Functions Explained

> **Important!**: Keep in mind this is demo code. If you use Functions in production you should take the proper steps to secure them when needed. Please review [Understanding Visibility of Functions](https://www.twilio.com/docs/runtime/functions-assets-api/api/understanding-visibility-public-private-and-protected-functions-and-assets) for more details.

#### [dial-queue.js](functions/dial-queue.js)

This code generates TwiML instructing the call the has been enqueued to dequeue. Due to the nature of this call going through TaskRouter, the queue will always be named the value of the Task Reservation SID.

In this example code we do not do anything with the AMD information other than `console.log()` it, so you can review it's value. Ultimately you could use the value returned by `AnsweredBy` to generate different TwiML vs the the TwiML currently being use to dequeue the call.

#### [status-callback.js](functions/status-callback.js)

This code simply console.logs call information that is returned when the call completes. Here is where you could add custome code to handle/record call failures. Find more information on this topic here: https://www.twilio.com/docs/usage/webhooks/voice-webhooks#call-status-callbacks

#### [location-lookup.js](functions/location-lookup.js)

This file is used to mock a request to a back end that returns data about the location you want to call. This Function should be used in the Run Function widget in Studio to retrieve data that is used when creating the text in the Enqueue Call widget.

## Instructions for running Twilio Functions

1. Confirm you have Node version 12 or higher and npm installed on your computer. If you do not, install both.
2. From the root directory of this code in terminal run `npm install`.
3. When `npm install` finishes running. Copy the `.env-example` file and rename it to `.env`.
4. Fill out the `.env` file with the relevant information.
5. Be sure you have the Twilio CLI installed as well as the Serverless Plugin for the CLI.
   - [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)
   - [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)
6. Once you have the Twilio CLI installed and configured. From terminal run `twilio serverless:deploy`. This will push the Functions in this repository up to your Twilio account. There will be a new [Functions Service in your Twilio Console named call-router](https://console.twilio.com/us1/develop/functions/services?frameUrl=%2Fconsole%2Ffunctions%2Foverview%2Fservices%3Fx-target-region%3Dus1).
