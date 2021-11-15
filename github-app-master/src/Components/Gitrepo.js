import { useState, useEffect } from "react"
import axios from 'axios';
import { getWithExpiry, isAuthenticated } from "../utils";

export const Gitrepo = ({ history, location }) => {
  const [user, setUser] = useState("");
  const [data, setData] = useState([]);
  const [starredRepos, setStarredRepos] = useState([]);
  const [showStarRepos, setShowStarRepos] = useState(false);


  useEffect(() => {
    isAuthenticated(history);
    const uname = getWithExpiry("uname");
    axios.get(`https://github-app-server.herokuapp.com/starredRepos/${uname}`).then(response => {
      setStarredRepos(response.data.user.starredRepos);
      console.log(response.data.user.starredRepos);
    })
  }, []);



  function handleInputChange(event) {
    let name = event.target.value;
    setUser(name);
  }

  function handleKeypress(event) {
    //it triggers by pressing the enter key
    if (event.key === 'Enter') {
      console.log(user);
      handleSubmit();
    }
  };

  function handleSubmit() {
    axios.get(`https://api.github.com/users/${user}`)
      .then((response) => {
        const data = response.data;
        setData(data);
        history.push({
          pathname: '/search/results',
          state: { results: data }
        })
      })
  }

  return (

    <div class="dark-background full-height">
      <div class="container">
        <br />
        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-8">
            <div class="card card-sm">
              <div class="card-body row no-gutters align-items-center">
                <div class="col-auto">
                  <i class="fas fa-search h4 text-body"></i>
                </div>
                <div class="col">
                  <input class="form-control form-control-lg form-control-borderless" value={user}
                    onChange={(e) => handleInputChange(e)}
                    onKeyPress={(e) => handleKeypress(e)} type="search" placeholder="Search Github users..." />
                </div>
                <div class="col-auto">
                  <button class="btn btn-lg btn-success" onClick={() => handleSubmit()}>Search</button>
                </div>
              </div>
            </div>
            <div onClick={() => setShowStarRepos(!showStarRepos)} class="text-center cursor-pointer">Previously starred repos</div>
            {showStarRepos && starredRepos.map(repo => (
              <div className="card col-md card-md">

                <div className="card-body">
                  <div class="inline-block"><h5 className="card-title">{repo}</h5>
                  </div>
                </div>

              </div>))}
          </div>
        </div>
      </div>
    </div>

  )
}
export default Gitrepo
