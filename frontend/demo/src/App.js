import React from 'react'
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Login from './Login';
import SignUp from './Register';
function App() {
  return (
    <Router>
      <Switch>
    <Route path="/" exact component={Login} />
    <Route path="/register" exact component={SignUp} />
    </Switch>
    </Router>
  )
}

export default App
