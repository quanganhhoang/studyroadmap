import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header'

const Dashboard = () => <h2>Dashboard</h2>
const Landing = () => <h2>Landing</h2>
const NewPost = () => <h2>NewPost</h2>

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Header />
          <Route exact path="/" component={Landing} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route path="/newpost" component={Landing} />
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;