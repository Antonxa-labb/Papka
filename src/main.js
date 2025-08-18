// Глобальные переменные для каждого Swiper
let swiperBrands = null;
let swiperRepair = null;
let swiperPrice = null;

// Флаги: в мобильном ли режиме
let isMobileBrands = false;
let isMobileRepair = false;
let isMobilePrice = false;

// Универсальная функция инициализации адаптивного слайдера
function initResponsiveSlider(
  listSelector,           // .brands_list, .repair_list, .price_list
  containerSelector,      // .swiper-container (или уточнённый)
  toggleButtonSelector,   // кнопка "Показать все" (если есть)
  paginationSelector,     // .swiper-pagination
  currentSwiper,          // текущий экземпляр Swiper
  setSwiper,              // функция для обновления экземпляра
  slideWidth              // ширина слайда (например, 224 или 260)
) {
  const list = document.querySelector(listSelector);
  const container = document.querySelector(containerSelector);
  const toggleButton = document.querySelector(toggleButtonSelector);
  const isMobile = window.innerWidth < 768;

  if (!list) return;

  const wasMobile = currentSwiper !== null;

  // Включаем Swiper на мобильных
  if (isMobile && !wasMobile) {
    // Добавляем классы Swiper
    list.classList.add('swiper-wrapper');
    list.querySelectorAll('li').forEach(item => {
      item.classList.add('swiper-slide');
    });

    // Уничтожаем старый Swiper, если есть
    if (currentSwiper && currentSwiper.destroy) {
      currentSwiper.destroy(true, true);
    }

    // Инициализируем новый
    const newSwiper = new Swiper(containerSelector, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      pagination: {
        el: paginationSelector,
        clickable: true,
      },
      observer: true,
      observeParents: true,
      watchOverflow: true,
    });

    setSwiper(newSwiper);

    // Скрываем кнопку "Показать все", если есть
    if (toggleButton) {
      toggleButton.style.display = 'none';
    }

    // Устанавливаем ширину слайда (если задана)
    if (slideWidth) {
      list.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.style.width = `${slideWidth}px`;
      });
    }
  }
  // Выключаем Swiper на десктопе
  else if (!isMobile && wasMobile) {
   if (currentSwiper && currentSwiper.destroy) {
    currentSwiper.destroy(true, true);
  }
  setSwiper(null);

  // Убираем классы Swiper
  list.classList.remove('swiper-wrapper');
  list.querySelectorAll('.swiper-slide').forEach(slide => {
    slide.classList.remove('swiper-slide');
  });

  // 🔴 Полностью очищаем инлайн-стили
  list.removeAttribute('style'); // удаляем стиль у списка
  list.querySelectorAll('li, .swiper-slide').forEach(slide => {
    slide.removeAttribute('style'); // удаляем стиль у слайдов
  });

  // Удаляем оставшиеся классы Swiper
  list.classList.remove('swiper-initialized', 'swiper-horizontal', 'swiper-container');

  // Показываем кнопку
  if (toggleButton) {
    toggleButton.style.display = 'block';
  }
}
}

// Инициализация всех слайдеров
function initAllSliders() {
  initResponsiveSlider(
    '.brands_list',
    '.brands .swiper-container',     // уточняем, чтобы не конфликтовал
    '.brands_toggle',
    '.brands .swiper-pagination',
    swiperBrands,
    (instance) => { swiperBrands = instance; },
    224
  );

  initResponsiveSlider(
    '.repair_list',
    '.repair .swiper-container',
    '.repair_toggle',
    '.repair .swiper-pagination',
    swiperRepair,
    (instance) => { swiperRepair = instance; },
    224
  );

  initResponsiveSlider(
    '.price_list',
    '.price .swiper-container',
    null, // у price нет кнопки "Показать все" — можно null
    '.price .swiper-pagination',
    swiperPrice,
    (instance) => { swiperPrice = instance; },
    260 // ширина слайда для цен
  );
}

// Обработка кнопки "Показать все" (если нужна)
function setupToggle(toggleSelector, listSelector, maxItems = 8) {
  const toggle = document.querySelector(toggleSelector);
  const list = document.querySelector(listSelector);

  if (!toggle || !list) return;

  toggle.addEventListener('click', () => {
    list.classList.toggle('expanded');
    toggle.textContent = list.classList.contains('expanded') ? 'Скрыть' : 'Показать все';

    // Показываем/скрываем лишние элементы
    list.querySelectorAll('li').forEach((item, index) => {
      if (index >= maxItems) {
        item.style.display = list.classList.contains('expanded') ? 'list-item' : 'none';
      }
    });

    // Обновляем Swiper, если активен
    if (window.innerWidth < 768) {
      if (listSelector === '.brands_list' && swiperBrands) swiperBrands.update();
      if (listSelector === '.repair_list' && swiperRepair) swiperRepair.update();
      if (listSelector === '.price_list' && swiperPrice) swiperPrice.update();
    }
  });
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  initAllSliders();

  // Назначаем кнопки (если есть)
  setupToggle('.brands_toggle', '.brands_list', 8);
  setupToggle('.repair_toggle', '.repair_list', 4);

  // Обработка ресайза
  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(initAllSliders, 200);
  });
});




//  Закрыть/открыть бургер меню

