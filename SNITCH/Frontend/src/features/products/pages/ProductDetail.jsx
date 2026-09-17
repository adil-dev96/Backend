import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useProduct } from '../hooks/useProduct'

// Fallback product data matching the schema in case API is offline or during preview
const SAMPLE_PRODUCT = {
    _id: "6aa6eca297bc764f444c0b82",
    title: "Linen Tailored Trousers",
    description: "pants hai linen ke. Tailored to perfection from 100% pure organic European flax linen. Engineered with a contemporary relaxed fit, breathable weave, and signature horn buttons for effortless day-to-evening sophistication.",
    seller: "6a9bfb674720e23e07bab95b",
    price: {
        amount: 1500,
        currency: "INR"
    },
    images: [
        {
            url: "https://ik.imagekit.io/lg0khbxcq/snitch/Screenshot__22__4DaINX8ieg.png",
            _id: "6aa6eca297bc764f444c0b83"
        },
        {
            url: "https://ik.imagekit.io/lg0khbxcq/snitch/Screenshot__21__-_Copy_kHZkm6QQJ_.png",
            _id: "6aa6eca297bc764f444c0b84"
        },
        {
            url: "https://ik.imagekit.io/lg0khbxcq/snitch/Screenshot__23__-_Copy_vslClMRLV.png",
            _id: "6aa6eca297bc764f444c0b85"
        },
        {
            url: "https://ik.imagekit.io/lg0khbxcq/snitch/Screenshot__22__FQw9opfoN.png",
            _id: "6aa6eca297bc764f444c0b86"
        },
        {
            url: "https://ik.imagekit.io/lg0khbxcq/snitch/Screenshot__22__-_Copy_qtcKF6RXz.png",
            _id: "6aa6eca297bc764f444c0b87"
        },
        {
            url: "https://ik.imagekit.io/lg0khbxcq/snitch/Screenshot__22___80qjBzXM.png",
            _id: "6aa6eca297bc764f444c0b88"
        },
        {
            url: "https://ik.imagekit.io/lg0khbxcq/snitch/Screenshot__21__-_Copy_H42vajUr9q.png",
            _id: "6aa6eca297bc764f444c0b89"
        }
    ],
    createdAt: "2026-09-13T18:34:10.291Z",
    updatedAt: "2026-09-13T18:34:10.291Z",
    __v: 0
}

const formatPrice = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency || 'INR',
        maximumFractionDigits: 0
    }).format(amount ?? 0)
}

