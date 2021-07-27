import React from 'react';
import {Route} from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

function App() {
    const [items, setItems] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [favorites, setFavorites] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [cartOpened, setCartOpened] = React.useState(false);

    React.useEffect(() => {
        // fetch('https://60fd97bc1fa9e90017c70f0b.mockapi.io/items')
        //     .then((res) => {
        //         return res.json();
        //     })
        //     .then((json) => {
        //         setItems(json);
        //     }); нативный фетч пример

        axios.get('https://60fd97bc1fa9e90017c70f0b.mockapi.io/items').then((res) => {
            setItems(res.data);
        });
        axios.get('https://60fd97bc1fa9e90017c70f0b.mockapi.io/cart').then((res) => {
            setCartItems(res.data);
        });
        axios.get('https://60fd97bc1fa9e90017c70f0b.mockapi.io/favorites').then((res) => {
            setFavorites(res.data);
        });
    }, []);

    const onAddToCart = (obj) => {
        console.log(obj);

        if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
            axios.delete(`https://60fd97bc1fa9e90017c70f0b.mockapi.io/cart/${obj.id}`);
            setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
        } else {
            axios.post('https://60fd97bc1fa9e90017c70f0b.mockapi.io/cart', obj);
            setCartItems((prev) => [...prev, obj]);
        }
    };

    const onRemoveItem = (id) => {
        axios.delete(`https://60fd97bc1fa9e90017c70f0b.mockapi.io/cart/${id}`);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find(favObj => favObj.id === obj.id)) {
                axios.delete(`https://60fd97bc1fa9e90017c70f0b.mockapi.io/favorites/${obj.id}`);
                //setFavorites((prev) => prev.filter((item) => item.id !== obj.id)); удадять сразу из фаворитов, но это не удобно
            } else {
                const {data} = await axios.post('https://60fd97bc1fa9e90017c70f0b.mockapi.io/favorites', obj);
                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert('Не удалось добавить в фавориты((');
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    return (
        <div className="wrapper clear">
            {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem}/>}
            <Header onClickCart={() => setCartOpened(true)}/>

            <Route path="/" exact>
                <Home
                    items={items}
                    cartItems={cartItems}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    onChangeSearchInput={onChangeSearchInput}
                    onAddToFavorite={onAddToFavorite}
                    onAddToCart={onAddToCart}
                />
            </Route>

            <Route path="/favorites" exact>
                <Favorites items={favorites} onAddToFavorite={onAddToFavorite}/>
            </Route>
        </div>
    );
}

export default App;
