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

---

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
    // eg. create some resource
    const subscription = await realmq.subscriptions.create({
      userId: 'user-1',
      channelId: 'channel-1',
      allowRead: true,
    });

    // or connect to the realtime api
    await realmq.rtm.connect();

    // and publish some message
    realmq.rtm.publish({
      channel: 'channel-1',
      message: {
        text: 'Welcome!'
      }
    });
    ```

---

## Concepts

* Our sdk utilizes promises where ever possible.
* Convenient interfaces `retrieve`, `list`, `create`, `update` and `remove` methods.
* `realmq.rtm` provides [realtime functionality](#realtime-gateway)
* Each api resource has its own namespace.
    - `realmq.tokens.*`
    - `realmq.channels.*`
    - `realmq.users.*`
    - `realmq.subscriptions.*`

---

## Realtime Gateway

Access our realtime api through `realmq.rmt.*`.
Before you can send or receive messages, you need to establish a connection.

```js
await realmq.rtm.connect();
```

:point_right: **Info**: There is also a `realmq.rtm.disconnect()` method.

### Events

`realmq.rtm` emits the following events:

* **connected**
* **disconnected**
* **message-received**
* **message-sent**

Lets register an event handler with `realmq.rtm.on`:

```js
function onConnected() {}

realmq.rtm.on('message-received', onConnected);
```

You can remove event handlers with `realmq.rtm.un`:

```js
realmq.rtm.un('message', onConnected);
```

### Subscribe to a channel

After subscribing to a channel you will receive all realtime messages published to that channel.

```js
await realmq.rtm.subscribe({
  channel: 'test-channel'
});
```

:point_right: **Note**: Subscribe will fail if you do not have a read-enabled subscription on that channel.

### Unsubscribe from a channel

After unsubscribing from a channel you will not receive any realtime messages through that channel.

```js
await realmq.rtm.unsubscribe({
  channel: 'test-channel'
});
```

### Publish a message

We do not restrict you on what data of which format you publish.

You can send plain string messages:

```js
await realmq.rtm.publish({ channel: 'test-channel', message: 'Welcome!' });
```

Or if you prefer Buffers:

```js
const message = new Buffer('Welcome!');
await realmq.rtm.publish({ channel: 'test-channel', message });
```

Or anything else:

```js
const message = { ':heart:': 'Welcome!' };
await realmq.rtm.publish({ channel: 'test-channel', message });
```

:point_right: **Note**: Non String or Buffer messages will be automatically JSON encoded.<br>
:point_right: **Note**: Publish will fail if you do not have a write-enabled subscription on that channel.
