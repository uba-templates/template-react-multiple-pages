import React,{ Component } from 'react';
import './index.css';

export default class Test extends Component{
  constructor(props) {
   super(props);
 }
  render(){
    return <div className="Test">Hello {this.props.name} , This is React SPA Project!</div>
  }
}
