// const axios = require("axios");
const fetch = require("node-fetch");
const core = require('@actions/core');
const github = require('@actions/github');
const { isMissingKey } = require("./utils");

// const GITHUB_TOKEN = core.getInput('TOKEN_GITHUB');
const envs = {
  title: core.getInput('title'),
  footer: core.getInput('footer'),
  status: core.getInput('status'),
  channel: core.getInput('channel'),
  message: core.getInput('message'),
  notifyWhen: core.getInput('notify_when'),
  mentionUsers: core.getInput('mention_users'),
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

function prepareMessage() {
  const { title, footer, message, status } = envs;
  const { color, action, emoji } = getActionsAndColor(status);
  const user = github.context.payload.pusher.name;

  let subject = title.replace('{emoji}', emoji)
    .replace('{color}', color)
    .replace('{workflow}', github.context.workflow)
    .replace('{status_message}', action)
    .replace('{repo_name}', github.context.payload.repository.name)
    .replace('{repo_url}', github.context.payload.repository.html_url)
    .replace('{actor}', github.context.actor);

  let text = message.replace('{emoji}', emoji)
    .replace('{color}', color)
    .replace('{workflow}', github.context.workflow)
    .replace('{status_message}', action)
    .replace('{repo_name}', github.context.payload.repository.name)
    .replace('{repo_url}', github.context.payload.repository.html_url)
    .replace('{user}', `<@${user}>`)
    .replace('{actor}', github.context.actor);

  let foot = footer.replace('{emoji}', emoji)
    .replace('{color}', color)
    .replace('{workflow}', github.context.workflow)
    .replace('{status_message}', action)
    .replace('{repo_name}', github.context.payload.repository.name)
    .replace('{repo_url}', github.context.payload.repository.html_url)
    .replace('{user}', `<@${user}>`)
    .replace('{actor}', github.context.actor);

  if (envs.notifyWhen && envs.notifyWhen.split(',').includes(status)) {
    if (envs.mentionUsers) {
      envs.mentionUsers.split(',').forEach((u) => {
        text += `<@${u}>`;
      })
    }
  }

  return {
    attachments: [
      {
        text,
        fallback: subject,
        pretext: subject,
        color,
        mrkdwn_in: ['text'],
        footer: foot
      }
    ]
  }
}

async function run() {
  if (isMissingKey(envs)) {
    throw new Error(`We need ${Object.keys(envs).join(', ')}`)
  }
  const payload = prepareMessage();

  const object = {
    method: 'post',
    // url: 'https://slack.com/api/chat.postMessage',
    headers: {
      authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      channel: envs.channel,// git channel
      ...payload
    }),
  };

  try {
    const a = await fetch('https://slack.com/api/chat.postMessage', object).then(res => res.json());
    console.info('A:', a)
  } catch (error) {
    console.error('Error:', error)
  }
}

run();