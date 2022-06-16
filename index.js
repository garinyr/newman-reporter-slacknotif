
const {
  slackUtils
} = require('./slackUtils');

function SlackNotifReporter(emitter, reporterOptions, collectionRunOptions) {
  // emitter is an event emitter that triggers the following events: https://github.com/postmanlabs/newman#newmanrunevents
  // reporterOptions is an object of the reporter specific options. See usage examples below for more details.
  // collectionRunOptions is an object of all the collection run options: https://github.com/postmanlabs/newman#newmanrunoptions-object--callback-function--run-eventemitter
  console.info("SlackNotifReporter")
  if (missingReporterOptions(reporterOptions)) {
    return;
  }
  const webhookUrl = reporterOptions.webhookurl;
  const messageSize = reporterOptions.messageSize || 300;
  const collection = reporterOptions.collection || '';
  const data = reporterOptions.data || '';
  const environment = reporterOptions.environment || '';
  const projectName = reporterOptions.project || '';
  const featureName = reporterOptions.feature || '';
  const channel = reporterOptions.channel || '';
  const token = reporterOptions.token || '';
  const reportingUrl = reporterOptions.reportingurl || '';

  emitter.on('done', (error, summary) => {
    if (error) {
      console.error('error in done')
      return;
    }
    let run = summary.run;

    if (run.failures.length > 0 && reporterOptions.failuresChannel) {
      channel = reporterOptions.failuresChannel;
    }

    slackUtils.send(webhookUrl, slackUtils.slackMessage(run.stats, run.timings, run.failures, run.executions, messageSize, environment, channel, reportingUrl, projectName, featureName, limitFailures), token);
  });

  function missingReporterOptions(reporterOptions) {
    let missing = false;
    if (!reporterOptions.webhookurl) {
      console.error('Missing Slack Webhook Url');
      missing = true;
    }
    if (reporterOptions.webhookurl === 'https://slack.com/api/chat.postMessage') {
      if (!reporterOptions.token) {
        console.error('Missing Bearer Token');
        missing = true;
      }
      if (!reporterOptions.channel) {
        console.error('Missing channel');
        missing = true;
      }
    }
    return missing;
  }
}
module.exports = SlackNotifReporter