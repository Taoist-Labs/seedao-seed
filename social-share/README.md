## social-share

twitter/discord share api server.

#### dev local

```
$ npx wrangler dev
```

#### deploy to cloudflare workers

before deploy, you need to login to cloudflare workers by `npx wrangler login`.

you can deploy to your own account's cloudflare workers only !!

```
$ npx wrangler deploy
```

when deploy success, you can access at `https://social-share.YOUR_NAME.workers.dev`.
