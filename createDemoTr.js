require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const createWorkspace = async () => {
  try {
    const response = await client.taskrouter.workspaces.create({
      eventCallbackUrl: `https://${process.env.DOMAIN}/tr-event-handler`,
      friendlyName: 'Call Router',
    });

    return response;
  } catch (err) {
    return err;
  }
};

const createTaskqueue = async (wsSid) => {
  try {
    const response = client.taskrouter.workspaces(wsSid).taskQueues.create({
      targetWorkers: `practice=="Pacific Health"`,
      friendlyName: 'Pacific Health',
    });
    return response;
  } catch (err) {
    return err;
  }
};

const createWorker = async (wsSid) => {
  const attributes = {
    practice: 'Pacific Health',
  };
  try {
    const response = await client.taskrouter.workspaces(wsSid).workers.create({
      friendlyName: 'Pacific Health Main',
      attributes: JSON.stringify(attributes),
    });
    return response;
  } catch (err) {
    return err;
  }
};

const createWorkflow = async (wsSid, tqSid) => {
  client.taskrouter.workspaces(wsSid).workflows.create({
    friendlyName: 'Call Router',
    configuration: JSON.stringify({
      task_routing: {
        filters: [
          {
            filter_friendly_name: 'Pacific Health',
            expression: `practice == "Pacific Health"`,
            targets: [
              {
                queue: tqSid,
              },
            ],
          },
        ],
      },
    }),
  });
};

(async () => {
  const { sid: workspace } = await createWorkspace();
  const { sid: taskqueue } = await createTaskqueue(workspace);
  await createWorkflow(workspace, taskqueue);
  await createWorker(workspace);
  console.log(workspace);
})();
