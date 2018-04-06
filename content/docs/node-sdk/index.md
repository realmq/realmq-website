---
title: Node SDK
menu:
  docs_home:
    name: Node SDK
    pre: nodejs
  docs:
    parent: "SDKs"
    name: "Node SDK"
---

Platform
: Node.js

Repository
: https://github.com/realmq/realmq-node-sdk

Use Cases
: Administration, Backend business logic

## Getting Started

1. First, install the node package:

    ```bash
    $ yarn add @realmq/node-sdk
    # or
    $ npm install @realmq/node-sdk
    ```

2. Initialize the sdk:

    ```js
    const realmq = require('@realmq/node-sdk')('your-auth-token');
    ```

3. Start implementing:
    ```js
    // create resources
    const subscription = await realmq.subscriptions.create({
      userId: 'user-1',
      channelId: 'channel-1',
      allowRead: true,
    });

    // connect to the realtime api
    await realmq.rtm.connect();

    // publish some message
    realmq.rtm.publish({
      channel: 'channel-1',
      message: {
        text: 'Welcome!'
      }
    });
    ```
