import { resolve } from 'path';
// koa相关
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import locales from 'koa-locales';
import jwt from 'koa-jwt';
import compress from 'koa-compress';
import { User } from './models';

// config
import { serverConfig } from './config';

// router
import router from './routers';

const app = new Koa();

// 多语言
const localeOptions = {
  dirs: [resolve(__dirname, 'locales')],
  defaultLocale: 'zh-CN'
};
locales(app, localeOptions);

// x-response-time
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// Error handle
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      type: 'error',
      message: err.message
    };
  }
});

//jwt
const isRevoked = async (ctx, token) => {
  const user = await User.findById(token.id);
  if (user && user.tokenVersion === token.version) {
    return Promise.resolve(false);
  } else {
    return Promise.resolve(true);
  }
};
app.use(
  jwt({ secret: serverConfig.jwt.key, isRevoked }).unless({
    path: [/^\/api\/login/, /^\/api\/register/, /^\/api\/confirm/]
  })
);

//bodyparser
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.use(compress());

app.listen(serverConfig.port, () => {
  console.log(
    'Server listening on: %s:%d',
    serverConfig.host,
    serverConfig.port
  );
});
