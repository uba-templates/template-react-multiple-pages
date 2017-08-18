import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from 'components/Welcome';
import './index.css';

ReactDOM.render(<Welcome title="欢迎使用uba所构建的多页面脚手架" content="本页面来自演示组件[src/components/Welcome]，你可以修改入口文件[src/pages/index/index.js]来设置不同的加载组件。" />,
  document.querySelector("#app"));
