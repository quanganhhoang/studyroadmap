import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './components/Home'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Home} />
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;