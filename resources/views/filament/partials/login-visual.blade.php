<style>
    @media (min-width: 1024px) {
        .fi-simple-layout {
            flex-direction: row;
            align-items: stretch;
        }

        .dft-login-visual {
            width: 46%;
            flex-shrink: 0;
        }

        .fi-simple-main-ctn {
            width: 54%;
        }
    }

    .dft-login-visual {
        display: none;
        position: relative;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #080B14;
        background-image:
            linear-gradient(to right, rgba(41, 50, 71, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(41, 50, 71, 0.25) 1px, transparent 1px);
        background-size: 40px 40px;
    }

    @media (min-width: 1024px) {
        .dft-login-visual {
            display: flex;
        }
    }

    .dft-login-visual-glow-a {
        position: absolute;
        top: 15%;
        left: 8%;
        width: 320px;
        height: 320px;
        border-radius: 9999px;
        background: radial-gradient(circle, rgba(35, 136, 255, 0.18) 0%, rgba(8, 11, 20, 0) 70%);
        pointer-events: none;
    }

    .dft-login-visual-glow-b {
        position: absolute;
        bottom: 10%;
        right: 5%;
        width: 340px;
        height: 340px;
        border-radius: 9999px;
        background: radial-gradient(circle, rgba(123, 77, 255, 0.2) 0%, rgba(8, 11, 20, 0) 70%);
        pointer-events: none;
    }

    .dft-login-visual-inner {
        position: relative;
        width: 100%;
        max-width: 420px;
        aspect-ratio: 10 / 9;
        margin: 0 auto;
        filter: drop-shadow(0 0 25px rgba(35, 136, 255, 0.25));
    }
</style>

<div class="dft-login-visual" aria-hidden="true">
    <div class="dft-login-visual-glow-a"></div>
    <div class="dft-login-visual-glow-b"></div>

    <div class="dft-login-visual-inner">
        <svg viewBox="0 0 500 450" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
            <line x1="50" y1="225" x2="450" y2="225" stroke="#293247" stroke-width="1" stroke-dasharray="4 4" />
            <line x1="250" y1="50" x2="250" y2="400" stroke="#293247" stroke-width="1" stroke-dasharray="4 4" />

            <polygon points="250,30 450,390 50,390" stroke="url(#dft-login-tri-1)" stroke-width="2" fill="none" opacity="0.6" />
            <polygon points="250,90 400,360 100,360" stroke="url(#dft-login-tri-2)" stroke-width="1.5" stroke-dasharray="6 6" fill="rgba(123, 77, 255, 0.03)" />
            <polygon points="250,150 330,310 170,310" fill="url(#dft-login-tri-3)" opacity="0.25" />

            <circle cx="250" cy="30" r="5" fill="#28D7E5" />
            <circle cx="450" cy="390" r="5" fill="#7B4DFF" />
            <circle cx="50" cy="390" r="5" fill="#2388FF" />
            <circle cx="250" cy="150" r="4" fill="#FFFFFF" />

            <line x1="250" y1="30" x2="250" y2="150" stroke="#28D7E5" stroke-width="1.5" stroke-dasharray="3 3" />
            <line x1="50" y1="390" x2="170" y2="310" stroke="#2388FF" stroke-width="1.5" stroke-dasharray="3 3" />
            <line x1="450" y1="390" x2="330" y2="310" stroke="#7B4DFF" stroke-width="1.5" stroke-dasharray="3 3" />

            <defs>
                <linearGradient id="dft-login-tri-1" x1="50" y1="30" x2="450" y2="390">
                    <stop offset="0%" stop-color="#28D7E5" />
                    <stop offset="50%" stop-color="#2388FF" />
                    <stop offset="100%" stop-color="#7B4DFF" />
                </linearGradient>
                <linearGradient id="dft-login-tri-2" x1="100" y1="90" x2="400" y2="360">
                    <stop offset="0%" stop-color="#7B4DFF" />
                    <stop offset="100%" stop-color="#28D7E5" />
                </linearGradient>
                <linearGradient id="dft-login-tri-3" x1="170" y1="150" x2="330" y2="310">
                    <stop offset="0%" stop-color="#2388FF" />
                    <stop offset="100%" stop-color="#7B4DFF" />
                </linearGradient>
            </defs>
        </svg>
    </div>
</div>
