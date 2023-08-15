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
  BUCKET_SEED: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;
}

export default {
  async fetch(
    req: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    switch (req.method) {
      case 'OPTIONS':
        const r = new Response(null);
        // set cors header
        setCorsHeaders(r);
        return r;
      case 'POST':
        // new file name is bucket's object count
        const objects = await env.BUCKET_SEED.list();
        const name = `${objects.objects.length}.png`;

        // save file to bucket
        await env.BUCKET_SEED.put(name, req.body);

        const resp = new Response(JSON.stringify({ name: name }), {
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
        });

        // set cors header
        setCorsHeaders(resp);
        return resp;
      case 'GET':
        // read `name` param from url
        const url = new URL(req.url);
        const fileName = url.pathname.slice(1);

        // read file from bucket
        const object = await env.BUCKET_SEED.get(fileName);
        if (object === null) {
          return new Response('Object Not Found', { status: 404 });
        }

        return new Response(object.body);
      default:
        return new Response('Method Not Allowed', {
          status: 405,
          headers: {
            Allow: 'GET, POST, OPTIONS',
          },
        });
    }
  },
};

function setCorsHeaders(resp: Response) {
  resp.headers.set('Access-Control-Allow-Origin', '*');
  resp.headers.set('Access-Control-Allow-Credentials', 'true');
  resp.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  resp.headers.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
}
