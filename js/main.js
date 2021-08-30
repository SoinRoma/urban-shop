
// Введите ваш город
const headerCityButton = document.querySelector('.header__city-button');
if (localStorage.getItem('urban-location')) {
  headerCityButton.textContent = localStorage.getItem('urban-location');
}

// Хэш элемент для изменения содержимого страниц
let hash = location.hash.substring(1);

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

// Отмены блокировки скролла
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

// Запрос в базу данных
const getData = async () => {
  const data = await fetch('db.json');
  if (data.ok) {
    return data.json();
  }
  else {
    throw new Error(`Данные не были полученыб ошибка ${data.status} ${data.statusText}`);
  }
};

const getGoods = (callback, value) => {
  getData()
  .then(data => {
    if (value) {
      callback(data.filter(item => item.category === value));
    }
    else {
      callback(data);
    }
  })
  .catch(err => {
    console.error(err);
  });
};


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

subheaderCart.addEventListener('click', cartModalOpen);
cartOverlay.addEventListener('click', event => {
  const target = event.target;
  if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
    cartModalClose();
  }
});

// Страница товаров
try {
  const goodsList = document.querySelector('.goods__list');
  const goodsTitle = document.querySelector('.goods__title');
  const changeTitle = () => {
    goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
  };
  const createCard = ({ id, preview, cost, brand, name, sizes }) => {
    const li = document.createElement('li');
    li.classList.add('goods__item');
    li.innerHTML = `
    <article class="good">
      <a class="good__link-img" href="card-good.html#${id}">
        <img class="good__img" src="goods-image/${preview}" alt="">
      </a>
      <div class="good__description">
        <p class="good__price">${cost} &#8381;</p>
        <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
        ${sizes ?
      `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
      ''}
        <a class="good__link" href="card-good.html#${id}">Подробнее</a>
      </div>
    </article>
    `;
    return li;
  };

  const renderGoodsList = data => {
    goodsList.textContent = '';
    data.forEach(item => {
      const card = createCard(item);
      goodsList.append(card);
    });
  };

  // Изменение содержимого при смене страниц
  window.addEventListener('hashchange', () => {
    hash = location.hash.substring(1);
    getGoods(renderGoodsList, hash);
    changeTitle();
  });

  getGoods(renderGoodsList, hash);
  changeTitle();
}
catch (err) {
  console.warn(err);
}