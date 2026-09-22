import React, { useEffect } from 'react'
import { Search, UserRound, ShoppingBag, Trash2, Minus, Plus, Image as ImageIcon, ArrowRight, LockKeyhole, ShieldCheck, Truck, Package, Ruler } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'
import { useNavigate } from 'react-router'

const Cart = () => {
  const cartItems = useSelector(state => state.cart.items)
  const { handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleRemoveCartItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    handleGetCart()
  }, [])

  // Lucide icons are used instead of Material Symbols.
  // This makes icons visible without requiring a font import in index.html.

  // Compute totals from cart items
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price.amount * item.quantity,
    0
  )
  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN').format(amount)

  // Helper: get variant image or fallback to product images
  const getVariantImage = (item) => {
    const variant = item.product.variants?.find(v => v._id === item.variant)
    if (variant?.images?.length > 0) return variant.images[0].url
    if (item.product.images?.length > 0) return item.product.images[0].url
    return null
  }

  // Helper: get variant color attribute
  const getVariantColor = (item) => {
    const variant = item.product.variants?.find(v => v._id === item.variant)
    return variant?.attributes?.color || variant?.attributes?.size || null
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#16130b', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}
    >
      {/* ── Navigation Bar ── */}


      {/* ── Main Content ── */}
      <main className="main-content" style={{ flexGrow: 1, maxWidth: 1440, margin: '0 auto', width: '100%' }}>

        {/* Page Header */}
        <div style={{ textAlign: 'center', padding: '40px 0 56px', maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f2ca50', marginBottom: 12 }}>
            ATELIER PRIVATE DISPATCH
          </span>
          <h1 className="page-title" style={{ fontFamily: 'Playfair Display, serif', fontSize: 64, fontWeight: 700, letterSpacing: '-0.02em', color: '#eae1d4', textTransform: 'uppercase', lineHeight: '72px', margin: 0 }}>
            YOUR BAG
          </h1>
          <div style={{ width: 64, height: 1, backgroundColor: '#d4af37', margin: '16px 0' }} />
          <p style={{ fontSize: 16, color: '#d0c5af', fontWeight: 300, letterSpacing: '0.03em', maxWidth: 440, lineHeight: '24px', margin: 0 }}>
            Review your curated sartorial selections before proceeding to private dispatch.
          </p>
        </div>

        {/* Empty State */}
        {cartItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <ShoppingBag size={64} strokeWidth={1.2} color="#4d4635" aria-hidden="true" />
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#d0c5af', marginTop: 16 }}>Your bag is empty</p>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: 24, padding: '14px 32px', background: '#d4af37', color: '#110e07',
                fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', border: 'none', cursor: 'pointer'
              }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}

        {/* 60/40 Grid */}
        {cartItems.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }}
            className="cart-grid"
          >
            <style>{`
              .cart-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
              .cart-item { display: flex; gap: 24px; flex-wrap: wrap; }
              .cart-item-content { flex: 1; min-width: 220px; }
              .benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
              .recommendations-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
              .main-content { padding: 112px 64px 80px !important; }
              @media (min-width: 1024px) { .cart-grid { grid-template-columns: 7fr 5fr !important; gap: 48px; } .order-summary { position: sticky; top: 112px; align-self: start; } }
              @media (max-width: 767px) {
                .main-content { padding: 88px 16px 48px !important; }
                .page-title { font-size: 38px !important; line-height: 46px !important; }
                .cart-item { padding: 16px !important; gap: 16px !important; }
                .cart-item-image { width: 100px !important; height: 125px !important; }
                .cart-item-content { width: 100%; min-width: 0; }
                .cart-item-content h2 { font-size: 20px !important; line-height: 28px !important; overflow-wrap: anywhere; }
                .cart-item-content p { font-size: 12px !important; overflow-wrap: anywhere; }
                .benefits-grid, .recommendations-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
                .order-summary { position: static !important; }
                .order-summary-box { padding: 20px !important; }
                .footer-inner { padding: 32px 16px !important; justify-content: center !important; text-align: center; }
              }
              @media (min-width: 768px) and (max-width: 1023px) { .main-content { padding: 100px 32px 60px !important; } .recommendations-grid { grid-template-columns: repeat(2, 1fr) !important; } }

              @media (min-width: 1024px) {
                .cart-grid { grid-template-columns: 7fr 5fr !important; }
              }
              .cart-item-img:hover { transform: scale(1.05) !important; }
              .rec-card:hover { border-color: rgba(212,175,55,0.5) !important; }
              .rec-card:hover .rec-img { transform: scale(1.05) !important; }
              .qty-btn:hover { background-color: #3d392f !important; }
              .checkout-btn:hover { background-color: #f2ca50 !important; box-shadow: 0 0 30px rgba(212,175,55,0.35) !important; }
              .nav-link:hover { color: #f2ca50 !important; }
              .remove-btn:hover { color: #f2ca50 !important; }
              .add-bag-btn:hover { background-color: #f2ca50 !important; color: #110e07 !important; }
            `}</style>

            {/* LEFT — Cart Items */}
            <section>
              {/* Section header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid rgba(77,70,53,0.3)', marginBottom: 24 }}>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d0c5af' }}>
                  SELECTED ARCHIVAL PIECES ({cartItems.length} ITEM{cartItems.length > 1 ? 'S' : ''} / {totalQuantity} UNITS)
                </span>

              </div>

              {/* Cart Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {cartItems.map((item) => {
                  const variantImage = getVariantImage(item)
                  const variantColor = getVariantColor(item)
                  const lineTotal = item.price.amount * item.quantity

                  return (
                    <article
                      key={item._id}
                      className="cart-item"
                      style={{
                        background: '#110e07', padding: 24,
                        border: '1px solid rgba(77,70,53,0.3)',
                        display: 'flex', gap: 24, flexWrap: 'wrap'
                      }}
                    >
                      {/* Product thumbnail */}
                      <div className="cart-item-image" style={{
                        width: 160, height: 160, flexShrink: 0,
                        background: '#231f17', border: '1px solid rgba(77,70,53,0.4)',
                        overflow: 'hidden'
                      }}>
                        {variantImage ? (
                          <img
                            src={variantImage}
                            alt={item.product.title}
                            className="cart-item-img"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 500ms' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImageIcon size={48} strokeWidth={1.2} color="#4d4635" aria-hidden="true" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="cart-item-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 600, color: '#eae1d4', margin: 0, lineHeight: '32px', textTransform: 'capitalize' }}>
                                {item.product.title}
                              </h2>
                              <p style={{ fontSize: 14, color: '#d0c5af', margin: '4px 0 0', fontStyle: 'italic' }}>
                                {item.product.description}
                              </p>
                            </div>
                            {/* Remove */}
                            <button
                              onClick={() => handleRemoveCartItem({
                                productId: item.product._id,
                                variantId: item.variant
                              })}
                              aria-label="Remove item"
                              className="remove-btn"
                              style={{ background: 'none', border: 'none', color: '#99907c', cursor: 'pointer', padding: 4, transition: 'color 200ms' }}
                            >
                              <Trash2 size={20} strokeWidth={1.8} aria-hidden="true" />
                            </button>
                          </div>

                          {/* Attribute Chips */}
                          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                            {variantColor && (
                              <span style={{
                                fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                                padding: '2px 10px', border: '1px solid #d4af37',
                                background: '#1f1b13', color: '#f2ca50', fontFamily: 'Inter, sans-serif'
                              }}>
                                {variantColor}
                              </span>
                            )}
                            <span style={{
                              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                              padding: '2px 10px', border: '1px solid rgba(77,70,53,0.6)',
                              color: '#d0c5af', fontFamily: 'Inter, sans-serif'
                            }}>
                              {item.price.currency}
                            </span>
                          </div>
                        </div>

                        {/* Pricing & Qty Controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(77,70,53,0.2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#99907c', fontFamily: 'Inter, sans-serif' }}>QTY</span>
                            <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(77,70,53,0.5)', background: '#231f17' }}>
                              <button
                                onClick={() => {
                                  if (item.quantity === 1) {
                                    handleRemoveCartItem({
                                      productId: item.product._id,
                                      variantId: item.variant,
                                    });
                                  } else {
                                    handleDecrementCartItem({
                                      productId: item.product._id,
                                      variantId: item.variant
                                    })
                                  }
                                }}


                                aria-label="Decrease quantity"
                                className="qty-btn"
                                type="button"
                                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#f2ca50', cursor: 'pointer', transition: 'background 200ms' }}
                              >
                                {item.quantity === 1 ? (
                                  <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                                ) : (
                                  <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                )}
                              </button>
                              <span style={{ width: 40, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleIncrementCartItem({ productId: item.product._id, variantId: item.variant })}
                                aria-label="Increase quantity"
                                className="qty-btn"
                                type="button"
                                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#f2ca50', cursor: 'pointer', transition: 'background 200ms' }}
                              >
                                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                              </button>
                            </div>
                            <span style={{ fontSize: 13, color: 'rgba(208,197,175,0.7)', letterSpacing: '0.02em' }}>
                              (₹{formatINR(item.price.amount)} each)
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 600, color: '#f2ca50', margin: 0 }}>
                              ₹{formatINR(lineTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* Atelier Value Propositions */}
              <div className="benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, paddingTop: 24, borderTop: '1px solid rgba(77,70,53,0.3)', marginTop: 24 }}>
                {[
                  { icon: 'local_shipping', label: 'Complimentary Insured Transit' },
                  { icon: 'inventory_2', label: 'Signature Archival Packaging' },
                  { icon: 'straighten', label: 'Bespoke Atelier Alterations' },
                ].map(({ icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'rgba(31,27,19,0.4)', border: '1px solid rgba(77,70,53,0.2)' }}>
                    <span style={{ color: '#f2ca50', display: 'inline-flex' }}>
                      {icon === 'local_shipping' && <Truck size={18} strokeWidth={1.8} aria-hidden="true" />}
                      {icon === 'inventory_2' && <Package size={18} strokeWidth={1.8} aria-hidden="true" />}
                      {icon === 'straighten' && <Ruler size={18} strokeWidth={1.8} aria-hidden="true" />}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d0c5af', fontFamily: 'Inter, sans-serif' }}>{label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RIGHT — Order Summary */}
            <aside className="order-summary" style={{ position: 'sticky', top: 112, alignSelf: 'start' }}>
              <div className="order-summary-box" style={{ background: '#1f1b13', padding: 32, border: '1px solid rgba(212,175,55,0.3)' }}>
                {/* Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottom: '1px solid rgba(77,70,53,0.3)' }}>
                  <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f2ca50', margin: 0 }}>
                    ORDER SUMMARY
                  </h2>
                  <ShieldCheck size={18} strokeWidth={1.8} color="#d4af37" aria-hidden="true" />
                </div>

                {/* Breakdown */}
                <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                    <span style={{ color: '#d0c5af' }}>Subtotal ({totalQuantity} item{totalQuantity > 1 ? 's' : ''})</span>
                    <span style={{ color: '#eae1d4', fontWeight: 500 }}>₹{formatINR(totalAmount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                    <div>
                      <span style={{ color: '#d0c5af' }}>Shipping</span>
                      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#99907c', margin: '2px 0 0', fontFamily: 'Inter, sans-serif' }}>
                        Express Insured Delivery
                      </p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f2ca50', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Inter, sans-serif' }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                    <span style={{ color: '#d0c5af' }}>Estimated Duties &amp; Taxes</span>
                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#eae1d4', fontFamily: 'Inter, sans-serif' }}>INCLUDED</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                    <span style={{ color: '#d0c5af' }}>Concierge &amp; Packaging</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f2ca50', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Inter, sans-serif' }}>COMPLIMENTARY</span>
                  </div>
                </div>

                {/* Gold Divider */}
                <div style={{ height: 2, background: '#d4af37', margin: '0 0 8px' }} />

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#eae1d4' }}>TOTAL</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: '#f2ca50', letterSpacing: '-0.01em' }}>
                      ₹{formatINR(totalAmount)}
                    </span>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#99907c', margin: '4px 0 0' }}>
                      VAT AND IMPORT FEES ALL INCLUSIVE
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
                  <button
                    className="checkout-btn"
                    type="button"
                    style={{
                      width: '100%', background: '#d4af37', color: '#110e07',
                      fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '16px 24px', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: '0 0 20px rgba(212,175,55,0.15)',
                      transition: 'all 300ms'
                    }}
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    style={{
                      width: '100%', background: '#231f17', color: '#f2ca50',
                      fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '14px 24px', border: '1px solid rgba(212,175,55,0.4)', cursor: 'pointer',
                      transition: 'colors 200ms'
                    }}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>

                {/* Security & Payment */}
                <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(77,70,53,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#99907c' }}>
                    <LockKeyhole size={16} strokeWidth={1.8} aria-hidden="true" />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>256-Bit Encrypted Atelier Checkout</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, color: '#4d4635' }}>
                    {['VISA', 'MASTERCARD', 'AMEX', 'UPI'].map(p => (
                      <span key={p} style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, border: '1px solid rgba(77,70,53,0.5)', padding: '2px 8px', letterSpacing: '0.05em' }}>{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ── You May Also Like ── */}
        <section style={{ marginTop: 112, paddingTop: 64, borderTop: '1px solid rgba(77,70,53,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f2ca50' }}>
              CURATED COMPLEMENTS
            </span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 600, color: '#eae1d4', textTransform: 'uppercase', margin: '4px 0 0', letterSpacing: '-0.01em' }}>
              YOU MAY ALSO LIKE
            </h2>
            <div style={{ width: 48, height: 1, background: '#d4af37', margin: '12px auto 0' }} />
          </div>

          <div className="recommendations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {[
              {
                label: 'NOIR OBSCUR', title: 'Aurum Obscura Wool Overcoat', price: '₹24,500', badge: 'NEW ARCHIVE',
                img: 'https://ik.imagekit.io/lg0khbxcq/snitch/-473Wx593H-703787139-grey-MODEL_IF2WVT4rCF.avif'
              },
              {
                label: 'IMPERIAL BROCADE', title: 'Gilt Silk Evening Waistcoat', price: '₹8,200', badge: 'LIMITED RUN',
                img: 'https://ik.imagekit.io/lg0khbxcq/snitch/9ca354e80fb2d01d410916a023bfbfa1_fHeddqYGG.jpg'
              },
              {
                label: 'ALABASTER GILT', title: 'Raw Alabaster Silk Scarf', price: '₹4,500', badge: null,
                img: 'https://ik.imagekit.io/lg0khbxcq/snitch/a41e6da0fd9a3bf87e9364415406e0f8_wjookHeum.jpg'
              },
            ].map(({ label, title, price, badge, img }) => (
              <div
                key={title}
                className="rec-card"
                style={{ background: '#110e07', border: '1px solid rgba(77,70,53,0.3)', display: 'flex', flexDirection: 'column', transition: 'border-color 300ms', cursor: 'pointer' }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', background: '#231f17', overflow: 'hidden' }}>
                  <img
                    src={img}
                    alt={title}
                    className="rec-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 700ms' }}
                  />
                  {badge && (
                    <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(17,14,7,0.9)', padding: '2px 8px', border: '1px solid rgba(212,175,55,0.3)' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#f2ca50', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{badge}</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1 }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#99907c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, color: '#eae1d4', margin: 0, lineHeight: '28px' }}>{title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, marginTop: 'auto', borderTop: '1px solid rgba(77,70,53,0.2)' }}>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, color: '#f2ca50' }}>{price}</span>
                    <button
                      className="add-bag-btn"
                      style={{
                        fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '6px 12px', border: '1px solid #d4af37',
                        color: '#f2ca50', background: 'none', cursor: 'pointer',
                        transition: 'all 200ms'
                      }}
                    >
                      ADD TO BAG
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#110e07', borderTop: '1px solid rgba(77,70,53,0.3)' }}>
        <div className="footer-inner" style={{ maxWidth: 1440, margin: '0 auto', padding: '48px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d0c5af' }}>
            © 2024 SNITCH ATELIER. ALL RIGHTS RESERVED.
          </div>
          <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
            {['CLIENT CONCIERGE', 'PRIVATE APPOINTMENTS', 'SHIPPING & RETURNS', 'TERMS OF LUXURY'].map(link => (
              <a
                key={link}
                href="#"
                className="nav-link"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d0c5af', textDecoration: 'none', transition: 'color 200ms' }}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default Cart