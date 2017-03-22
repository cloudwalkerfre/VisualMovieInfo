import * as PIXI from 'pixi.js';

const style = {
  fontSize: 20,
  fontFamily: 'euclid-flex',
  // fontWeight: 'bold',
  fill: 'white',
  // wordWrap: true,
  // wordWrapWidth: 300,
}

export default class MovieBox {
  constructor(movie){
    this.box = new PIXI.Container();
    this.box.x = window.innerWidth / 2;
    this.box.y = window.innerHeight / 6;

    if(movie.img){
      let img = PIXI.Sprite.fromImage(movie.img)
      img.name = 'moviebox' + '|' + movie.title;
      img.x -= 350;
      img.scale.set(window.devicePixelRatio * 1.5, window.devicePixelRatio * 1.5);
      img.interactive = true;
      // img.on('pointerover', () => {
      //   img.scale.x *= 1.5;
      //   img.scale.y *= 1.5;
      // });
      // img.on('pointerout', () => {
      //   img.scale.x /= 1.5;
      //   img.scale.y /= 1.5;
      // });
      this.box.addChild(img);
    }

    let i = 0;
    for(let it in movie){
      let tmp;
      let td = '';

      switch(it){
        case 'title':
          tmp = new PIXI.Text(movie[it],
            {
              fontSize: 30,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'year':
          tmp = new PIXI.Text(movie[it],
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'rate':
          tmp = new PIXI.Text(movie[it],
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'rateCount':
          tmp = new PIXI.Text(movie[it],
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'PG':
          tmp = new PIXI.Text(movie[it],
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'duration':
          tmp = new PIXI.Text(movie[it],
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'genre':
          tmp = new PIXI.Text(movie[it].join(),
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'releaseDate':
          tmp = new PIXI.Text(movie[it],
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'brief':
          tmp = new PIXI.Text(movie[it],
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'director':
          movie[it].forEach(v => {
            td += v.name + ' ';
          })
          tmp = new PIXI.Text(td,
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'writer':
          movie[it].forEach(v => {
            td += v.name + ' ';
          })
          tmp = new PIXI.Text(td,
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        case 'metascore':
          tmp = new PIXI.Text(movie[it],
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;

        // case 'review':
        //   tmp = new PIXI.Text(movie[it],
        //     {
        //       fontSize: 20,
        //       fontFamily: 'euclid-flex',
        //       // fontWeight: 'bold',
        //       fill: 'white',
        //     });
        //   break;
        
        case 'awards':
          tmp = new PIXI.Text(movie[it],
            {
              fontSize: 20,
              fontFamily: 'euclid-flex',
              // fontWeight: 'bold',
              fill: 'white',
            });
          break;
      }
      if(tmp){
        tmp.y += i * 30;
        this.box.addChild(tmp)
        i++;
      }
    }
  }
}
