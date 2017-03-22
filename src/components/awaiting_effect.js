import * as PIXI from 'pixi.js';

export default class Await{
  constructor(){
    this.box = new PIXI.Container();
    for(let i = 0; i < 5; i ++){
      let dot = new PIXI.Graphics();

      dot.x =  - 10 - i * 1000;
      dot.y = 200;

      dot.lineStyle(0);
      dot.beginFill(0xFFFFF8F8, 1);
      dot.drawCircle(0, 0, 5);
      dot.endFill();

      this.box.addChild(dot);
    };
  }
}
