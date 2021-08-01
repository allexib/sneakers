import React from 'react';
import {Route} from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import AppContext from './context';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';


function App() {
    const [items, setItems] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [favorites, setFavorites] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [cartOpened, setCartOpened] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // fetch('https://60fd97bc1fa9e90017c70f0b.mockapi.io/items')
        //     .then((res) => {
        //         return res.json();
        //     })
        //     .then((json) => {
        //         setItems(json);
        //     }); нативный фетч пример
        async function fetchData() {
            //setIsLoading(true); ставить если ф-я вып > 1 раза, если 1 раз то не ставить.
            const cartResponse = await axios.get('https://60fd97bc1fa9e90017c70f0b.mockapi.io/cart');
            const favoritesResponse = await axios.get('https://60fd97bc1fa9e90017c70f0b.mockapi.io/favorites');
            const itemsResponse = await axios.get('https://60fd97bc1fa9e90017c70f0b.mockapi.io/items');

            setIsLoading(false);

            setCartItems(cartResponse.data);
            setFavorites(favoritesResponse.data);
            setItems(itemsResponse.data);
        }

        fetchData();
    }, []);

    const onAddToCart = (obj) => {
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
            if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
                axios.delete(`https://60fd97bc1fa9e90017c70f0b.mockapi.io/favorites/${obj.id}`);
                setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
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

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.id) === Number(id));
    }

    return (
        <AppContext.Provider value={{items, cartItems, favorites, isItemAdded, onAddToFavorite,
            onAddToCart, setCartOpened, setCartItems }}>

            <div className="wrapper clear">
                {cartOpened &&  (
                    <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem}/>
                )}

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
                        isLoading = {isLoading}
                    />
                </Route>

                <Route path="/favorites" exact>
                    <Favorites />
                </Route>
                <Route path="/orders" exact>
                    <Orders />
                </Route>
            </div>
        </AppContext.Provider>
    );
}

export default App;
