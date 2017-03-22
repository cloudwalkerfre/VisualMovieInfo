import * as PIXI from 'pixi.js';

export default class MainView{
  constructor(){
    this.app = new PIXI.Application(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,
      {
        resolution: window.devicePixelRatio,
        backgroundColor: 	1326170,
      }
    );
    this.app.view.style.position = "absolute";
    this.app.view.style.display = "block";
    this.app.view.style.width = window.innerWidth;
    this.app.view.style.height = window.innerHeight;
    this.app.autoResize = true;

    this.interactionManager = new PIXI.interaction.InteractionManager(this.app.renderer);
  }
}
