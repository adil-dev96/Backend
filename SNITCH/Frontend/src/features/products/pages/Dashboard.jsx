import React, { useEffect, useState } from 'react'
import { useProduct } from '../hooks/useProduct'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

/* ─── helpers ─── */
const fmt = (amount, currency = 'INR') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

/* ─── SnitchLogo ─── */
function SnitchLogo({ size = 36 }) {
    const h = size
    const w = Math.round(h * 4.2)
    return (
        <svg width={w} height={h} viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SNITCH">
            <defs>
                <linearGradient id="goldGradDash" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f2ca50" />
                    <stop offset="45%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#a07d1c" />
                </linearGradient>
            </defs>
            <text x="0" y="82" fontFamily="'Playfair Display', Georgia, serif" fontSize="90" fontWeight="700" letterSpacing="8" fill="url(#goldGradDash)">
                SNITCH
            </text>
        </svg>
    )
}

/* ─── StatCard ─── */
function StatCard({ icon, label, value, sub }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #141414 100%)',
                border: `1px solid ${hovered ? '#d4af3760' : '#2a2520'}`,
                borderRadius: '2px',
                padding: '28px 32px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.25s, transform 0.25s',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
            }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'linear-gradient(to bottom, #d4af37, #a07d1c)' }} />
            <div style={{ marginLeft: '8px' }}>
                <div style={{ fontSize: '22px', marginBottom: '10px' }}>{icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#99907c', marginBottom: '8px' }}>{label}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: 700, color: '#eae1d4', lineHeight: 1 }}>{value}</div>
                {sub && <div style={{ fontSize: '12px', color: '#5a5248', marginTop: '8px', letterSpacing: '0.04em' }}>{sub}</div>}
            </div>
        </div>
    )
}

/* ─── ProductCard ─── */
function ProductCard({ product, index }) {
    const [imgIdx, setImgIdx] = useState(0)
    const [hovered, setHovered] = useState(false)
    const images = product.images || []
    const hasMultiple = images.length > 1

    useEffect(() => {
        if (!hovered || !hasMultiple) return
        const id = setInterval(() => setImgIdx(i => (i + 1) % images.length), 900)
        return () => clearInterval(id)
    }, [hovered, hasMultiple, images.length])

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setImgIdx(0) }}
            style={{
                background: '#111',
                border: `1px solid ${hovered ? '#d4af3730' : '#2a2520'}`,
                borderRadius: '2px',
                overflow: 'hidden',
                transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px #d4af3730' : '0 4px 20px rgba(0,0,0,0.3)',
            }}
        >
            {/* Image */}
            <div style={{ position: 'relative', width: '100%', paddingBottom: '118%', overflow: 'hidden', background: '#0d0d0d' }}>
                {images.length > 0 ? (
                    <img
                        src={images[imgIdx]?.url}
                        alt={product.title}
                        style={{
                            position: 'absolute', inset: 0, width: '100%', height: '100%',
                            objectFit: 'cover',
                            transition: 'opacity 0.35s ease, transform 0.5s ease',
                            transform: hovered ? 'scale(1.06)' : 'scale(1)',
                        }}
                    />
                ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '40px', opacity: 0.2 }}>👔</span>
                    </div>
                )}

                {hasMultiple && (
                    <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)',
                        border: '1px solid #2a2520', borderRadius: '2px',
                        padding: '3px 8px', fontSize: '10px', fontWeight: 600,
                        letterSpacing: '0.1em', color: '#d4af37',
                    }}>
                        {images.length} IMGS
                    </div>
                )}

                {hasMultiple && hovered && (
                    <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '5px' }}>
                        {images.map((_, i) => (
                            <div key={i} style={{
                                width: i === imgIdx ? '16px' : '5px', height: '5px',
                                borderRadius: '3px',
                                background: i === imgIdx ? '#d4af37' : '#ffffff50',
                                transition: 'width 0.25s',
                            }} />
                        ))}
                    </div>
                )}

                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 60%)',
                    opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none',
                }} />
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
                <h3 style={{
                    fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 600,
                    color: '#eae1d4', marginBottom: '6px', letterSpacing: '0.02em',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {product.title}
                </h3>

                <p style={{
                    fontSize: '12px', color: '#5a5248', lineHeight: 1.6, marginBottom: '16px',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '38px',
                }}>
                    {product.description}
                </p>

                <div style={{ height: '1px', background: 'linear-gradient(to right, #d4af3730, transparent)', marginBottom: '16px' }} />

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', color: '#99907c', textTransform: 'uppercase', marginBottom: '4px' }}>Price</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: '#d4af37' }}>
                            {fmt(product.price.amount, product.price.currency)}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', color: '#99907c', textTransform: 'uppercase', marginBottom: '4px' }}>Listed</div>
                        <div style={{ fontSize: '11px', color: '#5a5248' }}>
                            {new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '14px', padding: '8px 10px', background: '#0d0d0d', borderRadius: '2px', border: '1px solid #1e1c18' }}>
                    <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', color: '#3a3630', textTransform: 'uppercase' }}>ID: </span>
                    <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#3a3630' }}>{product._id}</span>
                </div>
            </div>
        </div>
    )
}

/* ─── Loading Skeleton ─── */
function LoadingGrid() {
    return (
        <>
            <style>{`@keyframes dashPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }`}</style>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '24px' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ paddingBottom: '118%', background: '#161616', animation: 'dashPulse 1.6s ease-in-out infinite' }} />
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ height: '14px', background: '#1a1a1a', borderRadius: '2px', width: '70%', animation: 'dashPulse 1.6s ease-in-out infinite' }} />
                            <div style={{ height: '10px', background: '#1a1a1a', borderRadius: '2px', width: '90%', animation: 'dashPulse 1.6s ease-in-out infinite' }} />
                            <div style={{ height: '10px', background: '#1a1a1a', borderRadius: '2px', width: '55%', animation: 'dashPulse 1.6s ease-in-out infinite' }} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

