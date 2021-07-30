import React from 'react';
import axios from 'axios';

import Info from './Info';
import AppContext from '../context';

function Drawer({ onClose, onRemove, items = []}) {
    const { setCartItems } = React.useContext(AppContext);
    const [isOrderComplete, setIsOrderComplete] = React.useState(false);

    const onClickOrder = () => {
        setIsOrderComplete(true);
        setCartItems([]);
    };

    return (
        <div className="overlay">
            <div className="drawer">
                <h2 className="d-flex justify-between mb-30">
                    Корзина <img onClick={onClose} className="cu-p" src="/img/btn-remove.svg" alt="Close"/>
                </h2>

                {items.length > 0 ? (
                    <div className="d-flex flex-column flex">
                        <div className="items">
                            {items.map((obj) => (
                                <div key={obj.id} className="cartItem d-flex align-center mb-20">
                                    <div
                                        style={{backgroundImage: `url(${obj.imageUrl})`}}
                                        className="cartItemImg"></div>

                                    <div className="mr-20 flex">
                                        <p className="mb-5">{obj.title}</p>
                                        <b>{obj.price} руб.</b>
                                    </div>
                                    <img
                                        onClick={() => onRemove(obj.id)}
                                        className="removeBtn"
                                        src="/img/btn-remove.svg"
                                        alt="Remove"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="cartTotalBlock">
                            <ul>
                                <li>
                                    <span>Итого:</span>
                                    <div></div>
                                    <b>21 498 руб. </b>
                                </li>
                                <li>
                                    <span>Налог 5%:</span>
                                    <div></div>
                                    <b>1074 руб. </b>
                                </li>
                            </ul>
                            <button onClick={onClickOrder} className="greenButton">
                                Оформить заказ <img src="/img/arrow.svg" alt="Arrow"/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <Info
                        title={isOrderComplete ? "Заказ офрмлен!" : "Корзина пуста"}
                        descripter={isOrderComplete ? "Ваш заказ #42 скоро будет передан курьеру" : "Добавьте хоть что-то"}
                        image={isOrderComplete ? "./img/complete-order.jpg" : "/img/empty-cart.jpg"}
                    />
                )}
            </div>
        </div>
    );
}

export default Drawer;
