import * as PXIX from 'pixi.js';

const style = {
  fontSize: 30,
  fontFamily: 'euclid-flex',
  // fontWeight: 'bold',
  fill: 'white',
  align: 'right',
  // wordWrap: true,
  // wordWrapWidth: 100
}

export default class MovieDetail{
  constructor(cast){
    this.box = new PIXI.Container();
    this.box.position.set(window.innerWidth / 3 + 150, window.innerHeight / 7);
    cast.forEach((v, i) => {
      let ca = new PIXI.Text(v.name + '  ...  ' + v.character, style);
      ca.y = i * ((4 * window.innerHeight / 7) / cast.length);
      ca.name = 'personbox' + '|' + v.name;
      ca.uid = v.link.match(/nm\d+/g)[0];
      ca.interactive = true;

      this.box.addChild(ca);

      ca.on('pointerover', () => {
        ca.style.fontSize *= 1.4;
        ca.style.fontWeight = 'bold';
      });
      ca.on('pointerout', () => {
        ca.style.fontSize /= 1.4;
        ca.style.fontWeight = 'normal';
      });
    });
  }
}
