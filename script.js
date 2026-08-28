// ---------- SIDEBAR STATE MANAGEMENT ----------
const BREAKPOINT = 860;
const body = document.body;
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileOverlay = document.getElementById('mobileOverlay');

function isMobile() {
    return window.innerWidth <= BREAKPOINT;
}

function setSidebarCollapsed(collapsed) {
    body.classList.toggle('sidebar-collapsed', collapsed);
    if (sidebarToggle) {
        sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    }
    // Save state to localStorage (only for desktop, mobile is always collapsed)
    if (!isMobile()) {
        try {
            localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0');
        } catch (e) {}
    }
}

// ON LOAD: Read saved state from localStorage
(function() {
    let savedCollapsed = false;
    try {
        const saved = localStorage.getItem('sidebarCollapsed');
        savedCollapsed = saved === '1';
    } catch (e) {}
    
    // Mobile: always start collapsed (off-canvas)
    // Desktop: read from saved state, default to expanded
    setSidebarCollapsed(isMobile() || savedCollapsed);
})();

// TOGGLE BUTTON: Only this button controls sidebar state
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        setSidebarCollapsed(!body.classList.contains('sidebar-collapsed'));
    });
}

// Mobile overlay click closes the drawer
if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => setSidebarCollapsed(true));
}

// Escape key closes the mobile drawer
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobile() && !body.classList.contains('sidebar-collapsed')) {
        setSidebarCollapsed(true);
    }
});

// Handle desktop/mobile breakpoint switch
let wasMobile = isMobile();
window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (nowMobile !== wasMobile) {
        if (nowMobile) {
            setSidebarCollapsed(true);
        } else {
            // When going from mobile to desktop, restore the saved state
            let savedCollapsed = false;
            try {
                const saved = localStorage.getItem('sidebarCollapsed');
                savedCollapsed = saved === '1';
            } catch (e) {}
            setSidebarCollapsed(savedCollapsed);
        }
        wasMobile = nowMobile;
    }
});

// IMPORTANT: Clicking nav links does NOT auto-open sidebar.
// No code here automatically expands the sidebar on nav clicks.

// ---------- ACTIVE NAV LINK ----------
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link[data-page]').forEach(a => {
    if (a.getAttribute('data-page') === currentPage) a.classList.add('active');
});

// ---------- SCROLL REVEAL ----------
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));