/* ─── Empty State ─── */
function EmptyState({ hasProducts }) {
    return (
        <div style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div style={{ fontSize: '56px', marginBottom: '24px', opacity: 0.3 }}>{hasProducts ? '🔍' : '📦'}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 600, color: '#eae1d4', marginBottom: '12px' }}>
                {hasProducts ? 'No products match your search' : 'No products listed yet'}
            </h2>
            <p style={{ fontSize: '14px', color: '#5a5248', marginBottom: '32px' }}>
                {hasProducts ? 'Try adjusting your search or filters.' : 'Start selling by adding your first product to the SNITCH marketplace.'}
            </p>
            {!hasProducts && (
                <Link to="/seller/create-product" style={{
                    display: 'inline-block', background: '#d4af37', color: '#000',
                    padding: '14px 32px', fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    textDecoration: 'none', borderRadius: '2px', transition: 'background 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e9c349'}
                    onMouseLeave={e => e.currentTarget.style.background = '#d4af37'}
                >
                    Add Your First Product
                </Link>
            )}
        </div>
    )
}

/* ─── Dashboard (main) ─── */
const Dashboard = () => {
    const { handleGetSellerProduct } = useProduct()
    const sellerProducts = useSelector(state => state.product.sellerProducts)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            await handleGetSellerProduct()
            setLoading(false)
        }
        load()
    }, [])

    const products = sellerProducts || []

    const filtered = products
        .filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
            if (sortBy === 'price_high') return b.price.amount - a.price.amount
            if (sortBy === 'price_low') return a.price.amount - b.price.amount
            return 0
        })

    const totalValue = products.reduce((sum, p) => sum + p.price.amount, 0)
    const avgPrice = products.length ? Math.round(totalValue / products.length) : 0

    return (
        <div style={{ minHeight: '100vh', background: '#0D0D0D', color: '#eae1d4', fontFamily: "'Inter', sans-serif" }}>

            {/* NAV */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: 'rgba(13,13,13,0.92)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #1e1c18',
                padding: '0 40px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: '64px',
            }}>
                <SnitchLogo size={26} />
                <div style={{
                    fontSize: '10px', fontWeight: 600, letterSpacing: '0.16em',
                    textTransform: 'uppercase', color: '#d4af37',
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    padding: '5px 12px', borderRadius: '2px',
                }}>
                    Seller Portal
                </div>
                <Link
                    to="/seller/create-product"
                    style={{
                        background: '#d4af37', color: '#000', borderRadius: '2px',
                        padding: '10px 22px', fontSize: '10px', fontWeight: 700,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e9c349'}
                    onMouseLeave={e => e.currentTarget.style.background = '#d4af37'}
                >
                    <span style={{ fontSize: '13px' }}>＋</span> Add Product
                </Link>
            </nav>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px 80px' }}>

                {/* HEADER */}
                <div style={{ marginBottom: '48px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#d4af37', marginBottom: '12px' }}>
                        Seller Dashboard
                    </p>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', fontWeight: 700, color: '#eae1d4', lineHeight: 1.1, marginBottom: '12px' }}>
                        Your Collections
                    </h1>
                    <p style={{ fontSize: '15px', color: '#5a5248', lineHeight: 1.6 }}>
                        Manage and monitor all your listed products in the SNITCH marketplace.
                    </p>
                </div>

                {/* STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px' }}>
                    <StatCard icon="📦" label="Total Products" value={products.length} sub="Active listings" />
                    <StatCard icon="💰" label="Total Value" value={fmt(totalValue)} sub="Combined listing value" />
                    <StatCard icon="📊" label="Avg. Price" value={fmt(avgPrice)} sub="Per product" />
                    <StatCard icon="🖼️" label="Total Images" value={products.reduce((s, p) => s + p.images.length, 0)} sub="Across all products" />
                </div>

                {/* TOOLBAR */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a5248', fontSize: '13px', pointerEvents: 'none' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search products…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                background: '#111', border: '1px solid #2a2520',
                                borderRadius: '2px', color: '#eae1d4',
                                fontSize: '13px', padding: '11px 14px 11px 38px', outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#d4af37'}
                            onBlur={e => e.target.style.borderColor = '#2a2520'}
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{
                            background: '#111', border: '1px solid #2a2520', borderRadius: '2px',
                            color: '#eae1d4', fontSize: '12px', fontWeight: 600,
                            letterSpacing: '0.08em', padding: '11px 16px', outline: 'none', cursor: 'pointer',
                        }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price_high">Price: High → Low</option>
                        <option value="price_low">Price: Low → High</option>
                    </select>
                    <div style={{
                        fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em',
                        textTransform: 'uppercase', color: '#5a5248',
                        background: '#111', border: '1px solid #1e1c18',
                        borderRadius: '2px', padding: '11px 16px', whiteSpace: 'nowrap',
                    }}>
                        {filtered.length} / {products.length} items
                    </div>
                </div>

                {/* GRID */}
                {loading ? (
                    <LoadingGrid />
                ) : filtered.length === 0 ? (
                    <EmptyState hasProducts={products.length > 0} />
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '24px' }}>
                        {filtered.map((product, i) => (
                            <ProductCard key={product._id} product={product} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard