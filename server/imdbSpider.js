import got from 'got';
import cheerio from 'cheerio';

// function map
const AliasDic = {
  'Actress': actor,
  'Actor': actor,
  'Soundtrack': soundtrack,
  'Director': director,
  'Producer': producer,
  'Writer': writer,
  'Production Designer': production_designer,
}

/*
    running under node
*/
export default class ImdbSpider{

  static go(uid){
    if(uid.substr(0, 2) === 'nm'){
      return this.nm(uid);
    }else if(uid.substr(0, 2) === 'tt'){
      return this.tt(uid);
    }else{
      return 'Wrong_Code';
    }
  }
  /*
    nm => name which mean person
  */
  static async nm(uid){
    const url = 'http://www.imdb.com/name/' + uid;

    let data = await got(url).then(res => {return res.body});
    let $ = cheerio.load(data);
    let Profile = {};

    Profile._id = uid;
    Profile.Person = person($);

    // console.log(Profile.Person.careers);
    Profile.Person.careers.map((cr, i) => {
      // map info based on person's major careers
      if(AliasDic[cr]){
        Profile[cr] = AliasDic[cr]($);
      }
      // there is some career like stunt, we don't need all of them
      else{
        // Profile[cr] = {};
        console.log('No Such CareerMapper Yet:', cr);
      }
    });

    // for(let it in Profile.Person){
    //   console.log(it, Profile.Person[it])
    // }
    // for(let it = 0; it < Profile.Director.length; it++){
    //   console.log(JSON.stringify(Profile.Director[it]))
    // }
    // for(let it = 0; it < Profile.Actress.length; it++){
    //   console.log(JSON.stringify(Profile.Actress[it]))
    // }
    // for(let it = 0; it < Profile.Producer.length; it++){
    //   console.log(JSON.stringify(Profile.Producer[it]))
    // }
    // for(let it = 0; it < Profile.Soundtrack.length; it++){
    //   console.log(JSON.stringify(Profile.Soundtrack[it]))
    // }
    return Profile;
  } // end of nm

  /*
    tt => title which mean movie
  */
  static async tt(uid){
    const url = 'http://www.imdb.com/title/' + uid;

    let data = await got(url).then(res => {return res.body});
    let $ = cheerio.load(data);
    let Profile = {};
    Profile._id = uid;

    Profile.Movie = movie($);
    Profile.Cast = cast($);


    // for(let it in Profile.Movie){
    //   console.log(it, Profile.Movie[it])
    // }
    // for(let it = 0; it < Profile.Cast.length; it++){
    //   console.log(JSON.stringify(Profile.Cast[it]))
    // }

    return Profile;
  } // end of tt

}


/* ====================================================================

    Map person info:

==================================================================== */
function person($){
  let pit;
  try {
    pit = {
      name: $('.header').find('.itemprop').text(),
      careers: Array.from($('.infobar').find('.itemprop').map((i, v) => {return $(v).text().replace(/\n/, '')})),
      img: $('#img_primary').find('img').eq(0).attr('src') || 'none'
    }
    if($('[itemprop="description"]')[0]){
      pit.brief = $('[itemprop="description"]').text().split(/\n/)[1]
    }
    if($('[itemprop="birthDate"]')[0]){
      pit.birthDate = $('[itemprop="birthDate"]').text().replace(/[\s]/g, '')
    }
    if($('[href*="/search/name?birth_place"]')[0]){
      pit.birthPlace =  $('[href*="/search/name?birth_place"]').text()
    }
  } catch (e) {
    console.log(e)
  }
  return pit;
}


/* ====================================================================

    Map soundtrack info:

==================================================================== */
function soundtrack($){
  let sdt_div = $('[id=filmo-head-soundtrack]').next().find('.filmo-row');

  let soundTrackInfo = sdt_div.map((i, v) => {
    let childNodes = v.childNodes;
    let pit;

    try {
      // pit is the info dic
      pit =
      {
        title: $(childNodes[3]).text(),
        year: $(childNodes[1]).text().replace(/\s/g,'') || 'none',
        link: 'http://www.imdb.com/' + $(childNodes[3]).find('a').eq(0).attr('href'),
        index: i,
      }
      pit.uid = pit.link.match(/tt\d+(?=\/)/g)[0];
      let adn = $(childNodes[4]).text().match(/(?!\()[^()]+(?=\))/g);
      if(adn.length >0){
        pit.addition = adn[0];
      }
    } catch (e) {
      // console.log(e)
    }

    return pit;
  });

  return Array.from(soundTrackInfo);
}

