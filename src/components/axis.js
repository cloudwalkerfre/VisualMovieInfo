import * as PIXI from 'pixi.js';

export default class Axis{
  constructor(){
    this.box = new PIXI.Graphics();
    this.box.lineStyle(1, 0xFFFFF8F8, 1);
    this.box.moveTo(100, 2 * window.innerHeight / 3)
    this.box.lineTo(window.innerWidth - 100, 2 * window.innerHeight / 3);
  }
}
