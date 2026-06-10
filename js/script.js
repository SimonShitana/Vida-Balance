// ===============================
// MOBILE MENU TOGGLE
// ===============================
const mobileMenuBtn =
    document.getElementById(
        'mobileMenuBtn'
    );

const mobileMenu =
    document.getElementById(
        'mobileMenu'
    );

if (mobileMenuBtn && mobileMenu) {

    mobileMenuBtn.addEventListener(
        'click',
        () => {

            mobileMenu.classList.toggle(
                'active'
            );
        }
    );
}

// ===============================
// CLOSE MOBILE MENU ON LINK CLICK
// ===============================
document.querySelectorAll(
    '.mobile-link'
).forEach(link => {

    link.addEventListener(
        'click',
        () => {

            if (mobileMenu) {

                mobileMenu.classList.remove(
                    'active'
                );
            }
        }
    );
});

// ===============================
// SMOOTH SCROLL
// ===============================
document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {

    anchor.addEventListener(
        'click',
        function(e) {

            e.preventDefault();

            const target =
                document.querySelector(
                    this.getAttribute('href')
                );

            if (target) {

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                if (mobileMenu) {

                    mobileMenu.classList.remove(
                        'active'
                    );
                }
            }
        }
    );
});

// ===============================
// DOWNLOAD PDF FUNCTION
// ===============================
function downloadGameGuide() {

    const link =
        document.createElement('a');

    link.href =
        './assets/pdfs/Official_Game_Guide.pdf';

    link.setAttribute(
        'download',
        'Official_Game_Guide.pdf'
    );

    link.target = '_self';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    showNotification(
        '📥 Download started successfully!'
    );
}

// ===============================
// NOTIFICATION FUNCTION
// ===============================
function showNotification(message) {

    const notification =
        document.createElement('div');

    notification.textContent =
        message;

    notification.style.position =
        'fixed';

    notification.style.bottom =
        '20px';

    notification.style.right =
        '20px';

    notification.style.background =
        '#2c5f2d';

    notification.style.color =
        '#fff';

    notification.style.padding =
        '14px 22px';

    notification.style.borderRadius =
        '12px';

    notification.style.fontWeight =
        '600';

    notification.style.zIndex =
        '9999';

    notification.style.boxShadow =
        '0 4px 15px rgba(0,0,0,0.2)';

    notification.style.opacity =
        '0';

    notification.style.transform =
        'translateY(20px)';

    notification.style.transition =
        'all 0.3s ease';

    document.body.appendChild(
        notification
    );

    setTimeout(() => {

        notification.style.opacity =
            '1';

        notification.style.transform =
            'translateY(0)';

    }, 50);

    setTimeout(() => {

        notification.style.opacity =
            '0';

        notification.style.transform =
            'translateY(20px)';

        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 3000);
}

// ===============================
// DOWNLOAD BUTTON
// ===============================
const downloadBtn =
    document.getElementById(
        'downloadGuideBtn'
    );

if (downloadBtn) {

    downloadBtn.addEventListener(
        'click',
        downloadGameGuide
    );
}

// ===============================
// PLAY GAME FUNCTION
// ===============================
function launchGame() {

    // GO DIRECTLY TO GAME
    window.location.href =
        'game.html';
}

// ===============================
// PLAY BUTTONS
// ===============================
const playNowBtn =
    document.getElementById(
        'playNowBtn'
    );

const ctaPlayBtn =
    document.getElementById(
        'ctaPlayBtn'
    );

if (playNowBtn) {

    playNowBtn.addEventListener(
        'click',
        launchGame
    );
}

if (ctaPlayBtn) {

    ctaPlayBtn.addEventListener(
        'click',
        launchGame
    );
}

// ===============================
// TRAILER MODAL
// ===============================
const watchTrailerBtn =
    document.getElementById(
        'watchTrailerBtn'
    );

const trailerModal =
    document.getElementById(
        'trailerModal'
    );

const modalClose =
    document.querySelector(
        '.modal-close'
    );

if (
    watchTrailerBtn &&
    trailerModal
) {

    watchTrailerBtn.addEventListener(
        'click',
        () => {

            trailerModal.classList.add(
                'active'
            );
        }
    );
}

if (
    modalClose &&
    trailerModal
) {

    modalClose.addEventListener(
        'click',
        () => {

            trailerModal.classList.remove(
                'active'
            );
        }
    );
}

// ===============================
// CLOSE MODAL OUTSIDE CLICK
// ===============================
window.addEventListener(
    'click',
    (e) => {

        if (
            trailerModal &&
            e.target === trailerModal
        ) {

            trailerModal.classList.remove(
                'active'
            );
        }
    }
);

// ===============================
// PILLAR BAR ANIMATION
// ===============================
const observerOptions = {

    threshold: 0.3,
    rootMargin: '0px'
};

const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    const bars =
                        entry.target.querySelectorAll(
                            '.pillar-fill'
                        );

                    bars.forEach(bar => {

                        const width =
                            bar.style.width;

                        bar.style.width =
                            '0';

                        setTimeout(() => {

                            bar.style.width =
                                width;

                        }, 100);
                    });

                    observer.unobserve(
                        entry.target
                    );
                }
            });

        },
        observerOptions
    );