/* ====================================================================

    Map production designer info:

==================================================================== */
function production_designer($){
  let prd_div = $('[id=filmo-head-production_designer]').next().find('.filmo-row');

  let productionDesignerInfo = prd_div.map((i, v) => {
    let childNodes = v.childNodes;
    let pit;

    try {
      // pit is the info dic
      pit =
      {
        title: $(childNodes[3]).text(),
        year: $(childNodes[1]).text().replace(/\s/g,'') || 'none',
        link: 'http://www.imdb.com/' + $(childNodes[3]).find('a').eq(0).attr('href'),
        index: i,
      }
      pit.uid = pit.link.match(/tt\d+(?=\/)/g)[0];

      // if there is sub-state(like preproduction)
      if(childNodes[5].name === 'a'){
        pit.state = $(childNodes[5]).text();
      }
      let adn = $(childNodes[4]).text().match(/(?!\()[^()]+(?=\))/g);
      if(adn.length >0){
        pit.addition = adn[0];
      }
    } catch (e) {
      // console.log(e)
    }

    return pit;
  });

  return Array.from(productionDesignerInfo);
}

/* ====================================================================

    Map producer info:

==================================================================== */
function producer($){
  let pro_div = $('[id=filmo-head-producer]').next().find('.filmo-row');

  let producerInfo = pro_div.map((i, v) => {
    let childNodes = v.childNodes;
    let pit;

    try {
      // pit is the info dic
      pit =
      {
        title: $(childNodes[3]).text(),
        year: $(childNodes[1]).text().replace(/\s/g,'') || 'none',
        link: 'http://www.imdb.com/' + $(childNodes[3]).find('a').eq(0).attr('href'),
        index: i,
      }
      pit.uid = pit.link.match(/tt\d+(?=\/)/g)[0];

      // if there is sub-state(like preproduction)
      if(childNodes[5].name === 'a'){
        pit.state = $(childNodes[5]).text();
      }
      // childNodes[4] is the addition info for producer
      let side_infos = $(childNodes[4]).text().match(/(?!\()[^()]+(?=\))/g);
      if(side_infos.length > 1){
        pit.type = side_infos[0];
        pit.role = side_infos[1].split(/-/g)[0].match(/\b.+\b/g)[0];
      }else{
        pit.role = side_infos[0].split(/-/g)[0].match(/\b.+\b/g)[0];
      }


    } catch (e) {
      // console.log(e)
    }

    return pit;
  });

  return Array.from(producerInfo);
}

/* ====================================================================

    Map director info:

==================================================================== */
function director($){
  let drc_div = $('[id=filmo-head-director]').next().find('.filmo-row');

  let directorInfo = drc_div.map((i, v) => {
    let childNodes = v.childNodes;
    let pit;

    try {
      // pit is the info dic
      pit =
      {
        title: $(childNodes[3]).text(),
        year: $(childNodes[1]).text().replace(/\s/g,'') || 'none',
        link: 'http://www.imdb.com/' + $(childNodes[3]).find('a').eq(0).attr('href'),
        index: i,
      }
      pit.uid = pit.link.match(/tt\d+(?=\/)/g)[0];

      // if there is sub-state(like preproduction)
      if(childNodes[5].name === 'a'){
        pit.state = $(childNodes[5]).text();
      }
      let adn = $(childNodes[4]).text().match(/(?!\()[^()]+(?=\))/g);
      if(adn.length >0){
        pit.addition = adn[0];
      }
      // // childNodes[4] is the addition info for director
      // let side_infos = $(childNodes[4]).text().match(/(?!(\())[^()]+(?=\))/g);
      // if(side_infos.length > 1){
      //   pit.type = side_infos[0];
      //   pit.additional = side_infos[1];
      // }else{
      //   pit.type = side_infos[0];
      // }
    } catch (e) {
      // console.log(e)
    }

    return pit;
  });

  return Array.from(directorInfo);
}

/* ====================================================================

    Map writer info:

==================================================================== */
function writer($){
  let wrt_div = $('[id=filmo-head-writer]').next().find('.filmo-row');

  let writerInfo = wrt_div.map((i, v) => {
    let childNodes = v.childNodes;
    let pit;

    try {
      // pit is the info dic
      pit =
      {
        title: $(childNodes[3]).text(),
        year: $(childNodes[1]).text().replace(/\s/g,'') || 'none',
        link: 'http://www.imdb.com/' + $(childNodes[3]).find('a').eq(0).attr('href'),
        index: i,
      }
      pit.uid = pit.link.match(/tt\d+(?=\/)/g)[0];

      // if there is sub-state(like preproduction)
      if(childNodes[5].name === 'a'){
        pit.state = $(childNodes[5]).text();
      }
      let adn = $(childNodes[4]).text().match(/(?!\()[^()]+(?=\))/g);
      if(adn.length >0){
        pit.addition = adn[0];
      }
      // // childNodes[4] is the addition info for producer
      // let side_infos = $(childNodes[4]).text().match(/(?!(\())[^()]+(?=\))/g);
      // if(side_infos.length > 1){
      //   pit.type = side_infos[0];
      //   pit.role = side_infos[1].split(/-/g)[0].match(/\b.+\b/g)[0];
      // }else{
      //   pit.role = side_infos[0].split(/-/g)[0].match(/\b.+\b/g)[0];
      // }


    } catch (e) {
      // console.log(e)
    }

    return pit;
  });

  return Array.from(writerInfo);
}

