import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useProduct } from '../hooks/useProduct'

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

    // ── Main State ──
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    // ── Variant Selection State ──
    // Stores the _id of the currently active variant, or null if base product is selected
    const [selectedVariantId, setSelectedVariantId] = useState(null)
    // Stores specific chosen attribute values (e.g. { color: 'black', size: 'Large' })
    const [selectedAttributes, setSelectedAttributes] = useState({})

    // ── Gallery & Interactive States ──
    const [activeImageIdx, setActiveImageIdx] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [showSizeGuide, setShowSizeGuide] = useState(false)
    const [toastMessage, setToastMessage] = useState(null)
    const [isImageZoomed, setIsImageZoomed] = useState(false)

    // Standard fallback sizes if no size attribute is present in variants
    const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL']
    const [fallbackSize, setFallbackSize] = useState('M')

    const showNotification = (msg) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    async function fetchProductDetails() {
        setLoading(true)

        try {
            // Fetch the real product from the backend using the URL productId.
            const data = await handleGetProductById(productId)

            console.log("API Response:", data)

            // If the API does not return a product, keep product as null.
            // We do not use fake/sample data anymore.
            setProduct(data || null)
        } catch (err) {
            console.error("Error fetching product details:", err)

            // On an API error, show the error state instead of sample data.
            setProduct(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProductDetails()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [productId])

    // ─────────────────────────────────────────────────────────────
    // VARIANT & ATTRIBUTE SELECTION LOGIC
    // ─────────────────────────────────────────────────────────────
    const variants = product?.variants || []

    /**
     * Collect all unique attribute names across all product variants.
     * (e.g., ['color', 'size', 'storage'])
     */
    const allAttributeNames = React.useMemo(() => {
        const namesSet = new Set()
        variants.forEach(variant => {
            if (variant.attributes && typeof variant.attributes === 'object') {
                Object.keys(variant.attributes).forEach(key => namesSet.add(key))
            }
        })
        return Array.from(namesSet)
    }, [variants])

    /**
     * Map each attribute name to all unique values found across variants.
     * (e.g., { color: ['brown', 'blue', 'black'], size: ['Large'] })
     */
    const attributeOptions = React.useMemo(() => {
        const optionsMap = {}
        allAttributeNames.forEach(attrName => {
            const valuesSet = new Set()
            variants.forEach(variant => {
                if (variant.attributes && variant.attributes[attrName]) {
                    valuesSet.add(variant.attributes[attrName])
                }
            })
            optionsMap[attrName] = Array.from(valuesSet)
        })
        return optionsMap
    }, [variants, allAttributeNames])

    /**
     * Initialize selected variant or attributes when product data loads.
     * By default, select the first variant if available.
     */
    useEffect(() => {
        if (variants.length > 0) {
            // Default to the first variant
            const firstVariant = variants[0]
            setSelectedVariantId(firstVariant._id)
            if (firstVariant.attributes) {
                setSelectedAttributes({ ...firstVariant.attributes })
            }
        } else {
            setSelectedVariantId(null)
            setSelectedAttributes({})
        }
        // Reset active gallery image to first image on product load
        setActiveImageIdx(0)
    }, [product])

    /**
     * Find the currently active variant object based on selectedVariantId.
     */
    const activeVariant = React.useMemo(() => {
        if (!selectedVariantId) return null
        return variants.find(v => v._id === selectedVariantId) || null
    }, [variants, selectedVariantId])

    /**
     * Handler when user selects a variant directly by clicking its chip or card.
     */
    const handleSelectVariantDirectly = (variant) => {
        setSelectedVariantId(variant._id)
        if (variant.attributes) {
            setSelectedAttributes({ ...variant.attributes })
        }
        // Reset gallery image to first thumbnail when switching variants
        setActiveImageIdx(0)
    }

    /**
     * Handler when user clicks an individual attribute button (e.g. Color: "blue" or Size: "Large").
     * Finds the closest matching variant that satisfies the updated attribute selections.
     */
    const handleSelectAttributeValue = (attrName, value) => {
        // Create the new selection after the user clicks an option.
        const nextAttributes = {
            ...selectedAttributes,
            [attrName]: value
        }

        // First, try to find an exact variant that matches every selected attribute.
        let matchedVariant = variants.find((variant) => {
            if (!variant.attributes) return false

            return Object.entries(nextAttributes).every(([key, selectedValue]) => {
                return variant.attributes[key] === selectedValue
            })
        })

        // If an exact combination does not exist, find a compatible variant.
        // Example: Brown may not have a size attribute, so Brown should still work
        // even if Large was selected previously for another color.
        if (!matchedVariant) {
            matchedVariant = variants.find((variant) => {
                if (!variant.attributes) return false
                if (variant.attributes[attrName] !== value) return false

                return Object.entries(nextAttributes).every(([key, selectedValue]) => {
                    // Ignore attributes that this variant does not contain.
                    // This allows Brown (without size) to be selected after Black/Large.
                    if (typeof variant.attributes[key] === 'undefined') return true
                    return variant.attributes[key] === selectedValue
                })
            })
        }

        if (matchedVariant) {
            // Use the matched variant's real attributes.
            // This removes an old incompatible selection such as Large when
            // the newly selected Brown variant has no size attribute.
            setSelectedAttributes({ ...matchedVariant.attributes })
            setSelectedVariantId(matchedVariant._id)
        } else {
            // Keep the clicked value visible even if no matching variant is found.
            setSelectedAttributes(nextAttributes)
        }

        // Show the selected variant's first image.
        setActiveImageIdx(0)
    }

    // ─────────────────────────────────────────────────────────────
    // FALLBACK LOGIC: Use variant values if present, else main product
    // ─────────────────────────────────────────────────────────────

    /**
     * 1. Images: Use variant images if available and non-empty;
     *    otherwise fall back to main product images.
     */
    const effectiveImages = React.useMemo(() => {
        if (activeVariant?.images && activeVariant.images.length > 0) {
            return activeVariant.images
        }
        return product?.images || []
    }, [activeVariant, product])

    /**
     * 2. Price: Use variant price if specified;
     *    otherwise fall back to main product price.
     */
    const effectivePrice = React.useMemo(() => {
        if (activeVariant?.price?.amount) {
            return activeVariant.price
        }
        return product?.price || { amount: 0, currency: 'INR' }
    }, [activeVariant, product])

    /**
     * 3. Stock: Use variant stock if present;
     *    otherwise fall back to product stock or default to in-stock.
     */
    const effectiveStock = React.useMemo(() => {
        if (activeVariant && typeof activeVariant.stock !== 'undefined') {
            return activeVariant.stock
        }
        return product?.stock ?? 100
    }, [activeVariant, product])

    const currentImage = effectiveImages[activeImageIdx]?.url || effectiveImages[0]?.url

    const handlePrevImage = () => {
        if (!effectiveImages.length) return
        setActiveImageIdx((prev) => (prev === 0 ? effectiveImages.length - 1 : prev - 1))
    }

    const handleNextImage = () => {
        if (!effectiveImages.length) return
        setActiveImageIdx((prev) => (prev === effectiveImages.length - 1 ? 0 : prev + 1))
    }

    /**
     * Checks whether an attribute option is available with the other
     * currently selected attributes.
     *
     * Example:
     * If Brown + L does not exist or has zero stock,
     * the L button becomes crossed out while Brown is selected.
     */
    const isAttributeOptionAvailable = (attrName, optionValue) => {
        return variants.some((variant) => {
            if (!variant.attributes) return false

            // The option itself must exist on this variant.
            if (variant.attributes[attrName] !== optionValue) return false

            // A variant with zero stock should appear unavailable.
            if (Number(variant.stock ?? 0) <= 0) return false

            // Check the other selected attributes only when this variant
            // actually has that attribute.
            // Example: Brown has no size, so Brown remains clickable even
            // when Large is currently selected for Black.
            return Object.entries(selectedAttributes).every(([key, value]) => {
                if (key === attrName) return true
                if (typeof variant.attributes[key] === 'undefined') return true
                return variant.attributes[key] === value
            })
        })
    }

    // Show a clear message when the product is missing or the API fails.
    if (!loading && !product) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] text-[#eae1d4] flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-2xl font-semibold text-[#d4af37] mb-3">Product Not Found</h1>
                <p className="text-sm text-[#8f8576] mb-6">
                    We could not load this product. Please check the product link or try again.
                </p>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="border border-[#d4af37] text-[#d4af37] px-5 py-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#d4af37] hover:text-black transition-colors"
                >
                    Go Back
                </button>
            </div>
        )
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
                            {effectiveImages.length > 1 && (
                                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[620px] pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-[#2a241b]">
                                    {effectiveImages.map((img, idx) => (
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
                                    {effectiveImages.length > 0 && (
                                        <div className="absolute top-4 right-4 bg-[#0d0d0d]/80 backdrop-blur-md border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-sm">
                                            {activeImageIdx + 1} / {effectiveImages.length}
                                        </div>
                                    )}

                                    {/* Gallery Navigation Arrows */}
                                    {effectiveImages.length > 1 && (
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

                                {/* Price & Stock Box */}
                                <div className="p-4 rounded bg-[#131210] border border-[#231e18] mb-6 shadow-inner">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <div className="flex items-baseline gap-3">
                                            {/* Uses variant price if available, else falls back to product price */}
                                            <span className="font-['Playfair_Display',Georgia,serif] text-3xl sm:text-4xl font-bold text-[#d4af37]">
                                                {formatPrice(effectivePrice?.amount, effectivePrice?.currency)}
                                            </span>
                                            <span className="text-xs text-[#8f8576] uppercase tracking-wider">
                                                MRP incl. all taxes
                                            </span>
                                        </div>

                                        {/* Stock Availability indicator with variant fallback */}
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${effectiveStock > 0 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-red-400'}`} />
                                            <span className={`text-[11px] font-semibold uppercase tracking-wider ${effectiveStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {effectiveStock > 0 ? (effectiveStock <= 10 ? `Only ${effectiveStock} left` : 'In Stock') : 'Out of Stock'}
                                            </span>
                                        </div>
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

                                {/* ── DYNAMIC VARIANT SELECTOR (Direct Variant Chips) ── */}
                                {variants.length > 0 && (
                                    <div className="mb-6 border-t border-[#201c17] pt-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f8576]">
                                                Choose Variant ({variants.length} Available)
                                            </span>
                                            {activeVariant && (
                                                <span className="text-[11px] text-[#d4af37] font-mono">
                                                    {Object.entries(activeVariant.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
                                            {variants.map((v) => {
                                                const isSelected = selectedVariantId === v._id;
                                                const vPrice = v.price?.amount ? v.price : product?.price;
                                                const vThumbnail = (v.images && v.images[0]?.url) || (product?.images && product.images[0]?.url);
                                                // Show only non-size attributes in the variant card.
                                                // Size is displayed separately in the Size selector below.
                                                const attrLabels = Object.entries(v.attributes || {})
                                                    .filter(([key]) => key.toLowerCase() !== 'size')
                                                    .map(([, val]) => val)
                                                    .join(' / ') || 'Standard';

                                                return (
                                                    <button
                                                        key={v._id}
                                                        type="button"
                                                        onClick={() => handleSelectVariantDirectly(v)}
                                                        className={`p-2.5 rounded text-left transition-all duration-200 border cursor-pointer flex items-center gap-3 ${
                                                            isSelected
                                                                ? 'bg-[#1c1811] border-[#d4af37] ring-1 ring-[#d4af37]/60 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                                                                : 'bg-[#14120f] border-[#262017] hover:border-[#42392b]'
                                                        }`}
                                                    >
                                                        {vThumbnail ? (
                                                            <img
                                                                src={vThumbnail}
                                                                alt={attrLabels}
                                                                className="w-10 h-10 object-cover rounded-sm border border-[#2d251a]"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-[#1c1811] rounded-sm flex items-center justify-center text-xs text-[#8f8576]">
                                                                ✨
                                                            </div>
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <div className={`text-xs font-semibold truncate capitalize ${isSelected ? 'text-[#d4af37]' : 'text-[#eae1d4]'}`}>
                                                                {attrLabels}
                                                            </div>
                                                            <div className="text-[10px] text-[#8f8576] font-mono mt-0.5">
                                                                {formatPrice(vPrice?.amount, vPrice?.currency)}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* ── DYNAMIC ATTRIBUTE SELECTORS (e.g. Color, Size, etc.) ── */}
                                {allAttributeNames.length > 0 ? (
                                    allAttributeNames.map((attrName) => {
                                        const options = attributeOptions[attrName] || [];
                                        const currentVal = selectedAttributes[attrName] || (activeVariant?.attributes?.[attrName] ?? '');

                                        return (
                                            <div key={attrName} className="mb-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f8576]">
                                                        Select {attrName}: <span className="text-[#eae1d4] ml-1 capitalize">{currentVal || 'Default'}</span>
                                                    </span>
                                                    {attrName.toLowerCase() === 'size' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSizeGuide(!showSizeGuide)}
                                                            className="text-[11px] text-[#d4af37] underline underline-offset-4 hover:text-[#f7d56e] transition-colors cursor-pointer"
                                                        >
                                                            {showSizeGuide ? 'Hide Size Chart' : 'View Size Chart'}
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-2.5">
                                                    {options.map((optVal) => {
                                                        // Check availability using the selected color/size/etc.
                                                        const isAvailable = isAttributeOptionAvailable(attrName, optVal)

                                                        const isSelected = (selectedAttributes[attrName] === optVal) ||
                                                            (!selectedAttributes[attrName] && activeVariant?.attributes?.[attrName] === optVal)

                                                        return (
                                                            <button
                                                                key={optVal}
                                                                type="button"
                                                                disabled={!isAvailable}
                                                                onClick={() => {
                                                                    // Do not allow unavailable options to be selected.
                                                                    if (isAvailable) {
                                                                        handleSelectAttributeValue(attrName, optVal)
                                                                    }
                                                                }}
                                                                className={`relative py-2 px-4 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-200 border ${
                                                                    !isAvailable
                                                                        ? 'bg-[#11100e] text-[#625b50] border-[#29231b] cursor-not-allowed'
                                                                        : isSelected
                                                                            ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer'
                                                                            : 'bg-[#151310] text-[#eae1d4] border-[#29231b] hover:border-[#d4af37]/60 hover:bg-[#1a1714] cursor-pointer'
                                                                }`}
                                                            >
                                                                {optVal}

                                                                {/* Diagonal line means this option is unavailable. */}
                                                                {!isAvailable && (
                                                                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded">
                                                                        <span className="w-[130%] h-px bg-[#8f8576] rotate-[-25deg]" />
                                                                    </span>
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </div>

                                                {/* Size Guide Chart if size attribute */}
                                                {attrName.toLowerCase() === 'size' && showSizeGuide && (
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
                                        );
                                    })
                                ) : (
                                    /* Fallback Standard Size Selector when no custom attributes exist on variants */
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f8576]">
                                                Select Size: <span className="text-[#eae1d4] ml-1">{fallbackSize}</span>
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
                                            {defaultSizes.map((size) => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => setFallbackSize(size)}
                                                    className={`py-3 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer border ${
                                                        fallbackSize === size
                                                            ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                                            : 'bg-[#151310] text-[#eae1d4] border-[#29231b] hover:border-[#d4af37]/60 hover:bg-[#1a1714]'
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>

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
                                )}

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
                                            onClick={() => setQuantity(q => Math.min(effectiveStock, q + 1))}
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
                                        disabled={effectiveStock <= 0}
                                        onClick={() => {
                                            const variantLabel = activeVariant?.attributes
                                                ? Object.entries(activeVariant.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')
                                                : `Size: ${fallbackSize}`;
                                            showNotification(`Added ${quantity} item(s) (${variantLabel}) to Bag`);
                                        }}
                                        className={`flex-1 group relative overflow-hidden rounded bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] active:scale-[0.98] ${effectiveStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span>{effectiveStock > 0 ? 'Add To Cart' : 'Out of Stock'}</span>
                                    </button>

                                    {/* BUY NOW Button */}
                                    <button
                                        type="button"
                                        disabled={effectiveStock <= 0}
                                        onClick={() => showNotification("Proceeding to Express Checkout...")}
                                        className={`flex-1 group relative overflow-hidden rounded bg-gradient-to-r from-[#d4af37] via-[#f7d56e] to-[#d4af37] text-black py-4 px-6 text-xs font-extrabold uppercase tracking-[0.22em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.55)] hover:brightness-105 active:scale-[0.98] ${effectiveStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
