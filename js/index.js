window.addEventListener('DOMContentLoaded', () => {
  // Создаем переключение табов на странице
  const tabs = document.querySelectorAll('.tabheader__item');
  const tabsContent = document.querySelectorAll('.tabcontent')
  const tabsParent = document.querySelector('.tabheader__items')

  // скрываем табы
  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    })
  }

  // показать табы
  function showTabContent(item = 0) {
    tabsContent[item].classList.add('show', 'fade');
    tabsContent[item].classList.remove('hide');
    tabs[item].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  // обработчик на переключнеие табов
  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      })
    }
  })
  // на этом функционал переключения табов окончен
  // ____________________________________________________________

  // Устанавливаем таймер "осталось до конца акции"
  const deadline = '2026-05-11';
  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date());
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    const hours = Math.floor((t / (1000 * 60 * 60) % 24));
    const minutes = Math.floor((t / 1000 / 60) % 60);
    const seconds = Math.floor((t / 1000) % 60);

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  };

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    };
  };

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector);
    const days = timer.querySelector('#days');
    const hours = timer.querySelector('#hours');
    const minutes = timer.querySelector('#minutes');
    const seconds = timer.querySelector('#seconds');
    const timeInterval = setInterval(updateClock, 1000);
    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.textContent = getZero(t.days);
      hours.textContent = getZero(t.hours);
      minutes.textContent = getZero(t.minutes);
      seconds.textContent = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      };
    };
  };
  setClock('.timer', deadline);

  // ____________________________________________________________
  // модальные окна
  const modalTrigger = document.querySelectorAll('[data-modal]');
  const modal = document.querySelector('.modal');
  const modalCloseBtn = document.querySelector('[data-close]');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    // если юзер сам открыл модальное окно, то интервал времени, когда модалка открывется автоматически при загрузки сайта отключается
    clearInterval(modalTimerId);
  }

  modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
  });


  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };
  modalCloseBtn.addEventListener('click', closeModal);

  // закрываем кликом на оверлей четко показывая таргетом куда нужно нажать для закрытия (нажатие === modal)
  modal.addEventListener('click', (evt) => {
    if (evt.target === modal) {
      closeModal();
    };
  });

  // закрываем по esc
  document.addEventListener('keydown', (evt) => {
    if (evt.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    };
  });

  // модальное окно открывается автоматически через 9 секунд после загрузки сайта
  // const modalTimerId = setTimeout(openModal, 9000);
  // модальное окно открывается автоматически когда юзер доскроливает до конца сайта (придется работать с координатами страницы)
  function showModalByScroll() {
      if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
        openModal();
        window.removeEventListener('scroll', showModalByScroll);
      }
    };
  window.addEventListener('scroll', showModalByScroll);

  // Используем классы для карточек
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);

      // Свойство для конвертера валюты
      this.transfer = 90;
      this.changeToRUB();
    }

    // конвертер валюты
    changeToRUB() {
      this.price = this.price * this.transfer;
    }

    // Формируем вёрстку
    render() {
      const element = document.createElement('div');

      if (this.classes.length === 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      };

      element.innerHTML = `
          <img src=${this.src} alt=${this.alt}>
          <h3 class="menu__item-subtitle">${this.title}</h3>
          <div class="menu__item-descr">${this.descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
          </div>
          `;

      this.parent.append(element);
    }
  }

  // объект создается и никуда не записывается. Т.е. удаляется после отработки. Удобно, если объект нужно использовать лишь один раз.
  // 1 карточка
  new MenuCard(
    'img/tabs/vegy.jpg',
    'vegy',
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    9,
    '.menu .container',
    'menu__item'
  ).render();

  // 2 карточка
  new MenuCard(
    'img/tabs/elite.jpg',
    'elite',
    'Меню “Премиум”',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    12,
    '.menu .container',
    'menu__item'
  ).render();

    // 3 карточка
    new MenuCard(
      'img/tabs/post.jpg',
      'post',
      'Меню "Постное"',
      'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
      14,
      '.menu .container',
      'menu__item'
    ).render();
});