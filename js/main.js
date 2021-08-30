// Введите ваш город
const headerCityButton = document.querySelector('.header__city-button');

if (localStorage.getItem('urban-location')) {
  headerCityButton.textContent = localStorage.getItem('urban-location');
}

headerCityButton.addEventListener('click', () => {
  const city = prompt('Укажите ваш город!');
  localStorage.setItem('urban-location', city);
  if (city === '') {
    headerCityButton.textContent = 'Ваш город ?';
  }
  else {
    headerCityButton.textContent = city;
  }
});

// Блокировка скролла при открытии модального окна

const disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth;
  document.body.dbScrollY = window.scrollY;
  document.body.style.cssText = `
  position: fixed;
  top: ${-window.scrollY}px;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  padding-right: ${widthScroll}px;
  `;
};

const enableScroll = () => {
  document.body.style.cssText = '';
  window.scroll({ top: document.body.dbScrollY, });
};


// Модальное окно корзины

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartModalOpen = () => {
  cartOverlay.classList.add('cart-overlay-open');
  disableScroll();
};
const cartModalClose = () => {
  cartOverlay.classList.remove('cart-overlay-open');
  enableScroll();
};

subheaderCart.addEventListener('click', cartModalOpen);
cartOverlay.addEventListener('click', event => {
  const target = event.target;
  if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
    cartModalClose();
  }
});