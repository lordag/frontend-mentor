import gitIcon from '../assets/github.svg';

const ListItems = ({children}) => {
    return(
        <ul className='list'>
            {children}
        </ul>
    )
}

export const Items = ({item}) => {
    const handleClick = (url) => {
        window.open(url, "_blank"); 
    };

    return(
        <li className='list__item' onClick={() => handleClick(item.live)}>
            <img src={`https://raw.githubusercontent.com/lordag/${item.name}/master/${item.preview}`}/>
            <h2>{item.title}</h2>
            <p>{item.description}</p>            
            <div className='list__info'>
            <div className='list__info__tags'>
                {item.tag.map((tag) => <span className='list__tags__tag' key={`tag-${tag}-${item.id}`}>{tag}</span>)}
            </div>
            <div className='list__info__links'>
                <a href={item.html_url}>
                <img className='icon' src={gitIcon} />
                </a>
            </div>
            </div>
        </li>
    )
}



export default ListItems;