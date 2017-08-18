import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from 'components/Welcome';
import './index.css';

ReactDOM.render(<Welcome title="用户登录" content="欢迎访问本页面" />,
  document.querySelector("#app"));
