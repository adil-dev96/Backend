import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";

export default function Login() {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin({
                email: formData.email,
                password: formData.password,
            });
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col md:flex-row"
            style={{ background: "#0D0D0D", color: "#eae1d4", fontFamily: "'Inter', sans-serif" }}
        >

            {/* ── LEFT PANEL ── */}
            <div
                className="hidden md:flex md:w-[40%] h-screen relative items-center justify-center overflow-hidden"
                style={{ background: "#1a1a1a" }}
            >
                {/* Hero image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFAJDZsi6oy60jeIRvLECQzGRXTaXmG-S9izbBLApDLU41jLwt75f4ujWrI10UtGS4m3vUwxY3nR8W0V-JDFWTeDlodSEGlNJU0mARk8mYgWSI8z5JyI-f5k6eptG7JvV9KCgxUBbQ-3Gi8a3RGQfDyuv4oxxtTAyhYfepTH_VRw77SAzwgup617ivp_dvmyfKXI-x4i4lPLPemPLq7fIxXCLbS93r9jbfocBkTT2-lsGj33PZE0mRX28iRM1MlYNfhg2e9LEK5jm3')",
                    }}
                />
                {/* Dark gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, #0D0D0D 0%, rgba(13,13,13,0.15) 50%, transparent 100%)" }}
                />
                {/* Gold tint */}
                <div
                    className="absolute inset-0"
                    style={{ background: "rgba(212,175,55,0.08)", mixBlendMode: "overlay" }}
                />

                {/* Logo top-left */}
                <div className="absolute z-10" style={{ top: "40px", left: "40px" }}>
                    <SnitchLogo size={36} />
                </div>

                {/* Centered brand text */}
                <div className="relative z-10 text-center select-none pointer-events-none" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
                    <SnitchLogo size={64} />
                    <p
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "rgba(212,175,55,0.4)",
                            letterSpacing: "0.42em",
                            textTransform: "uppercase",
                        }}
                    >
                        LUXURY FASHION
                    </p>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div
                className="w-full md:w-[60%] min-h-screen flex items-start md:items-center justify-center overflow-y-auto relative"
                style={{ background: "#0D0D0D", padding: "80px 40px" }}
            >
                {/* Mobile logo */}
                <div className="md:hidden absolute" style={{ top: "32px", left: "50%", transform: "translateX(-50%)" }}>
                    <SnitchLogo size={28} />
                </div>

                <div style={{ width: "100%", maxWidth: "440px", marginTop: "0" }}>

                    {/* Heading */}
                    <div style={{ marginBottom: "48px" }}>
                        <h2
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "32px",
                                fontWeight: 600,
                                lineHeight: "40px",
                                color: "#eae1d4",
                                marginBottom: "12px",
                            }}
                        >
                            Sign In
                        </h2>
                        <p style={{ fontSize: "15px", color: "#99907c", lineHeight: "24px" }}>
                            Welcome back to the SNITCH inner circle.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <div style={{ position: "relative", marginBottom: "40px", paddingTop: "20px" }}>
                            <label
                                htmlFor="email"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#99907c",
                                }}
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    background: "transparent",
                                    border: "none",
                                    borderBottom: "1px solid #38342b",
                                    color: "#eae1d4",
                                    fontSize: "16px",
                                    padding: "12px 0",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => (e.target.style.borderBottomColor = "#d4af37")}
                                onBlur={(e) => (e.target.style.borderBottomColor = "#38342b")}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ position: "relative", marginBottom: "40px", paddingTop: "20px" }}>
                            <label
                                htmlFor="password"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#99907c",
                                }}
                            >
                                Password
                            </label>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <PasswordInput
                                    id="password"
                                    showPassword={showPassword}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label="Toggle password visibility"
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "8px",
                                        color: "#99907c",
                                        display: "flex",
                                        alignItems: "center",
                                        transition: "color 0.2s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#99907c")}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                background: "#d4af37",
                                color: "#000",
                                border: "none",
                                padding: "18px 0",
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "13px",
                                fontWeight: 600,
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#e9c349")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#d4af37")}
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Footer link */}
                    <div
                        style={{
                            marginTop: "40px",
                            paddingTop: "32px",
                            borderTop: "1px solid #38342b",
                            textAlign: "center",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "#99907c",
                            }}
                        >
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                style={{
                                    color: "#eae1d4",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "4px",
                                    transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#eae1d4")}
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Sub-components ───────────────────────────── */

/** Clean SVG wordmark — scales via `size` (letter height in px) */
function SnitchLogo({ size = 40 }) {
    const h = size;
    const w = Math.round(h * 4.2); // aspect ratio ~4.2:1
    return (
        <svg
            width={w}
            height={h}
            viewBox="0 0 420 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="SNITCH"
        >
            <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f2ca50" />
                    <stop offset="45%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#a07d1c" />
                </linearGradient>
            </defs>
            <text
                x="0"
                y="82"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="90"
                fontWeight="700"
                letterSpacing="8"
                fill="url(#goldGrad)"
            >
                SNITCH
            </text>
        </svg>
    );
}

function PasswordInput({ id, showPassword, value, onChange }) {
    const [focused, setFocused] = useState(false);
    return (
        <input
            id={id}
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
                flex: 1,
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${focused ? "#d4af37" : "#38342b"}`,
                color: "#eae1d4",
                fontSize: "16px",
                padding: "12px 0",
                paddingRight: "36px",
                outline: "none",
                transition: "border-color 0.2s",
            }}
        />
    );
}

function EyeIcon() {
    return (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
}