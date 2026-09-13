import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

/* ─── Constants ─────────────────────────────────────────── */
const CURRENCIES = [
  { value: "USD", label: "USD ($) · United States" },
  { value: "EUR", label: "EUR (€) · Eurozone" },
  { value: "GBP", label: "GBP (£) · Great Britain" },
  { value: "INR", label: "INR (₹) · India" },
  { value: "CHF", label: "CHF (Fr) · Switzerland" },
];

const IMAGE_SLOTS = [
  { id: 0, label: "Primary Cover", hint: "Lead hero image (Required)", isPrimary: true },
  { id: 1, label: "Front View",    hint: "Full frontal drape" },
  { id: 2, label: "Back View",     hint: "Posterior silhouette" },
  { id: 3, label: "Fabric Detail", hint: "Weave & fiber close-up" },
  { id: 4, label: "Lining",        hint: "Buttons & closures" },
  { id: 5, label: "On Model",      hint: "Editorial proportion" },
  { id: 6, label: "Auth Tag",      hint: "Serial tag / hallmark" },
];

const MAX_DESC = 1200;

/* ─── Sub-components ─────────────────────────────────────── */

function SnitchLogo({ size = 40 }) {
  const h = size;
  const w = Math.round(h * 4.2);
  return (
    <svg width={w} height={h} viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SNITCH">
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f2ca50" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#a07d1c" />
        </linearGradient>
      </defs>
      <text x="0" y="82" fontFamily="'Playfair Display', Georgia, serif" fontSize="90" fontWeight="700" letterSpacing="8" fill="url(#logoGold)">
        SNITCH
      </text>
    </svg>
  );
}

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontFamily: "'Inter', sans-serif",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#d4af37",
        marginBottom: "12px",
      }}
    >
      {children}
    </label>
  );
}

function BottomBorderInput({ id, type = "text", placeholder, value, onChange, required, min, step }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      step={step}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${focused ? "#d4af37" : "#4d4635"}`,
        color: "#eae1d4",
        fontSize: "16px",
        padding: "12px 0",
        outline: "none",
        transition: "border-color 0.2s",
        fontFamily: "'Inter', sans-serif",
        boxSizing: "border-box",
      }}
    />
  );
}

function BottomBorderTextarea({ id, placeholder, value, onChange, rows = 5, maxLength }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      maxLength={maxLength}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${focused ? "#d4af37" : "#4d4635"}`,
        color: "#eae1d4",
        fontSize: "16px",
        padding: "12px 0",
        outline: "none",
        transition: "border-color 0.2s",
        fontFamily: "'Inter', sans-serif",
        resize: "vertical",
        boxSizing: "border-box",
      }}
    />
  );
}

function BottomBorderSelect({ id, value, onChange, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: "#1f1b13",
        border: "none",
        borderBottom: `1px solid ${focused ? "#d4af37" : "#4d4635"}`,
        color: "#eae1d4",
        fontSize: "14px",
        padding: "12px 28px 12px 0",
        outline: "none",
        transition: "border-color 0.2s",
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='1.5'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 4px center",
        backgroundSize: "18px",
        boxSizing: "border-box",
      }}
    >
      {children}
    </select>
  );
}