const statsSection =
    document.querySelector(
        '.stats-preview'
    );

if (statsSection) {

    observer.observe(
        statsSection
    );
}

// ===============================
// NAVBAR SCROLL EFFECT
// ===============================
window.addEventListener(
    'scroll',
    () => {

        const navbar =
            document.querySelector(
                '.navbar'
            );

        if (!navbar) return;

        if (window.scrollY > 50) {

            navbar.style.background =
                'rgba(26,42,26,0.98)';

            navbar.style.boxShadow =
                '0 2px 20px rgba(0,0,0,0.1)';

        } else {

            navbar.style.background =
                'rgba(26,42,26,0.95)';

            navbar.style.boxShadow =
                'none';
        }
    }
);

// ===============================
// HERO NUMBER ANIMATION
// ===============================
function animateNumbers() {

    const statNumbers =
        document.querySelectorAll(
            '.stat-number'
        );

    statNumbers.forEach(el => {

        const target =
            parseInt(el.innerText);

        if (
            !isNaN(target) &&
            !el.hasAttribute(
                'data-animated'
            )
        ) {

            el.setAttribute(
                'data-animated',
                'true'
            );

            let current = 0;

            const increment =
                target / 50;

            const timer =
                setInterval(() => {

                    current += increment;

                    if (
                        current >= target
                    ) {

                        el.innerText =
                            target;

                        clearInterval(
                            timer
                        );

                    } else {

                        el.innerText =
                            Math.floor(
                                current
                            );
                    }

                }, 20);
        }
    });
}

const heroObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    animateNumbers();

                    heroObserver.unobserve(
                        entry.target
                    );
                }
            });

        },
        {
            threshold: 0.5
        }
    );

const heroSection =
    document.querySelector(
        '.hero'
    );

if (heroSection) {

    heroObserver.observe(
        heroSection
    );
}

// ===============================
// KEYBOARD SHORTCUTS
// ===============================
document.addEventListener(
    'keydown',
    (e) => {

        // G = PLAY GAME
        if (
            e.key === 'g' ||
            e.key === 'G'
        ) {

            window.location.href =
                'game.html';
        }

        // D = DOWNLOAD GUIDE
        if (
            e.key === 'd' ||
            e.key === 'D'
        ) {

            downloadGameGuide();
        }
    }
);

// ===============================
// CONSOLE MESSAGE
// ===============================
console.log(
    '%c🎮 VIDA: BALANCE - Master the Art of Living',
    'color:#d4a017;font-size:16px;font-weight:bold;'
);

console.log(
    '%c🎲 Press PLAY to launch game.html',
    'color:#2c5f2d;font-size:12px;'
);