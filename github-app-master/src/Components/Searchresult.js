import axios from "axios";
import { useState, useEffect } from "react";
import { getWithExpiry, isAuthenticated } from "../utils";

export const SearchResult = ({ location, history }) => {

  const [repos, setRepos] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [starredRepos, setStarredRepos] = useState([]);
  const isStarred = true;
  useEffect(() => {
    isAuthenticated(history);
    const uname = getWithExpiry("uname");
    let resultList = location.state.results;
    let userName = resultList.login;
    let avatarUrl = resultList.avatar_url;
    setAvatarUrl(avatarUrl);
    axios.get(`https://api.github.com/users/${userName}/repos`).
      then((response) => {
        const data = response.data
        data.sort((a, b) => a.watchers_count - b.watchers_count)
        setRepos(data)
      });
    axios.get(`https://github-app-server.herokuapp.com/starredRepos/${uname}`).then(response => {
      setStarredRepos(response.data.user.starredRepos);
    })

  }, []);

  function starRepo(repoName, isAlreadyStarred) {
    const uname = getWithExpiry("uname");
    axios.get(`https://github-app-server.herokuapp.com/starRepo/${uname + "/" + repoName + (isAlreadyStarred ? "/remove" : "/add")}`).then(response => {
      let updatedStarredRepos = [...starredRepos];
      if (isAlreadyStarred) {
        updatedStarredRepos = starredRepos.filter(repo => repo !== repoName);
      } else {
        updatedStarredRepos.push(repoName);
      }
      setStarredRepos(updatedStarredRepos);
    })
  }

  function handleBack() {
    history.push("/search");
  }

  return (
    <div class="dark-background">
      <div>
        <img src={(avatarUrl)} className="avatar avatar-16 avatar-small rounded-circle" />
        <button class="float-right btn btn-success back-button" onClick={handleBack}>Back</button>
      </div>
      <ul>

        {repos.map(repo => (
          <div className="card col-md card-md">

            <div className="card-body">
              <div class="inline-block"><h5 className="card-title">{repo.name}</h5>
                <p class="card-text">{repo.description}</p>
                <h5 class="card-title">{repo.watchers_count}</h5></div>
              <span onClick={() => starRepo(repo.name, starredRepos.includes(repo.name))} class={`float-right ${starredRepos.includes(repo.name) ? "starred" : "unstarred"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                </svg></span>
            </div>

          </div>))}
      </ul>

    </div>
  );

}

export default SearchResult