document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const openBtn = document.getElementById('open-sidebar');
  const closeBtn = document.getElementById('close-sidebar');
  const overlay = document.querySelector('.overlay'); // ✅ Сразу после DOM-элементов

  // Проверка ВСЕХ элементов
  if (!openBtn || !closeBtn || !overlay) {
    console.error('Не все элементы найдены:', { openBtn, closeBtn, overlay });
    return;
  }

  // Открытие меню
  openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    sidebar.classList.remove('hidden');
    overlay.style.display = 'block'; // ✅ теперь overlay определён
    document.body.style.overflow = 'hidden';
  });

  // Закрытие меню
  closeBtn.addEventListener('click', function (e) {
    e.preventDefault();
    sidebar.classList.add('hidden');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    console.log('Кнопка закрытия нажата'); // 🔍 Для проверки
  });

  // Закрытие по оверлею
  overlay.addEventListener('click', function () {
    sidebar.classList.add('hidden');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  });

  // Закрытие по Esc
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !sidebar.classList.contains('hidden')) {
      sidebar.classList.add('hidden');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const feedbackForm = document.querySelector('.feedback-form');
  const openButtons = document.querySelectorAll('.open-button-message'); // Все кнопки открытия
  const closeButtons = document.querySelectorAll('.close-button-message'); // Все кнопки закрытия

  // Проверка
  if (!feedbackForm) {
    console.error('❌ Форма .feedback-form не найдена');
    return;
  }

  if (openButtons.length === 0) {
    console.error('❌ Нет кнопок с классом .open-button-message');
  }

  if (closeButtons.length === 0) {
    console.error('❌ Нет кнопок с классом .close-button-message');
  }

  // Открытие: вешаем обработчик на каждую кнопку
  openButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('🔥 Кнопка открытия нажата');
      feedbackForm.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Закрытие: вешаем на все кнопки с классом .close-button-message
  closeButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('❌ Кнопка закрытия нажата');
      feedbackForm.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Закрытие по Esc
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && feedbackForm.classList.contains('open')) {
      feedbackForm.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Находим форму и кнопки
  const feedbackForm = document.querySelector('.feedback-form--one');
  const openButtons = document.querySelectorAll('.open-button-feedback');
  const closeButtons = document.querySelectorAll('.close-btn-feedback');

  // Проверка элементов
  if (!feedbackForm) {
    console.error('❌ Форма .feedback-form--one не найдена');
    return;
  }

  // Открытие: все кнопки с классом .open-button-feedback
  openButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('✅ Открываем .feedback-form--one');
      feedbackForm.classList.add('open');
      document.body.style.overflow = 'hidden'; // блокируем скролл
    });
  });

  // Закрытие: все кнопки с классом .close-btn-feedback
  closeButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('✅ Закрываем .feedback-form--one');
      feedbackForm.classList.remove('open');
      document.body.style.overflow = ''; // возвращаем скролл
    });
  });

  // Закрытие по клавише Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && feedbackForm.classList.contains('open')) {
      feedbackForm.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.button__skip');
  const mobileText = document.querySelector('.serv__text_mobile');
  const winText = document.querySelector('.win');

  // Проверка элементов
  if (!button) {
    console.error('❌ Кнопка .button__skip не найдена');
    return;
  }
  if (!winText) {
    console.error('❌ Элемент .win не найден');
    return;
  }

  button.addEventListener('click', function (e) {
    e.preventDefault();
    const width = window.innerWidth;

    // Скрываем кнопку после клика (по желанию)
    button.style.display = 'none';

    // Логика открытия
    if (width < 768) {
      // Мобильные: открываем оба
      if (mobileText) {
        mobileText.style.display = 'block';
      }
      winText.style.display = 'block';
    } else if (width >= 768 && width < 1120) {
      // Планшеты: только .win
      winText.style.display = 'block';
    }
    // На десктопе ≥1120px — ничего не делаем (уже видно)
  });
});

// Глобальные переменные


// Инициализация при загрузке и ресайзе
function initSlider() {
  const list = document.querySelector('.brands_list');
  const container = document.querySelector('.brands .swiper-container');
  const pagination = document.querySelector('.brands .swiper-pagination');
  const toggle = document.querySelector('.brands_toggle');
  const isMobile = window.innerWidth < 768;

  // Проверка
  if (!list || !container) {
    console.error('❌ Элементы .brands_list или .swiper-container не найдены');
    return;
  }

  // На мобильных — включаем Swiper
  if (isMobile && !swiperBrands) {
    // Добавляем классы
    list.classList.add('swiper-wrapper');
    list.querySelectorAll('li').forEach(li => {
      li.classList.add('swiper-slide');
    });

    // Инициализируем Swiper
    swiperBrands = new Swiper(container, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      pagination: {
        el: pagination,
        clickable: true,
      },
      observer: true,
      observeParents: true,
    });

    // Скрываем кнопку "Показать все"
    if (toggle) toggle.style.display = 'none';
  }

  // На десктопе — выключаем Swiper
  else if (!isMobile && swiperBrands) {
    swiperBrands.destroy(true, true);
    swiperBrands = null;

    // Убираем классы
    list.classList.remove('swiper-wrapper');
    list.querySelectorAll('li').forEach(li => {
      li.classList.remove('swiper-slide');
    });

    // Сбрасываем стили
    list.removeAttribute('style');
    list.querySelectorAll('li').forEach(li => {
      li.removeAttribute('style');
    });

    // Показываем кнопку
    if (toggle) toggle.style.display = 'block';
  }
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
  initSlider();

  // Перезапуск при ресайзе
  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(initSlider, 150);
  });
});