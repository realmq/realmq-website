---
title: "Web SDK"
subtitle: <i class="fab fa-github"></i> <a href="https://github.com/realmq/realmq-web-sdk">realmq/realmq-web-sdk</a>
menu:
  docs_home:
    name: Web SDK
    pre: nodejs
  docs:
    parent: "SDKs"
    name: "Web SDK"
---

## Getting Started

1. Install the SDK:
    - The easy way:
        ```html
        <script src="https://unpkg.com/@realmq/web-sdk/dist/realmq.min.js"></script>
        ```

    - The flexible way:
        ```bash
        $ yarn add @realmq/web-sdk
        # or
        $ npm install @realmq/web-sdk
        ```

2. Initialize the SDK:

    ```js
    const realmq = new RealMQ('<AUTH_TOKEN>');
    ```

3. Start implementing:

    ```js
    // eg. load some data
    const channels = await realmq.channels.list();

    // or connect to the real-time API
    await realmq.rtm.connect();
    realmq.autoSubscribe();

    // listen for messages in some-channel
    realmq.rtm.on('some-channel/message', function channelMessageHandler(message) {
      console.warn('received new message in channel ', ${message.channel}, ':', message.data);
    });
    ```


---

## Concepts

* Our SDK utilizes promises where possible.
* We provide convenient interfaces to work with resources `retrieve`, `list`, `create`, `update` and `remove` methods.
* `realmq.rtm.*` provides [real-time functionality](#real-time-gateway)
* Each API resource has its own namespace.
    - `realmq.channels.*` - ([Channel API](#channels))
    - `realmq.subscriptions.*` - ([Subscription API](#subscriptions))
    - `realmq.tokens.*` - ([Token API](#tokens))
    - `realmq.users.*` - ([User API](#users))
* There are two access groups (scopes). Every method has a description of what scopes are allowed to perform that action.
    - <span class="badge badge-pill badge-primary">Admin</span> Full **management capabilities**, use for implementing your real-time **business logic**
    - <span class="badge badge-pill badge-primary">User</span> **Restricted access**, use for logic **on behalf of a single user/device/bot**…

---

## Initialization

Add the SDK to your html app:

```html
<script src="https://unpkg.com/@realmq/web-sdk"></script>
```

Now you can initialize your real-time client.

```js
const authToken = '<AUTH_TOKEN>';
const options = {
  host: 'realmq.your-domain.com'
};
const realmq = new RealMQ(authToken, options);
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "authToken" "String" >}} | A secret RealMQ auth token. |
| {{< p "options" "Object" true >}} | |
| {{< p "options.host" "String" true >}} | Set this if you run against a dedicated or on-premise deployment.<br>**Default**: realmq.com |
| {{< p "options.autoConnect" "Boolean" true >}} | Automatically connect the client to the RealMQ broker upon initialization by implicitly calling `realmq.rtm.connect()`.<br>**Default**: false |
| {{< p "options.enableSubscriptionSyncEvents" "Boolean" true >}} | Emit subscription synchronization events `subscription-created`, `subscription-updated` & `subscription-deleted` events<br>**Default**: true |
| {{< p "options.autoSubscribe" "Boolean" true >}} | Automatically subscribes the client to all channels that the connecting user has access to by calling `realmq.autoSubscribe()` after connecting to the RealMQ broker. If `enableSubscriptionSyncEvents` is enabled the client automatically updates the subscriptions during runtime.<br>👉 **Note**: This implies `autoConnect = true`.<br>**Default**: false |
{{% /pt %}}

---

## Channels

### Create a channel

<span class="badge badge-pill badge-primary">Admin</span>

```js
// create a simple channel
const channel1 = await realmq.channels.create();

// create a channel with a custom id
const channel2 = await realmq.channels.create({ id: 'awesome-channel' });

// create a channel with a message storage limit of 7 days
const channel3 = await realmq.channels.create({
  id: 'messages-within-the-last-week',
  features: {
    persistence: {
      enabled: true,
      duration: '7d',
    },
  },
});
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "id" "String" true >}} | see [Custom Ids](/docs/knowledge-base/#custom-ids) |
| {{< p "properties" "Object" true >}} | see [Custom Properties](/docs/knowledge-base/#custom-properties) |
| {{< p "features" "Object" true >}} | Additional channel features |
| {{< p "features.persistence" "Object" true >}} | Message persistence settings for this channel |
| {{< p "features.persistence.enabled" "Boolean" >}} | If set to true, the messages published in this channel are persisted for later access. |
| {{< p "features.persistence.duration" "String" true >}} | Time interval to persist messages published on the channel. If not set messages will be persisted forever. Supported units are `s`, `m`, `h`, and `d` |
{{% /pt %}}

### Retrieve a channel

<span class="badge badge-pill badge-primary">Admin</span>
<span class="badge badge-pill badge-primary">User</span>

```js
const channel = await realmq.channels.retrieve('channel-id');
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "channelId" "String" >}} | |
{{% /pt %}}

### List all accessible channels

<span class="badge badge-pill badge-primary">Admin</span>
<span class="badge badge-pill badge-primary">User</span>

Fetch a [PaginatedList](/docs/knowledge-base/#paginated-lists) of [Channels](/docs/knowledge-base/#channel-resource).

```js
const channelList1 = await realmq.channels.list();
const channelList2 = await realmq.channels.list({ limit: 5, offset: 5 });
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "offset" "Int" true >}} | see [Pagination Params](/docs/knowledge-base/#paginated-lists) |
| {{< p "limit" "Int" true >}} | see [Pagination Params](/docs/knowledge-base/#paginated-lists) |
{{% /pt %}}

### Update a channel

<span class="badge badge-pill badge-primary">Admin</span>

```js
const channel = await realmq.channels.update('channel-id', [
  {
    op: 'replace',
    path: '/properties/memberCount',
    value: 47
  }
]);
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "channelId" "String" >}} | |
| {{< p "patch" "Array" >}} | Update channel properties via JSON-patch ([RFC6902](http://tools.ietf.org/html/rfc6902)). |
{{% /pt %}}

### Remove a channel

<span class="badge badge-pill badge-primary">Admin</span>

```js
const channel = await realmq.channels.remove('channel-id');
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "channelId" "String" >}} | |
{{% /pt %}}

### Retrieving channel messages

<span class="badge badge-pill badge-primary">Admin</span>
<span class="badge badge-pill badge-primary">User</span>

Fetch a [PaginatedList](/docs/knowledge-base/#paginated-lists) of persisted messages within a [Channel](/docs/knowledge-base/#channel-resource).

👉 **Note**: You have to enable channel persistence to retrieve messages from this resource.

```js
const messages = await realmq.messages.list({
  channel: 'channel-id',
  offset: 10,
  limit: 10,
  from: '{{< isodate >}}',
  to: '{{< isodate >}}',
});
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "channel" "String" >}} |  |
| {{< p "offset" "Number" true >}} | see [Pagination Params](/docs/knowledge-base/#paginated-lists) |
| {{< p "limit" "Number" true >}} | see [Pagination Params](/docs/knowledge-base/#paginated-lists) |
| {{< p "from" "Date" true >}} | Only show messages with a timestamp equal or later than this date |
| {{< p "to" "Date" true >}} | Only show messages with a timestamp smaller than or equal this date |
{{% /pt %}}

---

## Subscriptions

### Create a subscription

<span class="badge badge-pill badge-primary">Admin</span>

```js
const subscription = await realmq.subscriptions.create({
  channelId: 'test-channel',
  userId: 'test-user',
  allowRead: true
});
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "id" "String" true >}} | An optional [Custom Id](/docs/knowledge-base/#custom-ids) |
| {{< p "channelId" "String" true >}} | An optional [Channel](/docs/knowledge-base/#channel-resource) reference.<br> 👉 **Note**: If no channel is specified or the specified channel doesn't exist it will be auto-created. |
| {{< p "userId" "String" true >}} | An optional [User](/docs/knowledge-base/#user-resource) reference.<br> 👉 **Note**: If no user is specified or the specified user doesn't exist it will be auto-created. |
| {{< p "allowRead" "Boolean" true >}} | Whether the user will be able to receive channel messages. |
| {{< p "allowWrite" "Boolean" true >}} | Whether the user will be able to publish messages to the channel. |
{{% /pt %}}

### Retrieve a subscription

<span class="badge badge-pill badge-primary">Admin</span>
<span class="badge badge-pill badge-primary">User</span>

```js
const subscription = await realmq.subscriptions.retrieve('subscription-id');
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "subscriptionId" "String" >}} | |
{{% /pt %}}

### List all subscriptions

<span class="badge badge-pill badge-primary">User</span>

Fetch a [PaginatedList](/docs/knowledge-base/#paginated-lists) of [Subscriptions](/docs/knowledge-base/#subscription-resource).

```js
const subscriptionList1 = await realmq.subscriptions.list();
const subscriptionList2 = await realmq.subscriptions.list({ limit: 5, offset: 5 });
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "offset" "Int" true >}} | see [Pagination Params](/docs/knowledge-base/#paginated-lists) |
| {{< p "limit" "Int" true >}} | see [Pagination Params](/docs/knowledge-base/#paginated-lists) |
{{% /pt %}}

### Update a subscription

<span class="badge badge-pill badge-primary">Admin</span>

```js
const user = await realmq.subscriptions.update('subscription-id', [
  {
    op: 'replace',
    path: '/allowRead',
    value: true
  }
]);
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "subscriptionId" "String" >}} | |
| {{< p "patch" "Array" >}} | Update user properties via JSON-patch ([RFC6902](http://tools.ietf.org/html/rfc6902)). |
{{% /pt %}}

### Remove a subscription

<span class="badge badge-pill badge-primary">Admin</span>

```js
const subscription = await realmq.subscriptions.remove('subscription-id');
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "subscriptionId" "String" >}} | |
{{% /pt %}}

---

## Tokens

### Create a token

<span class="badge badge-pill badge-primary">Admin</span>

Create a new auth token and passively create a new user if not existing yet.
If you want to create an auth token for an existing user you have to pass its id as userId.

```js
const user1 = await realmq.tokens.create();
const user2 = await realmq.users.create({ id: 'my-token-id', userId: 'test-user', scope: 'user' });
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "id" "String" true >}} | An optional [Custom Ids](/docs/knowledge-base/#custom-ids) |
| {{< p "userId" "String" true >}} |  An optional [User](/docs/knowledge-base/#user-resource) reference.<br> 👉 **Note**: If no user is specified or the specified user doesn't exist it will be auto-created. |
| {{< p "scope" "String" true >}} | Scope of the token. Possible values are `admin` and `user`.<br>**Default**: user |
| {{< p "description" "String" true >}} | An optional auth token description. |
{{% /pt %}}

### Retrieve a token

<span class="badge badge-pill badge-primary">Admin</span>
<span class="badge badge-pill badge-primary">User</span>

Find an auth token by its id.

```js
const user = await realmq.tokens.retrieve('token-id');
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "tokenId" "String" >}} | |
{{% /pt %}}

### List all tokens

<span class="badge badge-pill badge-primary">Admin</span>
<span class="badge badge-pill badge-primary">User</span>

Fetch a [PaginatedList](/docs/knowledge-base/#paginated-lists) of [Tokens](/docs/knowledge-base/#auth-token-resource) of the current user,
or system-wide if the request is performed as admin.

```js
const userList1 = await realmq.tokens.list();
const userList2 = await realmq.tokens.list({ limit: 5, offset: 5 });
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "offset" "Int" true >}} | see [Pagination Params](/docs/knowledge-base/#paginated-lists) |
| {{< p "limit" "Int" true >}} | see [Pagination Params](/docs/knowledge-base/#paginated-lists) |
{{% /pt %}}

### Update a token

<span class="badge badge-pill badge-primary">Admin</span>
<span class="badge badge-pill badge-primary">User</span>

Update auth token via JSON-patch ([RFC6902](http://tools.ietf.org/html/rfc6902)).

Patchable Fields
: description

```js
const user = await realmq.tokens.update('token-id', [
  {
    op: 'replace',
    path: '/description',
    value: 'Session on Chrome Linux'
  }
]);
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "tokenId" "String" >}} | |
| {{< p "patch" "Array" >}} | Update token description via JSON-patch ([RFC6902](http://tools.ietf.org/html/rfc6902)). |
{{% /pt %}}

### Remove a token

<span class="badge badge-pill badge-primary">Admin</span>
<span class="badge badge-pill badge-primary">User</span>

Delete the auth token and invalidate the session.

```js
const user = await realmq.tokens.remove('token-id');
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "tokenId" "String" >}} | |
{{% /pt %}}

---

## Users

### Create a user

<span class="badge badge-pill badge-primary">Admin</span>

```js
const user1 = await realmq.users.create();
const user2 = await realmq.users.create({ id: 'awesome-user' });
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "id" "String" true >}} | An optional [Custom Ids](/docs/knowledge-base/#custom-ids) |
| {{< p "properties" "Object" true >}} | A map of [Custom Properties](/docs/knowledge-base/#custom-properties) |
{{% /pt %}}

### Retrieve a user

<span class="badge badge-pill badge-primary">Admin</span>

```js
const user = await realmq.users.retrieve('user-id');
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "userId" "String" >}} | |
{{% /pt %}}

### List all users

<span class="badge badge-pill badge-primary">User</span>

Fetch a [PaginatedList](/docs/knowledge-base/#paginated-lists) of [Users](/docs/knowledge-base/#user-resource).

```js
const userList1 = await realmq.users.list();
const userList2 = await realmq.users.list({ limit: 5, offset: 5 });
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "offset" "Int" true >}} | see [Pagination Params](/docs/knowledge-base/#paginated-lists) |
| {{< p "limit" "Int" true >}} | see [Pagination Params](/docs/knowledge-base/#paginated-lists) |
{{% /pt %}}

### Update a user

<span class="badge badge-pill badge-primary">Admin</span>

```js
const user = await realmq.user.update('user-id', [
  {
    op: 'replace',
    path: '/properties/avatar',
    value: 'https://api.adorable.io/avatars/64/avatar.png'
  }
]);
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "userId" "String" >}} | |
| {{< p "patch" "Array" >}} | Update user properties via JSON-patch ([RFC6902](http://tools.ietf.org/html/rfc6902)). |
{{% /pt %}}

### Remove a user

<span class="badge badge-pill badge-primary">Admin</span>

```js
var user = await realmq.users.remove('user-id');
```

{{% pt %}}
| Parameters |  |
|-----------:|-------------|
| {{< p "userId" "String" >}} | |
{{% /pt %}}

---

## Real-time Gateway

Access our real-time API through `realmq.rmt.*`.
Before you can send or receive messages, you need to establish a connection.

```js
await realmq.rtm.connect();
```

:point_right: **Info**: There is also a `realmq.rtm.disconnect()` method.

### Events

`realmq.rtm` emits the following events:

* **connected**
* **reconnected**
* **disconnected**
* **message**
* **{channel}/message**
* **message-sent**

Let's register an event handler with `realmq.rtm.on`:

```js
function onConnect() {}

realmq.rtm.on('connected', onConnect);
```

You can remove event handlers with `realmq.rtm.off`:

```js
realmq.rtm.off('connected', onConnect);
```

### Subscribe to a channel

After subscribing to a channel you will receive all messages published to that channel.

```js
await realmq.rtm.subscribe({
  channel: 'test-channel'
});
```

:point_right: **Note**: Subscribe will fail if you do not have a read-enabled subscription on that channel.

### Unsubscribe from a channel

After unsubscribing from a channel you will not receive any messages through that channel.

```js
await realmq.rtm.unsubscribe({
  channel: 'test-channel'
});
```

### Receive messages

Whenever a message hits the client, the SDK will emit message events.

* `message` will be emitted for every message.
* `{channel}/message` will be emitted for every message in a particular channel

```js
realmq.rtm.on('message', function messageHandler(message) {});
realmq.rtm.on('some-channel/message', function channelMessageHandler(message) {});
```

The message object provides the following properties:

{{% pt %}}
| Message Properties |  |
|-----------:|-------------|
| {{< p "channel" "String" >}} | The channel in which the messag was published. |
| {{< p "raw" "Uint8Array" >}} | The raw message buffer. |
| {{< p "data" "Mixed" >}} | Contains the json decoded buffer data. |
| {{< p "error" "Error" >}} | Only set if data was accessed and json decoding failed. |
{{% /pt %}}

:point_right: **Note**: If your messages contain binary, you should access `raw` instead of data. Otherwise a JSON Parse exception might be raised.

### Publish a message

We do not restrict you on what data of which format you publish.

You can send plain string messages:

```js
await realmq.rtm.publish({ channel: 'test-channel', message: 'Welcome!' });
```

Or if you prefer binary:

```js
const message = new Uint8Array([0x57, 0x65, 0x6c, 0x63, 0x6f, 0x6d, 0x65, 0x21]);
await realmq.rtm.publish({ channel: 'test-channel', message });
```

Or anything else:

```js
const message = { ':heart:': 'Welcome!' };
await realmq.rtm.publish({ channel: 'test-channel', message });
```

:point_right: **Note**: Non binary messages will be automatically JSON encoded.<br>
:point_right: **Note**: Publish will fail if you do not have a write-enabled subscription on that channel.
