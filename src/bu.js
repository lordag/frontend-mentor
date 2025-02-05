import './App.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToken, clearToken } from './store/token-slice';
import { fetchRepositories } from './store/repos-slice';
import gitIcon from './assets/github.svg';

function App() {
  const dispatch = useDispatch();

  const { token, loading: tokenLoading, error: tokenError } = useSelector(
    (state) => state.token
  );
  const { repositories, loading: repoLoading, error: repoError } = useSelector(
    (state) => state.repositories
  );

  useEffect(() => {
    dispatch(fetchToken()); // Ottiene il token al caricamento
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchRepositories(token)); // Ottiene i repository quando il token è disponibile
    }
  }, [token, dispatch]);

  useEffect(() => {
    console.log('repositories:', repositories);
  }, [repositories]);

  const handleLogout = () => {
    dispatch(clearToken()); // Rimuove il token dallo stato Redux
  };

  const handleClick = () => {
    window.open(url, "_blank"); // "_blank" apre il link in una nuova scheda
  };

  return (
    <>
      <header className='header'>
        <h1>lordag-exp</h1>
        {/* <div className='header_buttons'>
          <button onClick={handleLogout}>Logout</button>
        </div>         */}
      </header>
      <main>
        {token && (
          <>            
            {repoLoading && <p>Caricamento repository...</p>}
            {repoError && <p>Errore Repository: {repoError}</p>}
            {repositories.length > 0 && (
              <ul className='list'>
                {repositories.map((repo) => (
                  <li className='list__item' key={repo.id} onClick={handleClick}>
                    <img src={`https://raw.githubusercontent.com/lordag/${repo.name}/master/${repo.preview}`}/>
                    <h2>{repo.title}</h2>
                    <p>{repo.description}</p>
                    {/* <a href={repo.live}>{repo.name}</a> */}
                    <div className='list__info'>
                      <div className='list__info__tags'>
                        {repo.tag.map((tag) => <span className='list__tags__tag' key={`tag-${tag}-${repo.id}`}>{tag}</span>)}
                      </div>
                      <div className='list__info__links'>
                        <a href={repo.html_url}>
                          <img className='icon' src={gitIcon} />
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default App;
