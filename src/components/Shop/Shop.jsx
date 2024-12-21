import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [perpagedata, setPerpagedata] = useState(10)

    useEffect(() => {
        fetch('http://localhost:5000/totalProducts')
            .then(res => res.json())
            .then(data => {
                setTotalCount(data.result)
            })
    }, [])
    console.log(totalCount);

    // const totaldata = totalCount;


    const countpage = Math.ceil(totalCount / perpagedata);
    // const pages =[];
    // for (let i = 0; i <= countpage; i++) {
    //     pages.push(i+1)
    // }
    // console.log(pages);

    const pages = [...Array(countpage).keys()];
    console.log(pages);


    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, []);



    useEffect(() => {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // step 1: get id of the addedProduct
        for (const id in storedCart) {
            // step 2: get product from products state by using id
            const addedProduct = products.find(product => product._id === id)
            if (addedProduct) {
                // step 3: add quantity
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                // step 4: add the added product to the saved cart
                savedCart.push(addedProduct);
            }
        }
        // step 5: set the cart
        setCart(savedCart);
    }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>

            {
                pages.map(page => <button key={page}>{page}</button>)
            }

            <select onChange={(e)=> setPerpagedata(e.target.value)} value={perpagedata} id="select">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
            </div>
        </div>
    );
};

export default Shop;