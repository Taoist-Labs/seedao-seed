/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;
}

export default {
  // http://127.0.0.1:8787?url=https://abc.com&title=ttt&desc=ddd&image=iii
  async fetch(
    req: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    return new Response(renderTemplate(parseParams(req)), {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  },
};

function parseParams(request: Request) {
  const { searchParams } = new URL(request.url);
  let url = searchParams.get('url') || 'https://seed.seedao.xyz/';
  let title = searchParams.get('title') || "SeeDAO Seed NFT";
  let desc = searchParams.get('desc') || 'Seed Now, See the DAO';
  let image = searchParams.get('image');
  image = `https://image-share.fn-labs.workers.dev/${image}.png`
  let style = searchParams.get('style') || 'summary_large_image'; // support `summary` and `summary_large_image`
  // console.log(url, title, desc, image, style);

  return { url, title, desc, image, style };
}

function renderTemplate(params: ReturnType<typeof parseParams>) {
  const { url, title, desc, image, style } = params;
  return `<html>
<head>
	<script>window.location.replace("${url}")</script>

	<meta name="twitter:card" content="${style}" />
    <meta name="twitter:site" content="@nytimesbits" />
    <meta name="twitter:creator" content="@nickbilton" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${image}" />
</head>
</html>`;
}
