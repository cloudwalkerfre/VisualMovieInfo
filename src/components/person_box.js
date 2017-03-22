import * as PIXI from 'pixi.js';


const style = {
  fontSize: 20,
  fontFamily: 'euclid-flex',
  // fontWeight: 'bold',
  fill: 'white',
  // wordWrap: true,
  // wordWrapWidth: 300,
}

export default class PersonBox{
  constructor(person){
    this.box = new PIXI.Container();
    this.box.x = window.innerWidth / 2;
    this.box.y = window.innerHeight / 6;

    if(person.img){
      let img = PIXI.Sprite.fromImage(person.img);
      img.name = 'personbox' + '|' + person.name;
      img.x -= 400;
      img.scale.set(window.devicePixelRatio * 1.5, window.devicePixelRatio * 1.5);
      img.interactive = true;

      this.box.addChild(img);

      // img.on('pointerover', () => {
      //   img.scale.x *= 1.25;
      //   img.scale.y *= 1.25;
      // });
      // img.on('mouseout', () => {
      //   img.scale.x /= 1.25;
      //   img.scale.y /= 1.25;
      // });
      // img.on('pointerdown', () => {
      //   img.x += (Math.random() - 0.5)*100;
      //   img.y += (Math.random() - 0.5)*100;
      // });
    }

    let name = new PIXI.Text(person.name, {
      fontSize: 30,
      fontFamily: 'euclid-flex',
      fontWeight: 'bold',
      fill: 'white'
    });
    let careers = new PIXI.Text(person.careers.join(), style);
    careers.y += 60;
    this.box.addChild(name, careers);

    if(person.birthDate){
      let birthday = new PIXI.Text(person.birthDate, style);
      birthday.y += 120;

      this.box.addChild(birthday);
    }
    if(person.brief){
      let brief = new PIXI.Text(person.brief, {
        fontSize: 20,
        wordWrap: true,
        wordWrapWidth: 330,
        fill: 'white'
      });
      brief.y += 180;

      this.box.addChild(brief);
    }

  }
}
