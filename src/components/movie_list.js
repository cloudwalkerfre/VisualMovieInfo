import * as PIXI from 'pixi.js';

const style = {
  fontSize: 24,
  fontFamily: 'euclid-flex',
  // fontWeight: 'bold',
  fill: 'white',
  align: 'right',
  // wordWrap: true,
  // wordWrapWidth: 100
}

export default class MovieList{
  constructor(movieList){
    this.box = new PIXI.Container();

    movieList.forEach((v, i) => {
      let tmp = new PIXI.Text(v.title, style);
      tmp.x = i * ((window.innerWidth - 100) / (movieList.length + 4)) + 100;
      tmp.y = 2 * window.innerHeight/ 3 + 20;
      tmp.rotation = 0.9;
      tmp.interactive = true;

      tmp.uid = v.uid;
      tmp.name = 'movielist' + '|' + v.title;

      tmp.on('pointerover', () => {
        tmp.style.fontSize *= 1.4;
        tmp.style.fontWeight = 'bold';
      });
      tmp.on('pointerout', () => {
        tmp.style.fontSize /= 1.4;
        tmp.style.fontWeight = 'normal';
      });
      this.box.addChild(tmp);
    });
  }
}
