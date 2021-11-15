import Gitrepo from "../src/Components/Gitrepo.js"
import SearchResult from "../src/Components/Searchresult"
import Login from "../src/Components/Login"
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div class="dark-background">
      <Router>

        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route exact path="/signup" component={Login}></Route>
          <Route exact path="/search" component={Gitrepo}></Route>
          <Route exact path="/search/results" render={(props) => (<SearchResult {...props} />)}></Route>/
         </Switch>
      </Router>
    </div>
  );
}

export default App;