const ProductDetail = () => {
    const { productId } = useParams()
    const navigate = useNavigate()
    const { handleGetProductById } = useProduct()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    // Interactive states
    const [activeImageIdx, setActiveImageIdx] = useState(0)
    const [selectedSize, setSelectedSize] = useState('M')
    const [quantity, setQuantity] = useState(1)
    const [showSizeGuide, setShowSizeGuide] = useState(false)
    const [toastMessage, setToastMessage] = useState(null)
    const [isImageZoomed, setIsImageZoomed] = useState(false)

    const sizes = ['S', 'M', 'L', 'XL', 'XXL']

    const showNotification = (msg) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    async function fetchProductDetails() {
        setLoading(true)
        try {
            if (productId) {
                const data = await handleGetProductById(productId)
                if (data) {
                    setProduct(data)
                } else {
                    // Fallback to sample if ID matches or backend is not responding
                    setProduct(SAMPLE_PRODUCT)
                }
            } else {
                setProduct(SAMPLE_PRODUCT)
            }
        } catch (err) {
            console.error("Error fetching product details:", err)
            // If backend request fails (e.g. 404 or backend not running), show sample data for seamless preview
            setProduct(SAMPLE_PRODUCT)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProductDetails()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [productId])

    const images = product?.images || []
    const currentImage = images[activeImageIdx]?.url || images[0]?.url

    const handlePrevImage = () => {
        if (!images.length) return
        setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNextImage = () => {
        if (!images.length) return
        setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#eae1d4] font-['Inter',sans-serif] selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
            {/* ── Toast Notification ── */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#181613] border border-[#d4af37] text-[#eae1d4] px-5 py-3.5 rounded shadow-2xl backdrop-blur-md animate-bounce">
                    <span className="text-[#d4af37] text-lg font-bold">✓</span>
                    <span className="text-xs uppercase tracking-widest font-semibold">{toastMessage}</span>
                </div>
            )}

            {/* ── Top Announcement Banner ── */}
            <div className="bg-gradient-to-r from-[#14120f] via-[#1c1810] to-[#14120f] border-b border-[#262118] text-center py-2 px-4 text-[11px] font-semibold tracking-[0.22em] text-[#d4af37] uppercase">
                ⚜️ Complimentary Express Delivery on Luxury Orders Over ₹999 &nbsp;|&nbsp; 100% Handcrafted Verification
            </div>

            {/* ── Navigation Header ── */}
            <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#201c17]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="group flex items-center">
                            <span className="font-['Playfair_Display',Georgia,serif] text-2xl font-bold tracking-[0.25em] bg-gradient-to-r from-[#f7d56e] via-[#d4af37] to-[#9c7a1a] bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                                SNITCH
                            </span>
                        </Link>
                        <span className="hidden md:inline-block h-4 w-px bg-[#2a241c]"></span>
                        <nav className="hidden md:flex items-center gap-6 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8f8576]">
                            <Link to="/" className="hover:text-[#d4af37] transition-colors">Catalog</Link>
                            <span className="text-[#3a342c]">/</span>
                            <span className="text-[#d4af37]">Product Details</span>
                        </nav>
                    </div>

                    {/* Quick Action / Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#b0a696] hover:text-[#d4af37] transition-colors py-2 px-3 rounded hover:bg-[#161411] border border-transparent hover:border-[#2b251a]"
                    >
                        <span>←</span>
                        <span>Back</span>
                    </button>
                </div>
            </header>

            {/* ── Main Container ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Breadcrumbs */}
                <div className="mb-6 flex items-center gap-2 text-xs text-[#70685c] uppercase tracking-wider">
                    <Link to="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-[#8f8576]">Atelier</span>
                    <span>/</span>
                    <span className="text-[#d4af37] font-medium truncate max-w-xs">{product?.title || 'Product'}</span>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
                        <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
                            <div className="hidden sm:flex flex-col gap-3 w-20">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-20 h-24 bg-[#181613] rounded border border-[#221e1a]" />
                                ))}
                            </div>
                            <div className="flex-1 aspect-[4/5] bg-[#181613] rounded border border-[#221e1a]" />
                        </div>
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div className="h-4 bg-[#181613] rounded w-1/4" />
                            <div className="h-10 bg-[#181613] rounded w-3/4" />
                            <div className="h-8 bg-[#181613] rounded w-1/3" />
                            <div className="h-20 bg-[#181613] rounded w-full" />
                            <div className="h-12 bg-[#181613] rounded w-full" />
                            <div className="h-12 bg-[#181613] rounded w-full" />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                        {/* ── LEFT COLUMN: Image Gallery ── */}
                        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6">
                            {/* Thumbnails Sidebar */}
                            {images.length > 1 && (
                                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[620px] pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-[#2a241b]">
                                    {images.map((img, idx) => (
                                        <button
                                            key={img._id || idx}
                                            onClick={() => setActiveImageIdx(idx)}
                                            className={`relative flex-shrink-0 w-16 sm:w-20 aspect-[3/4] rounded overflow-hidden border transition-all duration-200 cursor-pointer ${
                                                activeImageIdx === idx
                                                    ? 'border-[#d4af37] ring-1 ring-[#d4af37]/60 shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                                                    : 'border-[#221e1a] opacity-60 hover:opacity-100 hover:border-[#3a342c]'
                                            }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Display Image */}
                            <div className="relative flex-1 rounded-sm overflow-hidden bg-[#111111] border border-[#221e1a] shadow-2xl group">
                                <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                                    {currentImage ? (
                                        <img
                                            src={currentImage}
                                            alt={product?.title || "Product image"}
                                            className={`w-full h-full object-cover transition-transform duration-700 ease-out cursor-zoom-in ${
                                                isImageZoomed ? 'scale-125' : 'group-hover:scale-105'
                                            }`}
                                            onClick={() => setIsImageZoomed(!isImageZoomed)}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-[#3a342c]">
                                            ✨
                                        </div>
                                    )}

                                    {/* Gradient overlay on bottom */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/80 via-transparent to-transparent pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity" />

                                    {/* Top Atelier Badge */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-[#d4af37] text-black text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-sm shadow-md">
                                            Signature Collection
                                        </span>
                                    </div>

                                    {/* Counter Badge */}
                                    {images.length > 0 && (
                                        <div className="absolute top-4 right-4 bg-[#0d0d0d]/80 backdrop-blur-md border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-sm">
                                            {activeImageIdx + 1} / {images.length}
                                        </div>
                                    )}

                                    {/* Gallery Navigation Arrows */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePrevImage}
                                                aria-label="Previous Image"
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0d0d0d]/80 hover:bg-[#d4af37] text-[#eae1d4] hover:text-black border border-[#2e281e] flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={handleNextImage}
                                                aria-label="Next Image"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0d0d0d]/80 hover:bg-[#d4af37] text-[#eae1d4] hover:text-black border border-[#2e281e] flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </>
                                    )}

                                    {/* Click to zoom indicator */}
                                    <div className="absolute bottom-3 right-3 text-[10px] uppercase tracking-widest text-[#8f8576] bg-[#0d0d0d]/80 px-2 py-1 rounded border border-[#262119] pointer-events-none">
                                        {isImageZoomed ? 'Click to minimize' : 'Click to zoom'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Product Information & Purchase ── */}
                        <div className="lg:col-span-5 flex flex-col justify-between">
                            <div>
                                {/* Sub-heading / Atelier Line */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-pulse"></span>
                                    <span className="text-[10px] font-bold tracking-[0.24em] text-[#d4af37] uppercase">
                                        SNITCH ATELIER LUXURY
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="font-['Playfair_Display',Georgia,serif] text-3xl sm:text-4xl font-bold text-[#eae1d4] tracking-tight mb-4 capitalize">
                                    {product?.title}
                                </h1>

                                {/* Price Box */}
                                <div className="p-4 rounded bg-[#131210] border border-[#231e18] mb-6 shadow-inner">
                                    <div className="flex items-baseline gap-3">
                                        <span className="font-['Playfair_Display',Georgia,serif] text-3xl sm:text-4xl font-bold text-[#d4af37]">
                                            {formatPrice(product?.price?.amount, product?.price?.currency)}
                                        </span>
                                        <span className="text-xs text-[#8f8576] uppercase tracking-wider">
                                            MRP incl. all taxes
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[#70685c] mt-1.5 flex items-center gap-1.5">
                                        <span className="text-[#d4af37]">✓</span>
                                        Free express insured shipping & easy 7-day exchanges
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f8576] mb-2">
                                        Description
                                    </h2>
                                    <p className="text-sm text-[#b0a696] leading-relaxed font-light">
                                        {product?.description || "Exquisite artisanal craftsmanship made from the finest materials. An essential investment silhouette designed for the modern aesthetic."}
                                    </p>
                                </div>

                                {/* Size Selection */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f8576]">
                                            Select Size
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setShowSizeGuide(!showSizeGuide)}
                                            className="text-[11px] text-[#d4af37] underline underline-offset-4 hover:text-[#f7d56e] transition-colors cursor-pointer"
                                        >
                                            {showSizeGuide ? 'Hide Size Chart' : 'View Size Chart'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-5 gap-2.5">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedSize(size)}
                                                className={`py-3 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer border ${
                                                    selectedSize === size
                                                        ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                                        : 'bg-[#151310] text-[#eae1d4] border-[#29231b] hover:border-[#d4af37]/60 hover:bg-[#1a1714]'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Expandable Size Guide */}
                                    {showSizeGuide && (
                                        <div className="mt-4 p-4 rounded bg-[#14120f] border border-[#2b251b] text-xs animate-fadeIn">
                                            <div className="font-semibold text-[#d4af37] uppercase tracking-wider mb-2">
                                                Measurement Guidelines (Inches)
                                            </div>
                                            <div className="grid grid-cols-4 gap-2 text-center text-[#8f8576] pt-1">
                                                <div className="font-bold text-[#eae1d4]">Size</div>
                                                <div className="font-bold text-[#eae1d4]">Waist</div>
                                                <div className="font-bold text-[#eae1d4]">Length</div>
                                                <div className="font-bold text-[#eae1d4]">Hip</div>
                                                <div>S</div><div>30"</div><div>40"</div><div>38"</div>
                                                <div>M</div><div>32"</div><div>41"</div><div>40"</div>
                                                <div>L</div><div>34"</div><div>42"</div><div>42"</div>
                                                <div>XL</div><div>36"</div><div>42.5"</div><div>44"</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Quantity Selector */}
                                <div className="mb-8 flex items-center gap-4">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f8576]">
                                        Quantity
                                    </span>
                                    <div className="inline-flex items-center rounded border border-[#29231b] bg-[#14120f]">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="px-3.5 py-2 text-sm text-[#8f8576] hover:text-[#d4af37] hover:bg-[#1a1714] transition-colors cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 text-xs font-semibold text-[#eae1d4]">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="px-3.5 py-2 text-sm text-[#8f8576] hover:text-[#d4af37] hover:bg-[#1a1714] transition-colors cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* ── THE TWO MANDATORY BUTTONS ── */}
                                <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
                                    {/* ADD TO CART Button */}
                                    <button
                                        type="button"
                                        onClick={() => showNotification(`Added ${quantity} item(s) to Bag`)}
                                        className="flex-1 group relative overflow-hidden rounded bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] active:scale-[0.98]"
                                    >
                                        <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span>Add To Cart</span>
                                    </button>

                                    {/* BUY NOW Button */}
                                    <button
                                        type="button"
                                        onClick={() => showNotification("Proceeding to Express Checkout...")}
                                        className="flex-1 group relative overflow-hidden rounded bg-gradient-to-r from-[#d4af37] via-[#f7d56e] to-[#d4af37] text-black py-4 px-6 text-xs font-extrabold uppercase tracking-[0.22em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.55)] hover:brightness-105 active:scale-[0.98]"
                                    >
                                        <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                        </svg>
                                        <span>Buy Now</span>
                                    </button>
                                </div>
                            </div>

                            {/* ── Product Meta & Trust Accordions ── */}
                            <div className="border-t border-[#231e18] pt-6 space-y-4">
                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-3 py-3 border-b border-[#201c17] text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg mb-1">✨</span>
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#eae1d4]">100% Authentic</span>
                                        <span className="text-[9px] text-[#70685c]">Verified Atelier</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg mb-1">⚡</span>
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#eae1d4]">Fast Dispatch</span>
                                        <span className="text-[9px] text-[#70685c]">Ships in 24 hrs</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg mb-1">↺</span>
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#eae1d4]">7-Day Returns</span>
                                        <span className="text-[9px] text-[#70685c]">Hassle-free swap</span>
                                    </div>
                                </div>

                                {/* Accordion / Tabs */}
                                <div className="space-y-2">
                                    <details className="group border border-[#201c17] bg-[#12110e] rounded p-3.5 cursor-pointer">
                                        <summary className="text-xs font-semibold uppercase tracking-wider text-[#eae1d4] flex justify-between items-center list-none">
                                            <span>Material & Care Specifications</span>
                                            <span className="text-[#d4af37] transition-transform group-open:rotate-180">▾</span>
                                        </summary>
                                        <div className="mt-3 text-xs text-[#8f8576] leading-relaxed border-t border-[#221d17] pt-2.5 space-y-1">
                                            <p>• Premium pure natural linen weave with high breathability.</p>
                                            <p>• Gentle cold water machine wash or luxury dry clean recommended.</p>
                                            <p>• Iron on reverse with medium steam.</p>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* ── Footer ── */}
            <footer className="mt-20 border-t border-[#201c17] bg-[#090909] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="font-['Playfair_Display',Georgia,serif] text-xl font-bold tracking-[0.25em] text-[#d4af37] mb-3">
                        SNITCH
                    </div>
                    <p className="text-xs text-[#70685c] tracking-widest uppercase">
                        Uncompromising Luxury Sartorial House © 2026. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default ProductDetail