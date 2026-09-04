const modal = document.getElementById('video-modal');
const player = document.getElementById('modal-player');
const cursor = document.getElementById('cursor');
let lastFocusedElement = null;

function animateWithGsap() {
    if (typeof gsap === 'undefined') {
        document.getElementById('loader')?.remove();
        return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.getElementById('loader')?.remove();
        return;
    }

    gsap.set('#loader', { display: 'flex' });
    const timeline = gsap.timeline();
    timeline.to('.loader-text', { opacity: 1, duration: 0.5 })
        .to('.loader-line', { width: '100%', duration: 1, ease: 'power2.inOut' })
        .to('.loader-text', { letterSpacing: '5px', opacity: 0, duration: 0.5 })
        .to('#loader', { height: 0, duration: 0.8, ease: 'power4.inOut' })
        .set('.hero h1', { y: '120%' })
        .set('.hero-desc', { opacity: 0, y: 20 })
        .set('.profile-box', { opacity: 0, scale: 0.5, rotation: -10 })
        .to('.hero h1', { y: 0, stagger: 0.1, duration: 1, ease: 'power4.out' }, '-=0.4')
        .to('.hero-desc', { opacity: 1, y: 0, duration: 1 }, '-=0.8')
        .to('.profile-box', { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)' }, '-=1')
        .to('.profile-box', { className: 'profile-box active' }, '-=0.5')
        .to('.aurora-blob', { opacity: 0.15, scale: 1, duration: 2 }, '-=1.5');

    if (typeof ScrollTrigger !== 'undefined') {
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
}

function openVideo(file, trigger) {
    lastFocusedElement = trigger || document.activeElement;
    const isLocalVideo = /\.(mp4|m4v)$/i.test(file);
    player.replaceChildren();

    if (isLocalVideo) {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.src = file;
        player.append(video);
    } else {
        const frame = document.createElement('iframe');
        frame.src = `https://drive.google.com/file/d/${encodeURIComponent(file)}/preview`;
        frame.title = 'Video player';
        frame.allow = 'autoplay; fullscreen';
        frame.allowFullscreen = true;
        player.append(frame);
    }

    modal.hidden = false;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.close-btn').focus();
    if (typeof gsap !== 'undefined') gsap.to(modal, { opacity: 1, duration: 0.4 });
    else modal.style.opacity = '1';
}

function closeModal() {
    const finish = () => {
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        player.replaceChildren();
        document.body.style.overflow = '';
        lastFocusedElement?.focus();
    };
    if (typeof gsap !== 'undefined') gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: finish });
    else finish();
}

document.querySelectorAll('.video-card').forEach((card) => {
    card.addEventListener('click', () => openVideo(card.dataset.video, card));
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openVideo(card.dataset.video, card);
        }
    });
});

document.querySelectorAll('.video-card video').forEach((video) => {
    const card = video.closest('.video-card');
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

document.querySelector('.close-btn').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
window.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || modal.hidden) return;
    const focusable = [...modal.querySelectorAll('button, video, iframe, [href], [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
});

if (cursor && typeof gsap !== 'undefined') {
    window.addEventListener('mousemove', (event) => gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.1 }));
    document.querySelectorAll('.magnetic-target').forEach((element) => {
        element.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 1.5 }));
        element.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1 });
            gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        });
        element.addEventListener('mousemove', (event) => {
            const rect = element.getBoundingClientRect();
            gsap.to(element, { x: (event.clientX - rect.left - rect.width / 2) * 0.2, y: (event.clientY - rect.top - rect.height / 2) * 0.2, duration: 0.3 });
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
