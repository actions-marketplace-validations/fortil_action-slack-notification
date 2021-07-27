// const axios = require("axios");
const fetch = require("node-fetch");
const core = require('@actions/core');
const github = require('@actions/github');
const { isMissingKey } = require("./utils");

// const GITHUB_TOKEN = core.getInput('TOKEN_GITHUB');
const envs = {
  SLACK_TOKEN: core.getInput('SLACK_TOKEN'),
  channel: core.getInput('CHANNEL'),
  userId: core.getInput('USER_ID'),
  title: core.getInput('TITLE'),
  message: core.getInput('MESSAGE'),
  // octokit: github.getOctokit(GITHUB_TOKEN),
  context: github.context
};

function getActionsAndColor(status) {
  if (status === 'success') {
    return { color: 'good', action: 'passed', emoji: ':heavy_check_mark:' };
  } else if (status === 'failure') {
    return { color: 'danger', action: 'failed', emoji: ':x:' };
  } else {
    return { color: 'warning', action: 'Ppassed with warnings', emoji: ':large_orange_diamond:' };
  }
}

function prepareMessage(title, body) {
  const { color, action, emoji } = getActionsAndColor(envs.context.job.status);
  title = title.replace('{emoji}', emoji);
  title = title.replace('{workflow}', envs.context.workflow);
  title = title.replace('{status_message}', action);
  title = title.replace('{repo}', github.context);
}

async function run() {
  // if (isMissingKey(envs)) {
  //   throw new Error(`We need ${Object.keys(envs).join(', ')}`)
  // }

  const object = {
    method: "post",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      authorization: `Bearer ${SLACK_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: {
      channel: channel, // git channel
      attachments: [
        {
          color: "#008000",
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: " :eyes: " + title,
                emoji: true,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `<@${userId}> \n ${message}`,
              },
            },
            {
              type: "divider",
            },
          ],
          // footer: 'testing',
          // footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
        },
      ],
    },
  };
  console.log(Object.keys(github.context))
  console.log(JSON.stringify(github.context, null, ''));
  try {
    // const a = await fetch(object);
    // console.log(a)
  } catch (error) {
    console.log(error)
  }
}

run();