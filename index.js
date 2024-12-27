const http = require('node:http');
const URL  = require('node:url').URL;
const port = parseInt(process.env.PORT || '4000')

// Minimally polyfill setImmediate, just to be sure
const g = (new Function('return this'))();
if ('function' != typeof g.setImmediate) {
  g.setImmediate = fn => setTimeout(fn, 0);
}

const qs = {
  encode(subject) {
    if (!subject) return '';
    if ('object' !== typeof subject) return '';
    return Object
      .entries(subject)
      .map(([key,value]) => value ? encodeURIComponent(key) + '=' + encodeURIComponent(value) : false)
      .filter(e=>e)
      .join('&')
  },
  decode(subject) {
    if (['#','?'].includes(subject.substring(0, 1))) subject = subject.substring(1);
    if (!subject) return {};
    return subject
      .split('&')
      .reduce((r, a) => {
        const [key, value] = a.split('=');
        r[decodeURIComponent(key)] = decodeURIComponent(value);
        return r;
      }, {})
  }
};

http
  .createServer(async (req, res) => {
    // Detach, run async
    await new Promise(r => setImmediate(r));
    const parsed = new URL(req.url, `http://127.0.0.1:${port}/`);
    const query  = qs.decode(parsed.search);
    const time   = Math.max(10, Math.min(parseInt(query?.time || '100'), 1e4));

    // The artificial load itself
    let   now = Date.now();
    const exp = now + time;
    while(now < exp) {
      now = Date.now();
    }

    // And respond
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ time, ok: true }));
    res.end();
  })
  .listen(parseInt(process.env.PORT || '4000'))
  ;
