import './App.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToken} from './store/token-slice';
import Repos from './components/Repos';

function App() {

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.token);

  useEffect(() => {
    dispatch(fetchToken()); // Ottiene il token al caricamento
  }, [dispatch]);

  return (
    <>
      <header className='header'>
        <h1>lordag-exp</h1>
      </header>
      {token  && <Repos token={token} /> }
    </>
  );
}

export default App;
