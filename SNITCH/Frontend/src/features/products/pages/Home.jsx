import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { useProduct } from '../hooks/useProduct'
import { useNavigate } from 'react-router'

/* ─── Currency Formatter ─── */
const formatPrice = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency || 'INR',
        maximumFractionDigits: 0
    }).format(amount)
}

/* ─── Brand Logo ─── */
function SnitchLogo({ size = 32 }) {
    const h = size
    const w = Math.round(h * 4.2)
    return (
        <svg width={w} height={h} viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SNITCH">
            <defs>
                <linearGradient id="goldGradHome" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f7d56e" />
                    <stop offset="45%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#9c7a1a" />
                </linearGradient>
            </defs>
            <text x="0" y="82" fontFamily="'Playfair Display', Georgia, serif" fontSize="90" fontWeight="700" letterSpacing="8" fill="url(#goldGradHome)">
                SNITCH
            </text>
        </svg>
    )
}

/* ─── Product Card ─── */
function ProductCard({ product, onQuickView }) {
    const [activeImg, setActiveImg] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [added, setAdded] = useState(false)
    const navigate = useNavigate();

    const images = product.images || []
    const hasMultiple = images.length > 1

    // Hover auto-cycle through product photos
    useEffect(() => {
        if (!isHovered || !hasMultiple) return
        const interval = setInterval(() => {
            setActiveImg(prev => (prev + 1) % images.length)
        }, 1100)
        return () => clearInterval(interval)
    }, [isHovered, hasMultiple, images.length])

    const handleAddToBag = (e) => {
        e.stopPropagation()
        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
    }

    return (
        <div
            onClick={() => navigate(`/product/${product._id}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false)
                setActiveImg(0)
            }}
            style={{
                background: '#111111',
                border: `1px solid ${isHovered ? '#d4af3755' : '#221e1a'}`,
                borderRadius: '3px',
                overflow: 'hidden',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: isHovered
                    ? '0 24px 48px rgba(0,0,0,0.7), 0 0 1px 1px rgba(212,175,55,0.25)'
                    : '0 4px 18px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative'
            }}
        >
            {/* Image Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '125%',
                overflow: 'hidden',
                background: '#090909'
            }}>
                {images.length > 0 ? (
                    <img
                        src={images[activeImg]?.url}
                        alt={product.title}
                        loading="lazy"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                            transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                        }}
                    />
                ) : (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#443f38'
                    }}>
                        <span style={{ fontSize: '42px' }}>✨</span>
                    </div>
                )}

                {/* Subtle Luxury Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.05) 50%, transparent 100%)',
                    opacity: isHovered ? 0.9 : 0.4,
                    transition: 'opacity 0.3s',
                    pointerEvents: 'none'
                }} />

                {/* Top Badges */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '6px'
                }}>
                    <span style={{
                        background: 'rgba(212, 175, 55, 0.9)',
                        color: '#000',
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '2px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                    }}>
                        EXCLUSIVE
                    </span>
                </div>

                {/* Multi-image indicator badge */}
                {hasMultiple && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(13,13,13,0.78)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(212,175,55,0.3)',
                        borderRadius: '2px',
                        padding: '3px 8px',
                        fontSize: '9px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        color: '#d4af37'
                    }}>
                        {activeImg + 1} / {images.length}
                    </div>
                )}

                {/* Dots indicator on hover */}
                {hasMultiple && isHovered && (
                    <div style={{
                        position: 'absolute',
                        bottom: '52px',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '5px',
                        zIndex: 2
                    }}>
                        {images.map((_, idx) => (
                            <span
                                key={idx}
                                style={{
                                    height: '4px',
                                    width: idx === activeImg ? '16px' : '5px',
                                    borderRadius: '2px',
                                    background: idx === activeImg ? '#d4af37' : 'rgba(255,255,255,0.4)',
                                    transition: 'all 0.25s'
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Quick action bar */}
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 3,
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <button
                        onClick={handleAddToBag}
                        type="button"
                        style={{
                            flex: 1,
                            background: added ? '#2ecc71' : '#d4af37',
                            color: added ? '#fff' : '#000',
                            border: 'none',
                            borderRadius: '2px',
                            padding: '10px 0',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'background 0.2s',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
                        }}
                    >
                        {added ? '✓ IN BAG' : '+ ADD TO BAG'}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onQuickView(product)
                        }}
                        type="button"
                        style={{
                            background: 'rgba(13,13,13,0.85)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(212,175,55,0.4)',
                            color: '#eae1d4',
                            borderRadius: '2px',
                            padding: '0 14px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'border-color 0.2s, color 0.2s'
                        }}
                        title="Quick View"
                    >
                        👁️
                    </button>
                </div>
            </div>

            {/* Product Meta */}
            <div style={{
                padding: '18px 18px 20px',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'space-between',
                background: '#111111'
            }}>
                <div>
                    <div style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#8f8576',
                        marginBottom: '6px'
                    }}>
                        SNITCH ATELIER
                    </div>
                    <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '17px',
                        fontWeight: 600,
                        color: '#eae1d4',
                        marginBottom: '8px',
                        letterSpacing: '0.01em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {product.title}
                    </h3>

                    <p style={{
                        fontSize: '12px',
                        color: '#70685c',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '36px',
                        marginBottom: '14px'
                    }}>
                        {product.description || 'Premium bespoke craftsmanship crafted for the modern luxury connoisseur.'}
                    </p>
                </div>

                {/* Price and Details footer */}
                <div>
                    <div style={{
                        height: '1px',
                        background: 'linear-gradient(to right, rgba(212,175,55,0.25), transparent)',
                        marginBottom: '14px'
                    }} />

                    <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <span style={{
                                fontSize: '9px',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: '#70685c',
                                display: 'block',
                                marginBottom: '2px'
                            }}>
                                PRICE
                            </span>
                            <span style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#d4af37'
                            }}>
                                {formatPrice(product.price?.amount, product.price?.currency)}
                            </span>
                        </div>

                        <span style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#9c9281',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            VIEW ITEM →
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ─── Quick View Modal ─── */
function QuickViewModal({ product, onClose }) {
    const [selectedImg, setSelectedImg] = useState(0)
    const [selectedSize, setSelectedSize] = useState('M')
    const [added, setAdded] = useState(false)

    if (!product) return null

    const images = product.images || []
    const sizes = ['S', 'M', 'L', 'XL']

    const handleAdd = () => {
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                background: 'rgba(5, 5, 5, 0.85)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#121212',
                    border: '1px solid rgba(212,175,55,0.35)',
                    borderRadius: '4px',
                    width: '100%',
                    maxWidth: '920px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    boxShadow: '0 30px 90px rgba(0,0,0,0.9), 0 0 2px 1px rgba(212,175,55,0.3)',
                    animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <style>{`
                    @keyframes modalSlideIn {
                        from { opacity: 0; transform: translateY(16px) scale(0.98); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                `}</style>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    type="button"
                    style={{
                        position: 'absolute',
                        top: '18px',
                        right: '18px',
                        background: '#1c1b18',
                        border: '1px solid #332d24',
                        color: '#eae1d4',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'border-color 0.2s, background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#d4af37'
                        e.currentTarget.style.background = '#28251e'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#332d24'
                        e.currentTarget.style.background = '#1c1b18'
                    }}
                >
                    ✕
                </button>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '36px',
                    padding: '36px'
                }}>
                    {/* Left: Gallery */}
                    <div>
                        <div style={{
                            width: '100%',
                            paddingBottom: '115%',
                            position: 'relative',
                            background: '#090909',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            border: '1px solid #26211c'
                        }}>
                            {images.length > 0 ? (
                                <img
                                    src={images[selectedImg]?.url}
                                    alt={product.title}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '48px',
                                    opacity: 0.3
                                }}>
                                    ✨
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                marginTop: '14px',
                                overflowX: 'auto',
                                paddingBottom: '6px'
                            }}>
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImg(i)}
                                        type="button"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            flexShrink: 0,
                                            padding: 0,
                                            background: '#090909',
                                            borderRadius: '2px',
                                            overflow: 'hidden',
                                            border: `2px solid ${i === selectedImg ? '#d4af37' : '#221e1a'}`,
                                            cursor: 'pointer',
                                            transition: 'border-color 0.2s'
                                        }}
                                    >
                                        <img
                                            src={img.url}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Details & Purchase */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: '#d4af37',
                                marginBottom: '8px'
                            }}>
                                SNITCH EXCLUSIVE
                            </div>

                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#eae1d4',
                                lineHeight: 1.2,
                                marginBottom: '14px'
                            }}>
                                {product.title}
                            </h2>

                            <div style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '26px',
                                fontWeight: 700,
                                color: '#d4af37',
                                marginBottom: '20px'
                            }}>
                                {formatPrice(product.price?.amount, product.price?.currency)}
                                <span style={{
                                    fontSize: '11px',
                                    fontFamily: "'Inter', sans-serif",
                                    color: '#70685c',
                                    marginLeft: '10px',
                                    fontWeight: 400
                                }}>
                                    (Inclusive of all luxury duties & taxes)
                                </span>
                            </div>

                            <div style={{
                                height: '1px',
                                background: '#26221c',
                                marginBottom: '20px'
                            }} />

                            <div style={{ marginBottom: '22px' }}>
                                <div style={{
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: '#9c9281',
                                    marginBottom: '8px'
                                }}>
                                    DESCRIPTION
                                </div>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#b0a696',
                                    lineHeight: 1.7
                                }}>
                                    {product.description || 'Crafted meticulously using superior weave techniques. An essential signature piece embodying the contemporary SNITCH aesthetic.'}
                                </p>
                            </div>

                            {/* Size Selector */}
                            <div style={{ marginBottom: '28px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: '#9c9281'
                                    }}>
                                        SELECT SIZE
                                    </span>
                                    <span style={{
                                        fontSize: '10px',
                                        color: '#d4af37',
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                    }}>
                                        Size Chart
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {sizes.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            type="button"
                                            style={{
                                                flex: 1,
                                                padding: '10px 0',
                                                background: selectedSize === s ? '#d4af37' : '#181714',
                                                color: selectedSize === s ? '#000' : '#eae1d4',
                                                border: `1px solid ${selectedSize === s ? '#d4af37' : '#332d24'}`,
                                                borderRadius: '2px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                <button
                                    onClick={handleAdd}
                                    type="button"
                                    style={{
                                        flex: 1,
                                        background: added ? '#2ecc71' : '#d4af37',
                                        color: added ? '#fff' : '#000',
                                        border: 'none',
                                        borderRadius: '2px',
                                        padding: '16px 0',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    {added ? '✓ ADDED TO SHOPPING BAG' : 'ADD TO BAG'}
                                </button>
                            </div>

                            {/* Trust badges */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '10px',
                                borderTop: '1px solid #26221c',
                                paddingTop: '18px',
                                textAlign: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: '15px', marginBottom: '4px' }}>🛡️</div>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', color: '#9c9281', textTransform: 'uppercase' }}>
                                        100% Authentic
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '15px', marginBottom: '4px' }}>⚡</div>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', color: '#9c9281', textTransform: 'uppercase' }}>
                                        Express Delivery
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '15px', marginBottom: '4px' }}>↺</div>
                                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', color: '#9c9281', textTransform: 'uppercase' }}>
                                        7-Day Returns
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ─── Skeleton Loading Grid ─── */
function SkeletonGrid() {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px'
        }}>
            <style>{`
                @keyframes homePulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.35; }
                }
            `}</style>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    style={{
                        background: '#111',
                        border: '1px solid #1f1b17',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        paddingBottom: '125%',
                        background: '#161412',
                        animation: 'homePulse 1.6s ease-in-out infinite'
                    }} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ height: '10px', background: '#1c1916', borderRadius: '2px', width: '40%', animation: 'homePulse 1.6s infinite' }} />
                        <div style={{ height: '18px', background: '#1c1916', borderRadius: '2px', width: '75%', animation: 'homePulse 1.6s infinite' }} />
                        <div style={{ height: '12px', background: '#1c1916', borderRadius: '2px', width: '90%', animation: 'homePulse 1.6s infinite' }} />
                        <div style={{ height: '22px', background: '#1c1916', borderRadius: '2px', width: '50%', marginTop: '6px', animation: 'homePulse 1.6s infinite' }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

/* ─── MAIN HOME COMPONENT ─── */
const Home = () => {
    const products = useSelector(state => state.product.products) || []
    const user = useSelector(state => state.auth.user)
    const { handleGetAllProducts } = useProduct()

    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('ALL')
    const [sortBy, setSortBy] = useState('FEATURED')
    const [quickViewProduct, setQuickViewProduct] = useState(null)

    useEffect(() => {
        const fetchStoreProducts = async () => {
            setLoading(true)
            try {
                await handleGetAllProducts()
            } catch (err) {
                console.error("Failed to fetch products:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchStoreProducts()
    }, [])

    /* ─── Filter & Sort Logic ─── */
    const categories = ['ALL', 'LINEN', 'SHIRTS', 'PANTS', 'COLLECTIONS']

    const filteredProducts = useMemo(() => {
        return products
            .filter((p) => {
                const titleMatch = p.title?.toLowerCase().includes(searchQuery.toLowerCase())
                const descMatch = p.description?.toLowerCase().includes(searchQuery.toLowerCase())
                const matchesSearch = titleMatch || descMatch

                if (!matchesSearch) return false

                if (selectedCategory === 'ALL') return true
                if (selectedCategory === 'LINEN') {
                    return (
                        p.title?.toLowerCase().includes('linen') ||
                        p.description?.toLowerCase().includes('linen')
                    )
                }
                if (selectedCategory === 'SHIRTS') {
                    return (
                        p.title?.toLowerCase().includes('shirt') ||
                        p.description?.toLowerCase().includes('shirt')
                    )
                }
                if (selectedCategory === 'PANTS') {
                    return (
                        p.title?.toLowerCase().includes('pant') ||
                        p.description?.toLowerCase().includes('pant')
                    )
                }
                return true
            })
            .sort((a, b) => {
                if (sortBy === 'PRICE_LOW') return (a.price?.amount || 0) - (b.price?.amount || 0)
                if (sortBy === 'PRICE_HIGH') return (b.price?.amount || 0) - (a.price?.amount || 0)
                if (sortBy === 'OLDEST') return new Date(a.createdAt) - new Date(b.createdAt)
                return new Date(b.createdAt) - new Date(a.createdAt) // FEATURED / NEWEST
            })
    }, [products, searchQuery, selectedCategory, sortBy])

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0D0D0D',
            color: '#eae1d4',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Quick View Modal */}
            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                />
            )}

            {/* ── TOP ANNOUNCEMENT BAR ── */}
            <div style={{
                background: 'linear-gradient(90deg, #161410 0%, #1c1810 50%, #161410 100%)',
                borderBottom: '1px solid #2b251a',
                textAlign: 'center',
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#d4af37'
            }}>
                ⚜️ COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER ₹999 &nbsp;|&nbsp; 100% VERIFIED BESPOKE LUXURY
            </div>

            {/* ── LUXURY STICKY NAVBAR ── */}


            {/* ── HERO EDITORIAL BANNER ── */}
            <section
                id="editorial"
                style={{
                    position: 'relative',
                    padding: '90px 32px 80px',
                    borderBottom: '1px solid #1e1b17',
                    overflow: 'hidden',
                    background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.12), transparent 70%)'
                }}
            >
                <div style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(212,175,55,0.08)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        padding: '6px 16px',
                        borderRadius: '2px',
                        marginBottom: '24px'
                    }}>
                        <span style={{ color: '#d4af37', fontSize: '10px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
                            COLLECTION 2026 / NEW ARRIVALS
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(36px, 5.5vw, 68px)',
                        fontWeight: 700,
                        color: '#eae1d4',
                        lineHeight: 1.12,
                        letterSpacing: '-0.01em',
                        marginBottom: '22px'
                    }}>
                        Sartorial Sophistication. <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #f7d56e 0%, #d4af37 60%, #9c7a1a 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Designed for the Elite.
                        </span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(14px, 1.8vw, 17px)',
                        color: '#8f8576',
                        maxWidth: '680px',
                        margin: '0 auto 36px',
                        lineHeight: 1.65,
                        letterSpacing: '0.02em'
                    }}>
                        Step into a realm of immaculate silhouettes, premium textiles, and effortless elegance.
                        Explore our newest drops crafted with uncompromising quality.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <a
                            href="#catalog"
                            style={{
                                background: '#d4af37',
                                color: '#000',
                                padding: '15px 36px',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                borderRadius: '2px',
                                transition: 'all 0.2s',
                                boxShadow: '0 8px 24px rgba(212,175,55,0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#e9c349'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#d4af37'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            Explore All Products
                        </a>

                        {user?.role === 'seller' && (
                            <Link
                                to="/seller/create-product"
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #3d3528',
                                    color: '#eae1d4',
                                    padding: '15px 32px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    borderRadius: '2px',
                                    transition: 'border-color 0.2s, color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#d4af37'
                                    e.currentTarget.style.color = '#d4af37'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#3d3528'
                                    e.currentTarget.style.color = '#eae1d4'
                                }}
                            >
                                + List New Product
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* ── STORE CATALOG SECTION ── */}
            <main id="catalog" style={{ maxWidth: '1360px', margin: '0 auto', padding: '56px 32px 90px' }}>

                {/* Section Title & Description */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '36px',
                    gap: '16px'
                }}>
                    <div>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: '#d4af37',
                            display: 'block',
                            marginBottom: '6px'
                        }}>
                            CURATED LUXURY
                        </span>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '32px',
                            fontWeight: 700,
                            color: '#eae1d4',
                            letterSpacing: '0.01em'
                        }}>
                            All Catalog Products
                        </h2>
                    </div>

                    <div style={{
                        fontSize: '12px',
                        color: '#8f8576',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                    }}>
                        Displaying <strong style={{ color: '#d4af37' }}>{filteredProducts.length}</strong> of {products.length} Items
                    </div>
                </div>

                {/* ── TOOLBAR: SEARCH, CATEGORIES & SORT ── */}
                <div style={{
                    background: '#121110',
                    border: '1px solid #231f1a',
                    borderRadius: '3px',
                    padding: '16px 20px',
                    marginBottom: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    {/* Row 1: Search & Sort */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '14px',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        {/* Search Input */}
                        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
                            <span style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#665d50',
                                fontSize: '14px',
                                pointerEvents: 'none'
                            }}>
                                🔍
                            </span>
                            <input
                                type="text"
                                placeholder="Search by title, garment, linen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    background: '#0d0d0d',
                                    border: '1px solid #2a251f',
                                    borderRadius: '2px',
                                    color: '#eae1d4',
                                    fontSize: '13px',
                                    padding: '12px 14px 12px 40px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                onBlur={(e) => e.target.style.borderColor = '#2a251f'}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    type="button"
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#8f8576',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', color: '#8f8576', textTransform: 'uppercase' }}>
                                Sort By:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    background: '#0d0d0d',
                                    border: '1px solid #2a251f',
                                    borderRadius: '2px',
                                    color: '#eae1d4',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    letterSpacing: '0.06em',
                                    padding: '11px 16px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                onBlur={(e) => e.target.style.borderColor = '#2a251f'}
                            >
                                <option value="FEATURED">Newest Arrivals</option>
                                <option value="PRICE_LOW">Price: Low to High</option>
                                <option value="PRICE_HIGH">Price: High to Low</option>
                                <option value="OLDEST">Earliest Additions</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Category Filter Chips */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        overflowX: 'auto',
                        paddingBottom: '2px'
                    }}>
                        <span style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: '#665d50',
                            marginRight: '6px'
                        }}>
                            Filter:
                        </span>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                type="button"
                                style={{
                                    background: selectedCategory === cat ? 'rgba(212,175,55,0.18)' : '#0d0d0d',
                                    color: selectedCategory === cat ? '#d4af37' : '#8f8576',
                                    border: `1px solid ${selectedCategory === cat ? '#d4af37' : '#231f1a'}`,
                                    padding: '6px 14px',
                                    borderRadius: '2px',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── PRODUCTS DISPLAY ── */}
                {loading ? (
                    <SkeletonGrid />
                ) : filteredProducts.length === 0 ? (
                    /* Empty State */
                    <div style={{
                        textAlign: 'center',
                        padding: '90px 20px',
                        background: '#11100f',
                        border: '1px solid #231f1a',
                        borderRadius: '3px'
                    }}>
                        <div style={{ fontSize: '56px', marginBottom: '20px', opacity: 0.4 }}>
                            🔍
                        </div>
                        <h3 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '24px',
                            fontWeight: 600,
                            color: '#eae1d4',
                            marginBottom: '10px'
                        }}>
                            No Products Found
                        </h3>
                        <p style={{
                            fontSize: '13px',
                            color: '#8f8576',
                            maxWidth: '420px',
                            margin: '0 auto 28px',
                            lineHeight: 1.6
                        }}>
                            {searchQuery || selectedCategory !== 'ALL'
                                ? "We couldn't find any products matching your active filters. Try adjusting your search query or reset filters."
                                : "There are currently no products available in the collection. Please check back shortly."}
                        </p>
                        {(searchQuery || selectedCategory !== 'ALL') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('ALL')
                                }}
                                type="button"
                                style={{
                                    background: '#d4af37',
                                    color: '#000',
                                    border: 'none',
                                    padding: '12px 28px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    borderRadius: '2px',
                                    cursor: 'pointer'
                                }}
                            >
                                Reset All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    /* Products Grid */
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '28px'
                    }}>
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onQuickView={(p) => setQuickViewProduct(p)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* ── BRAND HERITAGE / PERKS BANNER ── */}
            <section
                id="perks"
                style={{
                    background: '#11100e',
                    borderTop: '1px solid #1f1b16',
                    borderBottom: '1px solid #1f1b16',
                    padding: '60px 32px'
                }}
            >
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '36px'
                }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{
                            background: 'rgba(212,175,55,0.1)',
                            border: '1px solid rgba(212,175,55,0.25)',
                            color: '#d4af37',
                            width: '44px',
                            height: '44px',
                            borderRadius: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            flexShrink: 0
                        }}>
                            ⚜️
                        </div>
                        <div>
                            <h4 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '17px',
                                fontWeight: 600,
                                color: '#eae1d4',
                                marginBottom: '6px'
                            }}>
                                Bespoke Craftsmanship
                            </h4>
                            <p style={{ fontSize: '12px', color: '#8f8576', lineHeight: 1.6 }}>
                                Sourced from the finest mills, stitched with meticulous precision to withstand the tests of time.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{
                            background: 'rgba(212,175,55,0.1)',
                            border: '1px solid rgba(212,175,55,0.25)',
                            color: '#d4af37',
                            width: '44px',
                            height: '44px',
                            borderRadius: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            flexShrink: 0
                        }}>
                            ⚡
                        </div>
                        <div>
                            <h4 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '17px',
                                fontWeight: 600,
                                color: '#eae1d4',
                                marginBottom: '6px'
                            }}>
                                White Glove Dispatch
                            </h4>
                            <p style={{ fontSize: '12px', color: '#8f8576', lineHeight: 1.6 }}>
                                Express doorstep delivery enclosed in luxury signature tamper-evident packaging.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{
                            background: 'rgba(212,175,55,0.1)',
                            border: '1px solid rgba(212,175,55,0.25)',
                            color: '#d4af37',
                            width: '44px',
                            height: '44px',
                            borderRadius: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            flexShrink: 0
                        }}>
                            🛡️
                        </div>
                        <div>
                            <h4 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '17px',
                                fontWeight: 600,
                                color: '#eae1d4',
                                marginBottom: '6px'
                            }}>
                                Authenticity Guaranteed
                            </h4>
                            <p style={{ fontSize: '12px', color: '#8f8576', lineHeight: 1.6 }}>
                                Every article undergoes multi-tier physical inspection prior to client shipment.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── LUXURY FOOTER ── */}
            <footer style={{
                background: '#090909',
                padding: '60px 32px 40px',
                borderTop: '1px solid #1c1814'
            }}>
                <div style={{
                    maxWidth: '1360px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '32px'
                    }}>
                        <div style={{ maxWidth: '380px' }}>
                            <SnitchLogo size={24} />
                            <p style={{
                                fontSize: '12px',
                                color: '#70685c',
                                lineHeight: 1.8,
                                marginTop: '16px'
                            }}>
                                The premier destination for sophisticated apparel, redefining modern menswear through exceptional quality and uncompromised detail.
                            </p>
                        </div>
                    </div>

                    <div style={{
                        borderTop: '1px solid #1a1713',
                        paddingTop: '24px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '11px',
                        color: '#5e564a'
                    }}>
                        <div>
                            © {new Date().getFullYear()} SNITCH LUXURY ATELIER. ALL RIGHTS RESERVED.
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <span>Privacy Policy</span>
                            <span>Terms of Service</span>
                            <span>Dispatch & Returns</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home