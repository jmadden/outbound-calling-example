exports.handler = function (context, event, callback) {
  // With timezone:
  // In Functions/Configure, add NPM name: moment-timezone, version: 0.5.14
  // Timezone function reference: https://momentjs.com/timezone/
  const moment = require('moment-timezone');

  // timezone needed for Daylight Saving Time adjustment
  const timezone = event.timezone || 'America/Los_Angeles';
  const dayOfWeek = moment().tz(timezone).format('d');

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const start_time = Number(event[`${days[dayOfWeek]}_start_time`]);
  const end_time = Number(event[`${days[dayOfWeek]}_end_time`]);

  const hour = moment().tz(timezone).format('HH.mm');

  const response = hour >= start_time && hour < end_time ? 'open' : 'after';

  console.log('RESPONSE: ', response);
  const theResponse = `${response} : ${hour} ${dayOfWeek}`;
  console.log(`Time request: ${theResponse} day of week : ${dayOfWeek}`);
  callback(null, theResponse);
};
