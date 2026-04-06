import './polyfills';
import 'typeface-muli';
import './react-table-defaults';
import './react-chartjs-2-defaults';
import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app/App';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
