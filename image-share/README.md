## social-share

twitter/discord share api server.

#### dev local

```
$ npx wrangler dev
```

#### deploy to cloudflare workers

before deploy, you need to login to cloudflare workers by `npx wrangler login`.

and you need to set `wrangler.toml`'s `account_id` to your own account id, executing `npx wrangler whoami` to get your account id.

and use `npx wrangler r2 bucket create seed` to create a bucket named `seed` to store image files.

you can deploy to your own account's cloudflare workers only !!

```
$ npx wrangler deploy
```

when deploy success, you can access at `https://image-share.YOUR_NAME.workers.dev`.
