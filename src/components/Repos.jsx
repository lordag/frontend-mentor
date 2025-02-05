import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepositories } from '../store/repos-slice';
import ListItems, { Items } from './ListItems';

const Repos = ({token}) => {

    const dispatch = useDispatch();
    const { repositories, loading: repoLoading, error: repoError } = useSelector(
        (state) => state.repositories
    );

    useEffect( () => {
        if (token) {
          dispatch(fetchRepositories(token)); // Return repository list when token is available
        }
    }, [token, dispatch]);

    return (
        <main>
            {repoLoading && 
                <div className='loading'>
                    <div><em>Loading...</em></div> 
                    <div className="spinner"></div>
                </div>
            }
            {repoError && <p>Errore Repository: {repoError}</p>}
            <ListItems list={repositories} >
                {repositories.map((item) => <Items key={item.id} item={item} />)}
            </ListItems>
        </main>
    )
}

export default Repos;