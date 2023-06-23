import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [userAvatar, setUserAvatar] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [repositories, setRepositories] = useState([]);

  const getUserData = async () => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      setUserData(response.data);
      setUserAvatar(response.data.avatar_url);
      setNotFound(false);
      getFollowers();
      getRepositories();
    } catch (error) {
      console.error('Erro:', error);
      setNotFound(true);
      setUserData(null);
      setUserAvatar('');
      setFollowers([]);
      setRepositories([]);
    }
  };

  const getFollowers = async () => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/followers`);
      setFollowers(response.data);
    } catch (error) {
      console.error('Erro ao buscar os seguidores:', error);
      setFollowers([]);
    }
  };

  const getRepositories = async () => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/repos`);
      setRepositories(response.data);
    } catch (error) {
      console.error('Erro ao buscar os repositórios:', error);
      setRepositories([]);
    }
  };

  const getInputChange = (event) => {
    setUsername(event.target.value);
  };

  const getSubmit = (event) => {
    event.preventDefault();
    getUserData();
  };

  return (
    <div className="container">
      <div className="top-section">
        <div className="search-box">
          <form onSubmit={getSubmit} className="search-form">
            <div className="input-container">
              <input
                type="text"
                value={username}
                onChange={getInputChange}
                placeholder="Nome do Github"
                className="input-field"
              />
              <button type="submit">Procurar</button>
            </div>
          </form>
        </div>
      </div>

      <div className="content-section">
        <div className="left-section">
          {notFound && <p>Usuário não encontrado.</p>}

          {userData && (
            <div className="profile">
              <img src={userAvatar} alt="User Avatar" className="avatar" />
              <div className="user-info">
                <h2>{userData.name}</h2>
                <p>Nome: {userData.login}</p>
                <p>Seguidores: {userData.followers}</p>
                <p>Repositórios Públicos: {userData.public_repos}</p>
              </div>
            </div>
          )}
        </div>

        <div className="middle-section">
          <h2>Repositórios</h2>
          {repositories.map((repo) => (
            <div key={repo.id} className="repository">
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
              <p>Linguagem: {repo.language}</p>
            </div>
          ))}
        </div>

        <div className="right-section">
          <h2>Seguidores</h2>
          {followers.map((follower) => (
            <div key={follower.id} className="follower">
              <img
                src={follower.avatar_url}
                alt="Follower Avatar"
                className="follower-avatar"
              />
              <p className="follower-name">{follower.login}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
