// which nav has active
const navs = document.querySelectorAll('.nav-item');
const pagePath = window.location.pathname;
for (const nav of navs) {
  const navPath = nav.getAttribute('data-path');
  if (navPath && navPath === pagePath) {
    nav.className = 'nav-item active';
  }
}
