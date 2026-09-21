import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Search, UserRound, ShoppingBag, Menu, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useCart } from '../../cart/hook/useCart'

const Nav = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { handleGetCart } = useCart()
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        handleGetCart()
    }, [])

    useEffect(() => {
        setMenuOpen(false)
    }, [location.pathname])

    const isCartPage = location.pathname === '/cart'

    const cartItems = useSelector((state) => state.cart.items ?? [])
    const user = useSelector((state) => state.auth.user)

    const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    )

    const navLinks = ['SHOP', 'COLLECTIONS', 'ABOUT']

    const goTo = (path) => {
        navigate(path)
        setMenuOpen(false)
    }

    return (
        <>
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 50,
                    backgroundColor: 'rgba(22,19,11,0.92)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(77,70,53,0.4)',
                }}
            >
                <div className="nav-container">
                    {/* Logo */}
                    <button
                        type="button"
                        onClick={() => goTo('/')}
                        className="nav-logo"
                    >
                        SNITCH
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        {navLinks.map((link) => (
                            <button
                                type="button"
                                key={link}
                                onClick={() => link === 'SHOP' && goTo('/')}
                                className="nav-link"
                            >
                                {link}
                            </button>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="desktop-actions">
                        <button
                            type="button"
                            aria-label="Search"
                            className="icon-button"
                        >
                            <Search size={20} strokeWidth={1.8} />
                        </button>

                        <button
                            type="button"
                            aria-label="Profile"
                            className="profile-button"
                            onClick={() => goTo('/profile')}
                        >
                            <UserRound size={20} strokeWidth={1.8} />

                            {user && (
                                <span className="user-name">
                                    {user.fullname}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            aria-label="Shopping Bag"
                            className={`cart-button ${isCartPage ? 'active' : ''}`}
                            onClick={() => goTo('/cart')}
                        >
                            <ShoppingBag size={22} strokeWidth={1.8} />

                            {totalQuantity > 0 && (
                                <span className="cart-badge">
                                    {totalQuantity}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Actions */}
                    <div className="mobile-actions">
                        <button
                            type="button"
                            aria-label="Shopping Bag"
                            className={`cart-button ${isCartPage ? 'active' : ''}`}
                            onClick={() => goTo('/cart')}
                        >
                            <ShoppingBag size={22} strokeWidth={1.8} />

                            {totalQuantity > 0 && (
                                <span className="cart-badge">
                                    {totalQuantity}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            className="icon-button"
                            onClick={() => setMenuOpen((previous) => !previous)}
                        >
                            {menuOpen ? (
                                <X size={24} strokeWidth={1.8} />
                            ) : (
                                <Menu size={24} strokeWidth={1.8} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="mobile-menu">
                        <nav className="mobile-nav-links">
                            {navLinks.map((link) => (
                                <button
                                    type="button"
                                    key={link}
                                    onClick={() => link === 'SHOP' && goTo('/')}
                                    className="mobile-nav-link"
                                >
                                    {link}
                                </button>
                            ))}
                        </nav>

                        <div className="mobile-menu-actions">
                            <button
                                type="button"
                                className="mobile-profile-button"
                                onClick={() => goTo('/profile')}
                            >
                                <UserRound size={19} strokeWidth={1.8} />
                                <span>
                                    {user ? user.fullname : 'PROFILE'}
                                </span>
                            </button>

                            <button
                                type="button"
                                className="mobile-profile-button"
                                onClick={() => goTo('/cart')}
                            >
                                <ShoppingBag size={19} strokeWidth={1.8} />
                                <span>
                                    BAG {totalQuantity > 0 ? `(${totalQuantity})` : ''}
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <style>{`
                .nav-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    max-width: 1440px;
                    height: 80px;
                    margin: 0 auto;
                    padding: 0 64px;
                    position: relative;
                }

                .nav-logo {
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: #f2ca50;
                    font-family: 'Playfair Display', serif;
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                }

                .desktop-nav {
                    display: flex;
                    align-items: center;
                    gap: 40px;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .nav-link {
                    background: none;
                    border: none;
                    padding: 8px 0;
                    color: #d0c5af;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    transition: color 200ms;
                }

                .nav-link:hover,
                .mobile-nav-link:hover {
                    color: #f2ca50;
                }

                .desktop-actions {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }

                .icon-button,
                .profile-button,
                .cart-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    border: none;
                    color: #d0c5af;
                    cursor: pointer;
                }

                .icon-button {
                    padding: 4px;
                }

                .profile-button {
                    gap: 8px;
                    padding: 4px 0;
                }

                .user-name {
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }

                .cart-button {
                    position: relative;
                    padding: 4px 0;
                }

                .cart-button.active {
                    color: #f2ca50;
                    border-bottom: 1px solid #f2ca50;
                }

                .cart-badge {
                    position: absolute;
                    top: -7px;
                    right: -9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    background: #d4af37;
                    color: #110e07;
                    font-family: Inter, sans-serif;
                    font-size: 10px;
                    font-weight: 700;
                }

                .mobile-actions,
                .mobile-menu {
                    display: none;
                }

                @media (max-width: 767px) {
                    .nav-container {
                        height: 68px;
                        padding: 0 16px;
                    }

                    .nav-logo {
                        font-size: 21px;
                    }

                    .desktop-nav,
                    .desktop-actions {
                        display: none;
                    }

                    .mobile-actions {
                        display: flex;
                        align-items: center;
                        gap: 18px;
                    }

                    .mobile-menu {
                        display: block;
                        padding: 20px 16px 24px;
                        border-top: 1px solid rgba(77,70,53,0.4);
                        background: rgba(22,19,11,0.98);
                    }

                    .mobile-nav-links {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }

                    .mobile-nav-link {
                        width: 100%;
                        padding: 14px 0;
                        text-align: left;
                        background: none;
                        border: none;
                        border-bottom: 1px solid rgba(77,70,53,0.25);
                        color: #d0c5af;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                    }

                    .mobile-menu-actions {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        margin-top: 18px;
                    }

                    .mobile-profile-button {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px 0;
                        background: none;
                        border: none;
                        color: #d0c5af;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: 0.08em;
                        text-align: left;
                    }
                }

                @media (min-width: 768px) and (max-width: 1100px) {
                    .nav-container {
                        padding: 0 28px;
                    }

                    .desktop-nav {
                        gap: 20px;
                    }

                    .desktop-actions {
                        gap: 14px;
                    }

                    .user-name {
                        max-width: 80px;
                    }
                }
            `}</style>
        </>
    )
}

export default Nav
