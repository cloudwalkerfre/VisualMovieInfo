import React, { Component } from 'react';
import * as PIXI from 'pixi.js';

import MainView from './mainview';
import Axis from './axis';
import MovieList from './movie_list';
import MovieBox from './movie_box';
import PersonBox from './person_box';
import BackGround from './background';
import MovieDetail from './movie_detail';
import SearchBar from './search_bar';
import Await from './awaiting_effect';


// MAIN view //
const main = new MainView();
// background dots effect //
const background = new BackGround();
// loading effect //
const loading = new Await();
// PIXI.Container Instance map //
const ConCollector = {};

// dots moving speed coefficient //
let dotSpeed = 1;
// loading? //
let isLoading = false;

ConCollector.main = main;
ConCollector.loading = loading;
ConCollector.background = background;

const MovieListSlideDown = () => {
  if(ConCollector.movielist.box.y < window.innerHeight/7){
    ConCollector.movielist.box.y += 15;
    ConCollector.axis.box.y += 15;
    dotSpeed = 10;
  }else{
    dotSpeed = 1;
    ConCollector.main.app.ticker.remove(MovieListSlideDown)
  }
}

const rotaionMovieList = () => {
  if(ConCollector.movielist.box.getChildAt(1).rotation.toFixed(1) != -0.9){
    let l = ConCollector.movielist.box.children.length;
    for(let i = 0; i < l; i++){
      let chd = ConCollector.movielist.box.getChildAt(i)
      chd.rotation  -= 0.03 ;
    }
  }else{
    ConCollector.main.app.ticker.remove(rotaionMovieList)
  }
}

const MovieBoxSlideRight = () => {
  if(ConCollector.moviebox.box.x < 3 * window.innerWidth / 4){
    ConCollector.moviebox.box.x += 30;
    dotSpeed = 10;

  }else{
    dotSpeed = 1;
    ConCollector.main.app.stage.addChild(ConCollector.moviedetail.box);
    ConCollector.main.app.ticker.remove(MovieBoxSlideRight);
  }
}

const PersonBoxSlideLeft = () => {
  if(ConCollector.personbox.box.x > window.innerWidth / 4  - 100){
    ConCollector.personbox.box.x -= 30;
    dotSpeed = 10;

  }else{
    dotSpeed = 1;
    ConCollector.main.app.stage.addChild(ConCollector.moviebox.box);
    ConCollector.main.app.ticker.remove(PersonBoxSlideLeft);
  }
}

const AwaitLoading = () => {
  ConCollector.loading.box.children.forEach((v, i) => {
    if(v.x > window.innerWidth + 50){
      if(isLoading){
        v.x = - 10 - i * 1000;
      }
    }else{
      v.x += Math.abs(window.innerWidth / 2 - v.x) / 10 + 5;
    }
  });
}

const BackGroundEffect = () => {
  let l = ConCollector.background.dotNum;
  for(let i = 0; i < l; i++){
    let dot = ConCollector.background.box.getChildAt(i);
    dot.direction += Math.random() * 0.01;
    dot.x += Math.sin(dot.direction) * dot.speed * dotSpeed;
    dot.y += Math.cos(dot.direction) * dot.speed * dotSpeed;

    if(dot.x < -50){
      dot.x += window.innerWidth + 100;
    }else if(dot.x > window.innerWidth + 50){
      dot.x -= window.innerWidth + 100;
    }

    if(dot.y < -50){
      dot.y += window.innerHeight + 100;
    }else if(dot.y > window.innerHeight + 50){
      dot.y -= window.innerHeight + 100;
    }
  }
}


ConCollector.main.app.stage.addChild(background.box, loading.box);
ConCollector.main.app.ticker.add(BackGroundEffect);
ConCollector.main.app.ticker.add(AwaitLoading);


// action store //
ConCollector.main.interactionManager.on('pointerdown', async (e) => {
  let target = e.target;
  if(!target) return;
  let name = target.name.match(/\b\w+(?=|)/g)[0];
  let data;
  // console.log(target， name);


  switch(name){
    case 'moviebox':
      // ConCollector.main.app.ticker.add(rotaionMovieList);
      ConCollector.main.app.ticker.add(MovieBoxSlideRight);
      break;

    case 'movielist':
      isLoading = true;
      data = await fetch(target.uid).then(res => {return res.json()});
      isLoading = false;

      if(ConCollector.moviebox){
        ConCollector.main.app.stage.removeChild(ConCollector.moviebox.box);
      }
      if(ConCollector.moviedetail){
        ConCollector.main.app.stage.removeChild(ConCollector.moviedetail.box);
      }

      const moviebox = new MovieBox(data.Movie);
      const moviedetail = new MovieDetail(data.Cast);

      ConCollector.moviebox = moviebox;
      ConCollector.moviedetail = moviedetail;

      ConCollector.main.app.ticker.add(MovieListSlideDown);
      ConCollector.main.app.ticker.add(PersonBoxSlideLeft);
      break;

    case 'personbox':
      isLoading = true;
      data =  await fetch(target.uid).then(res => {return res.json()});
      isLoading = false;

      if(ConCollector.main.app.stage.children.length > 3){
        ConCollector.main.app.stage.removeChildren(2, ConCollector.main.app.stage.children.length);
      }

      const axis = new Axis();
      const movielist = new MovieList(data.Actress || data.Actor);
      const personbox = new PersonBox(data.Person);

      ConCollector.axis = axis;
      ConCollector.movielist = movielist;
      ConCollector.personbox = personbox;

      ConCollector.main.app.stage.addChild(axis.box, movielist.box, personbox.box);
      break;
  }
});


let searchText = '';

// get data for input id //
async function enterHandle(e){
  if(e.keyCode === 13){
    e.preventDefault();
    const uid = e.target.textContent;

    isLoading = true;
    let data = await fetch(uid).then(res => {return res.json()});
    isLoading = false;

    if(ConCollector.main.app.stage.children.length > 3){
      ConCollector.main.app.stage.removeChildren(2, ConCollector.main.app.stage.children.length);
    }

    const axis = new Axis();
    const movielist = new MovieList(data.Actress || data.Actor);
    const personbox = new PersonBox(data.Person);

    ConCollector.axis = axis;
    ConCollector.movielist = movielist;
    ConCollector.personbox = personbox;

    ConCollector.main.app.stage.addChild(axis.box, movielist.box, personbox.box);
  }
}

export default class VM extends Component{
  componentDidMount(){
      this.refs.main.appendChild(ConCollector.main.app.view);
  }

  render() {
      return (
        <div className='_app'>
          <SearchBar enterHandle={enterHandle} searchText={searchText}/>
          <div
            className="canvas-container"
            ref="main"
          />
        </div>
       );
  }
}
