/**
 * activeNav.js
 */
const navs = document.querySelectorAll('.nav-item');
const pagePath = window.location.pathname;
for (const nav of navs) {
  const navPath = nav.getAttribute('data-path');
  if (navPath && navPath === pagePath) {
    nav.className = 'nav-item active';
  }
}

/**
 * backtotop.js
 */
// back to top js
function isHidden() {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > 0) {
    document.querySelector('.back-to-top').className = 'back-to-top';
  } else {
    document.querySelector('.back-to-top').className = 'back-to-top hidden';
  }
}

const backToTop = () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
    delay = 10,
    time = 200;
  let step = Math.ceil((scrollTop * delay) / time);
  let timer = setInterval(() => {
    scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop - step <= 0) {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      clearInterval(timer);
    } else {
      document.documentElement.scrollTop = scrollTop - step;
      document.body.scrollTop = scrollTop - step;
    }
  }, delay);
};

isHidden();
document.addEventListener('scroll', isHidden);
document.querySelector('.go-top').addEventListener('click', backToTop);

/**
 * catalog.js
 */
// catalog js
let catalog = document.getElementById('catalog');
let catalogTopHeight = catalog && catalog.offsetTop;
let tocElement = document.getElementsByClassName('catalog-content')[0];

// 是否固定目录
function changePos() {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > catalogTopHeight - 20) {
    catalog.style = 'position: fixed; top: 20px; bottom: 20px;';
  } else {
    catalog.style = 'position: absolute; top: calc(290px + 88px + 30px)';
  }
}

// 是否激活目录
function isActiveCat() {
  // 可宽限高度值
  let offsetHeight = 20;

  // 当前页面滚动位置距页面顶部的高度值
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  // 页面所有标题列表
  let headerLinkList = document.getElementsByClassName('headerlink');

  // 页面所有目录列表
  let catLinkList = document.getElementsByClassName('toc-link');

  for (let i = 0; i < catLinkList.length; i++) {
    let currentTopCat = headerLinkList[i].offsetTop - offsetHeight;
    let nextTopCat =
      i + 1 === headerLinkList.length
        ? Infinity
        : headerLinkList[i + 1].offsetTop - offsetHeight;

    if (scrollTop >= currentTopCat && scrollTop < nextTopCat) {
      // 目录跟随滚动
      catLinkList[i].className = 'toc-link active';
      tocElement.scrollTop = catLinkList[i].offsetTop - 32;
    } else {
      catLinkList[i].className = 'toc-link';
    }
  }
}

// 窗体高度变化时
function handleResize() {
  let windowHeight = document.documentElement.clientHeight;
  tocElement.setAttribute('style', `height: ${windowHeight - 90}px`);
}

// 小屏下（屏宽小于888px）是否展开目录
function openOrHiddenCatalog() {
  let isHidden = catalog.classList.contains('hidden');
  if (isHidden) {
    catalog.classList.remove('hidden');
  } else {
    catalog.classList.add('hidden');
  }
}

if (catalogTopHeight) {
  changePos();
  isActiveCat();
  handleResize();
  document.addEventListener('scroll', changePos);
  document.addEventListener('scroll', isActiveCat);
  window.addEventListener('resize', handleResize);
  document
    .querySelector('#btn-catalog')
    .addEventListener('click', openOrHiddenCatalog);
}
