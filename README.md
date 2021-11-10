# Using Only Studio and Functions Make Outbound Calls

## Use Case

Connect an incoming call to a Twilio Phone number to a Studio IVR. Enqueue the call and place an outbound call that connects the queued call upon answer.

Example Use: A call to a Twilio phone number puts the caller into a store's IVR. When the call finishes traversing the IVR the call is enqueued and the store phone is dialed. When the store answers the call they are connected to the enqueued call.

**Additinal Notes**

- This code checks for calls already in progress and will not dial to the destination number until it becomes available.
- When a call ends the code checks the queue to see if there are calls waiting, if there are it will connect the call at the top of the queue.

## Requirements

- A [Twilio](https://twilio.com) account
- Node.js version 14 (highest supported version on Twilio Funcitons)
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) with the [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)

## Twilio Technologies Used

- [Phone Numbers](https://www.twilio.com/docs/phone-numbers)
- [Studio](https://www.twilio.com/docs/studio)
- [Programmable Voice](https://www.twilio.com/docs/voice)
  - [API](https://www.twilio.com/docs/voice/api)
  - [TwiML](https://www.twilio.com/docs/voice/twiml)
  - [AMD (Answering Machine Detection)](https://www.twilio.com/docs/voice/answering-machine-detection)
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)
  - [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)

## Functions Explained

> **Important!**: Keep in mind this is demo code. If you use Functions in production you should take the proper steps to secure them when needed. Please review [Understanding Visibility of Functions](https://www.twilio.com/docs/runtime/functions-assets-api/api/understanding-visibility-public-private-and-protected-functions-and-assets) for more details.

## Instructions for running Twilio Functions

1. Confirm you have Node version 12 or higher and npm installed on your computer. If you do not, install both.
2. From the root directory of this code in terminal run `npm install`.
3. When `npm install` finishes running. Copy the `.env-example` file and rename it to `.env`.
4. Fill out the `.env` file with the relevant information.
5. Be sure you have the Twilio CLI installed as well as the Serverless Plugin for the CLI.
   - [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)
   - [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)
6. Once you have the Twilio CLI installed and configured. From terminal run `twilio serverless:deploy`. This will push the Functions in this repository up to your Twilio account. There will be a new [Functions Service in your Twilio Console named call-router](https://console.twilio.com/us1/develop/functions/services?frameUrl=%2Fconsole%2Ffunctions%2Foverview%2Fservices%3Fx-target-region%3Dus1).
