import * as PIXI from 'pixi.js';

const dotNum = 1000;

export default class BackGround{
  constructor(){
    this.dotNum = dotNum;
    this.box = new PIXI.Container();
    this.box.position.set(0, 0);
    for(let i = 0; i < dotNum; i++){
      let dot = new PIXI.Graphics();
      dot.lineStyle(0);
      dot.beginFill(0xFFFFF8F8, 0.5);
      dot.drawCircle(0, 0, Math.random() * 30);
      dot.endFill();
      dot.alpha = Math.random();

      dot.direction = Math.random() * Math.PI * 2;
      dot.speed =  Math.random() * 2;

      // let blur_filter = new PIXI.filters.BlurFilter();
      // blur_filter.blur = 2;
      // dot.filters = [blur_filter];
      // dot.cacheAsBitmap = true;

      if(i % 2 === 0){
        dot.speed += (Math.random() - 0.5) * 4;
      }else{
        dot.position.set(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        dot.speed /= 2;
      }

      this.box.addChild(dot);
    }
  }
}
