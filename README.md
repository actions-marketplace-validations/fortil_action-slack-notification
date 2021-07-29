# action-slack-notification
Send notification to slack

example:
```yml
name: Testing PR

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize]

jobs:
  test:
    env:
      SLACK_TOKEN: ${{ secrets.SLACK_TOKEN }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: fortil/action-slack-notification@v1
        if: always()
        with:
          status: ${{ job.status }}
          title: '{workflow} has {status_message}'
          message: '{emoji} *{workflow}* {status_message} in <{repo_url}|{repo_name}>'
          footer: 'Linked Repo <{repo_url}|{repo_name}>'
          notify_when: 'failure'
          mention_users: 'AAAA,AAA'
          mention_users_when: 'failure,warnings'
          channel: 'AAA'
```