function ImageSlot({ slot, image, onImageSelect, onRemove }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) onImageSelect(slot.id, file);
    },
    [slot.id, onImageSelect]
  );

  const slotStyle = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: image ? "default" : "pointer",
    transition: "all 0.3s",
    overflow: "hidden",
    border: `2px dashed ${dragging ? "#d4af37" : image ? "#d4af37" : slot.isPrimary ? "rgba(212,175,55,0.55)" : "rgba(77,70,53,0.8)"}`,
    background: image ? "transparent" : slot.isPrimary ? "rgba(17,14,7,0.8)" : "rgba(17,14,7,0.5)",
    padding: "16px",
    aspectRatio: "1/1",
    ...(slot.isPrimary ? { gridColumn: "span 2", gridRow: "span 2" } : {}),
  };

  return (
    <div
      style={slotStyle}
      onClick={() => !image && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageSelect(slot.id, file);
        }}
      />

      {image ? (
        <>
          <img
            src={image.preview}
            alt={slot.label}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(slot.id); }}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              zIndex: 20,
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(13,13,13,0.85)",
              border: "1px solid #4d4635",
              color: "#eae1d4",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d4af37"; e.currentTarget.style.color = "#d4af37"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#4d4635"; e.currentTarget.style.color = "#eae1d4"; }}
            aria-label={`Remove ${slot.label}`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 8px", background: "rgba(13,13,13,0.7)" }}>
            <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", color: "#d4af37", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
              {slot.label}
            </span>
          </div>
        </>
      ) : slot.isPrimary ? (
        <>
          <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(212,175,55,0.4)", borderRadius: "9999px", marginBottom: "12px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", color: "#d4af37", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", display: "block" }}>
            Primary Cover
          </span>
          <span style={{ fontSize: "11px", color: "rgba(208,197,175,0.55)", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>
            {slot.hint}
          </span>
          <span style={{ marginTop: "12px", padding: "2px 8px", fontSize: "9px", letterSpacing: "0.14em", fontWeight: 600, color: "#d4af37", textTransform: "uppercase", border: "1px solid rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}>
            Main Display
          </span>
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(208,197,175,0.4)" strokeWidth="1.2" strokeLinecap="round" style={{ marginBottom: "6px" }}>
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", color: "#eae1d4", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
            {slot.label}
          </span>
          <span style={{ fontSize: "9px", color: "rgba(208,197,175,0.45)", marginTop: "2px", fontFamily: "'Inter', sans-serif" }}>
            {slot.hint}
          </span>
        </>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "USD",
  });

  const [images, setImages] = useState(Array(7).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageSelect = useCallback((slotId, file) => {
    const preview = URL.createObjectURL(file);
    setImages((prev) => {
      const next = [...prev];
      if (next[slotId]?.preview) URL.revokeObjectURL(next[slotId].preview);
      next[slotId] = { file, preview };
      return next;
    });
  }, []);

  const handleRemoveImage = useCallback((slotId) => {
    setImages((prev) => {
      const next = [...prev];
      if (next[slotId]?.preview) URL.revokeObjectURL(next[slotId].preview);
      next[slotId] = null;
      return next;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("priceAmount", formData.priceAmount);
      fd.append("priceCurrency", formData.priceCurrency);
      images.forEach((img) => {
        if (img?.file) fd.append("images", img.file);
      });
      await handleCreateProduct(fd);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const descLen = formData.description.length;
  const uploadedCount = images.filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0D0D0D", color: "#eae1d4", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Top Nav ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", height: "72px", background: "rgba(13,13,13,0.82)", backdropFilter: "blur(20px)", borderBottom: "1px solid #38342b" }}>
        <SnitchLogo size={28} />
        <nav style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {["Collections", "Lookbook", "About"].map((item) => (
            <span
              key={item}
              style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#99907c", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#99907c")}
            >
              {item}
            </span>
          ))}
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d4af37", borderBottom: "1px solid #d4af37", paddingBottom: "2px" }}>
            Seller Studio
          </span>
        </nav>
      </header>

      {/* ── Main ── */}
      <main style={{ paddingTop: "120px", paddingBottom: "96px", paddingLeft: "64px", paddingRight: "64px", maxWidth: "1440px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: "40px" }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#99907c", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", display: "inline-flex", alignItems: "center", gap: "8px", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#99907c")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Inventory
          </button>
        </div>

        {/* Page Header */}
        <div style={{ borderBottom: "1px solid #38342b", paddingBottom: "48px", marginBottom: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
          <div>
            <span style={{ display: "block", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d4af37", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>
              Curator Portal · Catalog Management
            </span>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#eae1d4", margin: "0 0 16px 0" }}>
              New Creation
            </h1>
            <p style={{ fontSize: "16px", color: "#99907c", lineHeight: "26px", maxWidth: "540px", margin: 0, fontWeight: 300 }}>
              Submit a bespoke piece or archival seasonal creation to the SNITCH luxury catalog. Every item undergoes authentication by our sartorial curators.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", border: "1px solid #38342b", background: "#110e07", padding: "10px 18px", flexShrink: 0 }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#d4af37", display: "inline-block", animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }} />
            <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#eae1d4", fontFamily: "'Inter', sans-serif" }}>
              Draft In Progress
            </span>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ background: "rgba(147,0,10,0.15)", border: "1px solid #93000a", color: "#ffb4ab", padding: "14px 20px", marginBottom: "40px", fontSize: "14px", fontFamily: "'Inter', sans-serif" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── Section 1: Core Identity ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "64px", paddingBottom: "64px" }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#eae1d4", marginBottom: "12px", marginTop: 0 }}>
                Core Identity
              </h2>
              <p style={{ fontSize: "14px", color: "#99907c", lineHeight: "22px", fontWeight: 300, margin: 0 }}>
                Articulate the defining nomenclature and editorial narrative of this sartorial piece.
              </p>
            </div>
            <div style={{ background: "rgba(31,27,19,0.6)", border: "1px solid rgba(77,70,53,0.6)", padding: "40px", boxSizing: "border-box" }}>
              <div style={{ marginBottom: "40px" }}>
                <FieldLabel htmlFor="title">Creation Title *</FieldLabel>
                <BottomBorderInput
                  id="title"
                  type="text"
                  placeholder="e.g., Aurum Obscura Wool Overcoat"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <FieldLabel htmlFor="description">Editorial Description *</FieldLabel>
                  <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: descLen > MAX_DESC * 0.9 ? "#ffb4ab" : "rgba(153,144,124,0.6)", fontFamily: "'Inter', sans-serif" }}>
                    {descLen} / {MAX_DESC}
                  </span>
                </div>
                <BottomBorderTextarea
                  id="description"
                  placeholder="Detail the fabric composition, structure, artisan hand-finishes, and care instructions..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  maxLength={MAX_DESC}
                />
                <p style={{ fontSize: "12px", color: "rgba(153,144,124,0.6)", marginTop: "10px", fontStyle: "italic", fontWeight: 300, margin: "10px 0 0 0" }}>
                  Include fabric composition, silhouette drape guidance, and artisanal craftsmanship details.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(56,52,43,0.6)", marginBottom: "64px" }} />

          {/* ── Section 2: Valuation ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "64px", paddingBottom: "64px" }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#eae1d4", marginBottom: "12px", marginTop: 0 }}>
                Valuation & Exchange
              </h2>
              <p style={{ fontSize: "14px", color: "#99907c", lineHeight: "22px", fontWeight: 300, margin: 0 }}>
                Set the baseline acquisition value. Tax configurations and luxury transport are calculated upon sale.
              </p>
            </div>
            <div style={{ background: "rgba(31,27,19,0.6)", border: "1px solid rgba(77,70,53,0.6)", padding: "40px", boxSizing: "border-box" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
                <div>
                  <FieldLabel htmlFor="priceAmount">Acquisition Price *</FieldLabel>
                  <BottomBorderInput
                    id="priceAmount"
                    type="number"
                    placeholder="2450.00"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    required
                    min="1"
                    step="0.01"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="priceCurrency">Currency *</FieldLabel>
                  <BottomBorderSelect id="priceCurrency" value={formData.priceCurrency} onChange={handleChange}>
                    {CURRENCIES.map((c) => (
                      <option key={c.value} value={c.value} style={{ background: "#1f1b13" }}>
                        {c.label}
                      </option>
                    ))}
                  </BottomBorderSelect>
                </div>
              </div>
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(77,70,53,0.4)", display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <p style={{ fontSize: "12px", color: "#99907c", lineHeight: "20px", margin: 0, fontWeight: 300 }}>
                  <span style={{ color: "#eae1d4", fontWeight: 500 }}>SNITCH Concierge Guarantee: </span>
                  Verified listings are featured across our private client advisory channels with insured international courier transit.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(56,52,43,0.6)", marginBottom: "64px" }} />

          {/* ── Section 3: Media Upload ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "64px", paddingBottom: "64px" }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#eae1d4", marginBottom: "12px", marginTop: 0 }}>
                Media & Editorial Assets
              </h2>
              <p style={{ fontSize: "14px", color: "#99907c", lineHeight: "22px", fontWeight: 300, margin: "0 0 24px 0" }}>
                Upload high-resolution editorial photography. A minimum of 7 angles is required for authentication.
              </p>
              <div style={{ background: "#110e07", border: "1px solid rgba(77,70,53,0.5)", padding: "16px 20px", marginBottom: "20px" }}>
                <span style={{ display: "block", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d4af37", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>
                  Asset Standards
                </span>
                <ul style={{ fontSize: "12px", color: "#99907c", lineHeight: "20px", margin: 0, padding: "0 0 0 16px", fontWeight: 300 }}>
                  <li>Raw or chiaroscuro editorial lighting</li>
                  <li>Stone or architectural backdrops preferred</li>
                  <li>Lossless resolution (Min: 3000 × 4000 px)</li>
                  <li>No watermark overlays</li>
                </ul>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "32px", fontWeight: 700, color: "#d4af37", fontFamily: "'Playfair Display', serif" }}>
                  {uploadedCount}
                </span>
                <span style={{ fontSize: "12px", color: "#99907c", lineHeight: "18px", fontFamily: "'Inter', sans-serif" }}>
                  of 7 slots<br />uploaded
                </span>
              </div>
            </div>

            <div style={{ background: "rgba(31,27,19,0.6)", border: "1px solid rgba(77,70,53,0.6)", padding: "40px", boxSizing: "border-box" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gridTemplateRows: "repeat(2, 1fr)",
                  gap: "12px",
                }}
              >
                {IMAGE_SLOTS.map((slot) => (
                  <ImageSlot
                    key={slot.id}
                    slot={slot}
                    image={images[slot.id]}
                    onImageSelect={handleImageSelect}
                    onRemove={handleRemoveImage}
                  />
                ))}
              </div>
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "rgba(153,144,124,0.6)", fontFamily: "'Inter', sans-serif" }}>
                  Click or drag & drop into any slot · JPG, PNG, WEBP
                </span>
                <button
                  type="button"
                  onClick={() => setImages(Array(7).fill(null))}
                  style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d4af37", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Inter', sans-serif", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* ── CTA Footer ── */}
          <div style={{ borderTop: "1px solid #38342b", paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              <button
                type="button"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#99907c", background: "none", border: "1px solid #38342b", padding: "14px 24px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#eae1d4"; e.currentTarget.style.color = "#eae1d4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#38342b"; e.currentTarget.style.color = "#99907c"; }}
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#99907c", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s", padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffb4ab")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#99907c")}
              >
                Discard
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? "rgba(212,175,55,0.5)" : "#d4af37",
                color: "#000",
                border: "none",
                padding: "18px 48px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: submitting ? "none" : "0 0 28px rgba(212,175,55,0.22)",
              }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "#e9c349"; }}
              onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = "#d4af37"; }}
            >
              {submitting ? "Publishing…" : "Publish Product"}
            </button>
          </div>
        </form>
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "#110e07", borderTop: "1px solid #38342b", padding: "40px 64px", marginTop: "auto", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <SnitchLogo size={20} />
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#99907c", fontFamily: "'Inter', sans-serif" }}>
            © 2024 SNITCH Luxury. All Rights Reserved.
          </span>
          <div style={{ display: "flex", gap: "32px" }}>
            {["Privacy Policy", "Terms", "Shipping", "Returns"].map((link) => (
              <span
                key={link}
                style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#99907c", cursor: "pointer", transition: "color 0.2s", fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#99907c")}
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreateProduct;