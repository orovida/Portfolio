const cursor = document.getElementById('cursor');
const moreLinksButton = document.querySelector('.more-links');
const linksPopup = document.querySelector('.links-popup');
const linksPopupClose = document.querySelector('.links-popup-close');
const projectEmailLink = document.querySelector('[data-email-link]');
let lastFocusedElement = null;

function openLinksPopup() {
    lastFocusedElement = document.activeElement;
    linksPopup.hidden = false;
    document.body.style.overflow = 'hidden';
    linksPopupClose.focus();
}

function closeLinksPopup() {
    linksPopup.hidden = true;
    document.body.style.overflow = '';
    lastFocusedElement?.focus();
}

moreLinksButton.addEventListener('click', openLinksPopup);
linksPopupClose.addEventListener('click', closeLinksPopup);
linksPopup.addEventListener('click', (event) => { if (event.target === linksPopup) closeLinksPopup(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !linksPopup.hidden) closeLinksPopup(); });

projectEmailLink.addEventListener('click', () => {
    window.location.href = projectEmailLink.href;
});

function animateWithGsap() {
    if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.getElementById('loader')?.remove();
        return;
    }

    gsap.set('#loader', { display: 'flex' });
    gsap.timeline()
        .to('.loader-text', { opacity: 1, duration: 0.5 })
        .to('.loader-line', { width: '100%', duration: 1, ease: 'power2.inOut' })
        .to('.loader-text', { letterSpacing: '5px', opacity: 0, duration: 0.5 })
        .to('#loader', { height: 0, duration: 0.8, ease: 'power4.inOut' })
        .set('.hero h1', { y: '120%' })
        .set('.hero-desc', { opacity: 0, y: 20 })
        .set('.profile-box', { opacity: 0, scale: 0.5, rotation: -10 })
        .to('.hero h1', { y: 0, stagger: 0.1, duration: 1, ease: 'power4.out' }, '-=0.4')
        .to('.hero-desc', { opacity: 1, y: 0, duration: 1 }, '-=0.8')
        .to('.profile-box', { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)' }, '-=1')
        .to('.profile-box', { className: 'profile-box active', duration: 0 })
        .to('.aurora-blob', { opacity: 0.15, scale: 1, duration: 2 }, '-=1.5');

    if (typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal-card').forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%' } });
    });
    gsap.utils.toArray('.reveal-text').forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: element, start: 'top 90%' } });
    });
    gsap.fromTo('.reveal-big', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 80%' } });
    gsap.to('.progress-bar', { width: '100%', ease: 'none', scrollTrigger: { scrub: 0.3 } });
}

if (cursor && typeof gsap !== 'undefined') {
    let pointerX = 0;
    let pointerY = 0;
    let cursorFrame = null;
    const updateCursor = () => {
        cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
        cursorFrame = null;
    };
    window.addEventListener('mousemove', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (cursorFrame === null) cursorFrame = requestAnimationFrame(updateCursor);
    }, { passive: true });
    document.querySelectorAll('.magnetic-target').forEach((element) => {
        element.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 1.5, duration: 0.15, overwrite: true }));
        element.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.15, overwrite: true });
            gsap.to(element, { x: 0, y: 0, duration: 0.35, ease: 'power2.out', overwrite: true });
        });
        element.addEventListener('mousemove', (event) => {
            const rect = element.getBoundingClientRect();
            gsap.to(element, { x: (event.clientX - rect.left - rect.width / 2) * 0.12, y: (event.clientY - rect.top - rect.height / 2) * 0.12, duration: 0.12, ease: 'power2.out', overwrite: true });
        });
    });
}

window.addEventListener('load', animateWithGsap);

if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis();
    if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
}
