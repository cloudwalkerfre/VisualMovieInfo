import Koa from 'koa';
import serve from 'koa-static';
import send from 'koa-send';
import mount from 'koa-mount';
import Router from 'koa-router';

import ImdbSpider from './server/imdbSpider';

const app = new Koa();
const static_app = new Koa();
const router = new Router();

/*
    bundle.js and style.css went in here
*/
static_app.use(serve('build'));
app.use(mount('/build', static_app));

/*
    get movie or person based on uid
*/
router.get('/:id', async (ctx) => {
  ctx.body = await ImdbSpider.go(ctx.params.id);
});

app.use(router.routes());

app.use(async(ctx) => {
  await send(ctx, 'index.html');
});

app.listen(3000, () => {
  console.log('VisualMovieInfo started at port 3000 ... enjoy!')
});
