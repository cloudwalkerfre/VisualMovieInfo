import React, { Component } from 'react';

export default class SearchBar extends Component{
  render(){
    const enterHandle = this.props.enterHandle;
    return (
      <div
        className='search_bar'
        style={{'marginLeft': window.innerWidth/2 - 200, 'marginTop': 40, 'width': 300, 'textAlign': 'center'}}
        contentEditable
        spellCheck={false}
        // dangerouslySetInnerHTML={{__html: searchText || ""}}
        onKeyDown={(e) => enterHandle(e)}
      />
    );
  }
}
