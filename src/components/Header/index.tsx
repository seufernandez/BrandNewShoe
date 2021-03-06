import React from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBasket } from 'react-icons/md';

import logo from '../../assets/images/logo.svg';
import { Container, Cart } from './styles';
import { useCart } from '../../hooks/useCart';

const Header = (): JSX.Element => {
	const { cart } = useCart();
	const cartSize = cart.length //Getting different products types amount

	return (
		<Container>
			<Link to="/">
				<img src={logo} alt="BrandNewShoe" />
			</Link>

			<Cart to="/cart">
				<div>
					<strong>Cart</strong>
					<span data-testid="cart-size">
						{cartSize === 1 ? `${cartSize} item` : `${cartSize} items`}
					</span>
				</div>
				<MdShoppingBasket size={36} color="#FFF" />
			</Cart>
		</Container>
	);
};

export default Header;
