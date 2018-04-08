---
title: "Web SDK"
subtitle: <i class="fa fa-github"></i> <a href="https://github.com/realmq/realmq-web-sdk">realmq/realmq-web-sdk</span>
menu:
  docs_home:
    name: Web SDK
    pre: nodejs
  docs:
    parent: "SDKs"
    name: "Web SDK"
---

## Getting Started

1. Install the sdk:
    - The easy way:
        ```html
        <script src="https://unpkg.com/@realmq/web-sdk"></script>
        ```

    - The flexible way:
        ```bash
        $ yarn add @realmq/web-sdk
        # or
        $ npm install @realmq/web-sdk
        ```

2. Initialize the sdk:

    ```js
    const realmq = new RealMQ('your-auth-token');
    ```

3. Start implementing:

    ```js
    // eg. load some data
    const channels = await realmq.channels.list();

    // or connect to the realtime api
    await realmq.rtm.connect();
    realmq.autoSubscribe();
    ```



