import React from 'react'

const ContinueWithGoogle = () => {
    return (
        <a
            href="/api/auth/google"
            aria-label="Continue with Google"
            className="
                flex w-full h-11
                items-center justify-center gap-3
                rounded-[4px]
                border border-[#8e918f]
                bg-[#131314]
                px-5
                font-['Roboto',Arial,sans-serif]
                text-sm font-medium
                text-[#e3e3e3]
                no-underline
                transition
                hover:bg-[#282929]
                hover:shadow-[0_1px_2px_rgba(0,0,0,0.15)]
                active:bg-[#3b3b3b]
            "
        >
            {/* Google G logo */}
            <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                aria-hidden="true"
            >
                <path
                    fill="#4285F4"
                    d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.797 2.715v2.258h2.908c1.702-1.567 2.685-3.875 2.685-6.613Z"
                />
                <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.955-2.182l-2.908-2.258c-.806.54-1.835.86-3.047.86-2.344 0-4.329-1.584-5.04-3.711H.955v2.332A9 9 0 0 0 9 18Z"
                />
                <path
                    fill="#FBBC05"
                    d="M3.96 10.709A5.41 5.41 0 0 1 3.678 9c0-.593.102-1.17.282-1.709V4.959H.955A9 9 0 0 0 0 9c0 1.452.348 2.826.955 4.041L3.96 10.709Z"
                />
                <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.507.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0A9 9 0 0 0 .955 4.959L3.96 7.291C4.671 5.164 6.656 3.58 9 3.58Z"
                />
            </svg>

            <span>Continue with Google</span>
        </a>
    );
};

export default ContinueWithGoogle;