/* ====================================================================

    Map actor(or actress) info:

==================================================================== */
function actor($){
  let act_div = $('[id*=filmo-head-act]').next().find('.filmo-row');

  let actorInfo = act_div.map((i, v) => {
    let childNodes = v.childNodes;
    let pit;
    let titleRoleFlag = false;

    try {
      // pit is the info dic
      pit =
      {
        title: $(childNodes[3]).text(),
        year: $(childNodes[1]).text().replace(/\s/g,'') || 'none',
        link: 'http://www.imdb.com/' + $(childNodes[3]).find('a').eq(0).attr('href'),
        index: i
      }
      pit.uid = pit.link.match(/tt\d+(?=\/)/g)[0];

      // if there is sub-type(like TV Series)
      let typeTmp = $(childNodes[4]).text().match(/(?!\()[^()]+(?=\))/g);
      if(typeTmp){
        pit.type = typeTmp[0];
      }

      // if there is sub-state(like preproduction)
      if(childNodes[5].name === 'a'){
        pit.state = $(childNodes[5]).text();
        if($(childNodes[6]).text().match(/(?!\()[^()]+(?=\))/g)){
          pit.role = $(childNodes[6]).text().match(/(?!\()[^()]+(?=\))/g)[0];
          titleRoleFlag = true;
        }
      }

      // there is detailed info
      if(!titleRoleFlag){
        // console.log(childNodes.length, pit.title )
        pit.character = [];
        // childNodes name iter start from index 6
        let tmpI = 6;

        // incase no link name or uncredited
        let otherCase = $(childNodes[tmpI]).text().match(/\b[^(]+\b/g);
        if(otherCase){
          if(otherCase.length === 1){
            pit.character.push({name: otherCase[0]})
          }else if(otherCase.length === 2){
            pit.character.push({name: otherCase[0], addition: otherCase[1]})
          }
        }else{
          // childNodes name iter start from index 7 (with link)
          tmpI++;
          // collect character
          while(tmpI < childNodes.length){
            if(childNodes[tmpI].name === 'a'){
              // incase additional info
              let nextText = $(childNodes[tmpI + 1]).text();
              if(nextText.match(/(?!\()[^()]+(?=\))/g)){
                pit.character.push({name: $(childNodes[tmpI]).text(), addition: nextText.match(/(?!\()[^()]+(?=\))/g)[0]});
              }else{
                if(nextText.match(/(?!\/)\b[^\/]+\b/g)){
                  pit.character.push({name: $(childNodes[tmpI]).text()});
                  pit.character.push({name: nextText.match(/(?!\/)\b[^\/]+\b/g)[0]})
                }else{
                  pit.character.push({name: $(childNodes[tmpI]).text()});
                }
              }
            }
            tmpI++;
          }
        }
        if(pit.character.length === 0){
          delete pit.character;
        }

      }

      // incase TV Series
      if(pit.type === 'TV Series'){
        pit.TV = [];
        // childNodes TV-Series iter start from index 6
        let tmpI = 6;
        while(tmpI < childNodes.length){
          if($(childNodes[tmpI]).attr('class') === 'filmo-episodes' && $(childNodes[tmpI]).find('a').eq(0).attr('href') != '#'){
            // let episode = childNodes[tmpI].childNodes;
            let tvs = {title: $(childNodes[tmpI].childNodes[1]).text(), year: $(childNodes[tmpI].childNodes[2]).text().match(/(?!\()[^()]+(?=\))/g)[0]};
            // console.log(childNodes[tmpI].childNodes.length, tvs.title)
            if(childNodes[tmpI].childNodes.length >= 4){
              tvs.character = {};
              tvs.character.name = $(childNodes[tmpI].childNodes[3]).text();
            }
            if($(childNodes[tmpI].childNodes[4]).text().match(/(?!\()[^()]+(?=\))/g)){
              tvs.character.addition = $(childNodes[tmpI].childNodes[4]).text().match(/(?!\()[^()]+(?=\))/g)[0];
            }
            tvs.link = 'http://www.imdb.com/' + $(childNodes[tmpI]).find('a').eq(0).attr('href');
            pit.TV.push(tvs);
          }
          tmpI++;
        }
      }
    } catch (e) {
      // console.log(e, pit.title)
    }

    return pit;
  });

  return Array.from(actorInfo);
}

/* ====================================================================

    Map movie info:

==================================================================== */
function movie($){
  let pit;
  try {
    pit = {
      title: $($('.titleBar').find('[itemprop="name"]')[0].childNodes[0]).text().match(/(?!\s).+(?=\s)/g)[0]
    }
    if($('.poster')[0]){
      pit.img = $('.poster').find('img').attr('src')
    }
    if($('#titleYear')[0]){
      pit.year = $('#titleYear').text().match(/\b.+\b/g)[0]
    }
    if($('span[itemprop="ratingValue"]')[0]){
      pit.rate = $('span[itemprop="ratingValue"]').text()
      pit.rateCount = $('span[itemprop="ratingCount"]').text().replace(/[,]/g, '')
    }
    if($('meta[itemprop="contentRating"]')[0]){
      pit.PG = $($('meta[itemprop="contentRating"]').parent()[0].childNodes[2]).text().match(/(?!\s).+(?=\s)/g)[0]
    }
    if($('.subtext').find('time[itemprop="duration"]')[0]){
      pit.duration = $('.subtext').find('time[itemprop="duration"]').text().match(/(?!\s).+(?=\s)/g)[0]
    }
    if($('.subtext').find('span[itemprop="genre"]')[0]){
      pit.genre = Array.from($('.subtext').find('span[itemprop="genre"]').map((i, v) => {return $(v).text()}))
    }
    if($('.subtext').find('[href*="/releaseinfo"]')[0]){
      pit.releaseDate = $('.subtext').find('[href*="/releaseinfo"]').text().match(/(?!\s).+(?=\s)/g)[0]
    }
    if($('.plot_summary_wrapper').find('[itemprop="description"]')[0]){
      pit.brief = $('.plot_summary_wrapper').find('[itemprop="description"]').text().match(/(?!\s).+(?=\s)/g)[0]
    }
    if($('.plot_summary_wrapper').find('[itemprop="director"]')[0]){
      pit.director = Array.from($('.plot_summary_wrapper').find('[itemprop="director"]').find('[itemprop="url"]').map((i, v) => {
        return {
          name: $(v).find('[itemprop="name"]').text(),
          link: 'http://www.imdb.com/' + $(v).attr('href')
        }
      }));
    }
    if($('.plot_summary_wrapper').find('[itemprop="creator"]')[0]){
      pit.writer = Array.from($('.plot_summary_wrapper').find('[itemprop="creator"]').find('[itemprop="url"]').map((i, v) => {
        return {
          name: $(v).find('[itemprop="name"]').text(),
          link: 'http://www.imdb.com/' + $(v).attr('href')
        }
      }));
    }
    if($('.metacriticScore').find('span')[0]){
      pit.metascore = $('.metacriticScore').find('span').text()
    }
    if($('.titleReviewBarItem').find('a[href^="reviews"]')[0]){
      pit.review = {
        user: $('.titleReviewBarItem').find('a[href^="reviews"]').text().replace(/,/g, '').match(/\d+/g)[0],
        critic: $('.titleReviewBarItem').find('a[href^="externalreviews"]').text().replace(/,/g, '').match(/\d+/g)[0]
      }
    }
    if($('#titleAwardsRanks').find('[itemprop="awards"]')[0]){
      pit.awards = $('#titleAwardsRanks').find('[itemprop="awards"]').text().replace(/[\n ]+/g, ' ')
    }

  } catch (e) {
    console.log(e)
  }

  return pit;
} // end of movie


/* ====================================================================

    Map cast info:

    This is not the full cast list - it's a breif cast
==================================================================== */
function cast($){
  let cast_div = $('#titleCast').find('.cast_list').find('.odd, .even');
  let castInfo;
  if(cast_div[0]){
    castInfo = cast_div.map((i, v) => {
      let pit;
      try {
        pit = {
          name: $(v).find('[itemprop="name"]').text(),
          link: $(v).find('[itemprop="url"]').attr('href'),
          character: $(v).find('.character').text().match(/\b.+(?=[ ])/g)[0]
        }
      } catch (e) {
        // console.log(e)
      }
      return pit;
    })
  }

  return Array.from(castInfo);
}
