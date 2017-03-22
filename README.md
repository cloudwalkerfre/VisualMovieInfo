### VisualMovieInfo

----


This is a little PIXI.js learning project, could be a thing.

````
npm i && npm start    
````

PS: 如果你开IMDB卡，最好开个代理，比如proxy-chain(alias pc)，然后：

````
pc npm start    
````

----

- **server** => `koa` take a uid like: _nm1297015_ (Emma Stone), then using `cheerio` and `got` to crawl _Imdb_ info. The uid start with _nm_ is for person, _tt_ is for movie.

- **src** => PIXI wrapped in `react` component, basically a canvas, can interact with some mouse/keyboard event. `PIXI.interactionManager` take those event and dispatch them to actions.

- **data** => An **example** of crawler data, JSON beatified from nedb raw format(meaning not usable), just to give you a taste of ImdbSpider's return data(_nm_ and _tt_)

----

<!-- I try to write it `react` component style with PIXI, but there's limitations, It's impossible to have stateless-like component and using `react` life-cycle to update or mount etc... the data-flow is naturally top-to-bottom, but the updating is manually. -->

##### TODO:

- More effect, it's all about the effect
- Figure out a way to blur background-dots without much costs
- Smooth the state changing, again => more effect
- Store old info in `nedb`, and inter-connect those data
- Make a tree-like view of above, again => more effect
- Add scroll control, need more space
- Now, only actor/actress career's data been rendered, show more like director/producer/writer
