import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { firebaseAU } from './firebase';

import Routes from './routes'


const App = props => {
    return (
        <BrowserRouter>
            <Routes {...props}/>
        </BrowserRouter>    
    )
}

firebaseAU.onAuthStateChanged(user => {
    ReactDOM.render(<App user={user}/>, document.getElementById('root'));
});
