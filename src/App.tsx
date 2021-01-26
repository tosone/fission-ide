import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import _ from 'lodash';

import './App.css';

import Menu from './components/Menu';
import Header from './components/Header';

import Page1 from "./pages/page1";
import Page2 from "./pages/page2";

function App() {
    console.log(_.VERSION);

    return (
        <Router>
            <Header />
            <div style={{ display: 'flex' }}>
                <Menu />
                <Switch>
                    <Route exact path='/page1' component={Page1} />
                    <Route path='/page2' component={Page2} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
