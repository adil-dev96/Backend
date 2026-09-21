import React from 'react'
import { useNavigate } from 'react-router'
import { Search, UserRound, ShoppingBag } from 'lucide-react'
import { useSelector } from "react-redux";

const Nav = () => {
    const navigate = useNavigate()

    // Get cart items from Redux store
    const cartItems = useSelector((state) => state.cart.items);

    // Calculate total quantity
    const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 50,
                backgroundColor: 'rgba(22,19,11,0.82)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(77,70,53,0.4)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: 1440,
                    margin: '0 auto',
                    padding: '0 64px',
                    height: 80
                }}
            >
                {/* Logo */}
                <a href="/" style={{ textDecoration: 'none' }}>
                    <span
                        style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 24,
                            fontWeight: 700,
                            color: '#f2ca50',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase'
                        }}
                    >
                        SNITCH
                    </span>
                </a>

                {/* Nav Links */}
                <nav style={{ display: 'flex', gap: 40 }}>
                    {['SHOP', 'COLLECTIONS', 'ABOUT'].map(link => (
                        <a
                            key={link}
                            href="#"
                            style={{
                                color: '#d0c5af',
                                fontSize: 12,
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                transition: 'color 200ms'
                            }}
                            onMouseEnter={e => (
                                e.target.style.color = '#f2ca50'
                            )}
                            onMouseLeave={e => (
                                e.target.style.color = '#d0c5af'
                            )}
                        >
                            {link}
                        </a>
                    ))}
                </nav>

                {/* Action Icons */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 24
                    }}
                >
                    <button
                        aria-label="Search"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#d0c5af',
                            cursor: 'pointer',
                            fontSize: 20
                        }}
                    >
                        <Search
                            size={20}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </button>

                    <button
                        aria-label="Account"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#d0c5af',
                            cursor: 'pointer'
                        }}
                    >
                        <UserRound
                            size={20}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </button>

                    <a
                        aria-label="Shopping Bag"
                        href="#"
                        style={{
                            position: 'relative',
                            color: '#f2ca50',
                            textDecoration: 'none',
                            borderBottom: '1px solid #f2ca50',
                            paddingBottom: 4
                        }}
                    >
                        <ShoppingBag
                            size={22}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        {totalQuantity > 0 && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: -6,
                                    right: -8,
                                    background: '#d4af37',
                                    color: '#110e07',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    width: 16,
                                    height: 16,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'Inter, sans-serif'
                                }}
                            >
                                {totalQuantity}
                            </span>
                        )}
                    </a>
                </div>
            </div>
        </header>
    )
}

export default Nav