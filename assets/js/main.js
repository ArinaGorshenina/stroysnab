/* выпадающий список */
const btn = document.getElementById('catalogBtn');
const icon = document.getElementById('catalogIcon');
const menu = document.getElementById('catalogMenu');

let isOpen = false;

btn.addEventListener('click', () => {
  isOpen = !isOpen;

  if (isOpen) {
    icon.src = 'assets/images/header/close-circle.svg'; // иконка крестика
    menu.classList.add('active');
  } else {
    icon.src = 'assets/images/header/menu.svg';
    menu.classList.remove('active');
  }
});

/* прокрутка разделов */
function initCustomScrollbar(wrapperSelector, contentSelector) {
  const wrapper = document.querySelector(wrapperSelector);
  const content = wrapper.querySelector(contentSelector);
  const scrollbar = wrapper.querySelector('.custom-scrollbar');
  const thumb = scrollbar.querySelector('.scrollbar-thumb');

  const thumbHeight = 161;

  const update = () => {
    const maxThumbTop = scrollbar.offsetHeight - thumbHeight;
    const maxScroll = content.scrollHeight - content.clientHeight;

    if (maxScroll <= 0) {
      thumb.style.display = 'none';
      return;
    }

    thumb.style.display = 'block';
    thumb.style.top = (content.scrollTop / maxScroll) * maxThumbTop + 'px';
  };

  content.addEventListener('wheel', e => {
    e.preventDefault();
    content.scrollTop += e.deltaY;
    update();
  }, { passive: false });

  let startY = 0, startTop = 0, dragging = false;

  thumb.addEventListener('mousedown', e => {
    dragging = true;
    startY = e.clientY;
    startTop = parseFloat(thumb.style.top) || 0;
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const maxThumbTop = scrollbar.offsetHeight - thumbHeight;
    let newTop = startTop + (e.clientY - startY);
    newTop = Math.max(0, Math.min(newTop, maxThumbTop));
    thumb.style.top = newTop + 'px';

    content.scrollTop = (newTop / maxThumbTop) * (content.scrollHeight - content.clientHeight);
  });

  document.addEventListener('mouseup', () => dragging = false);

  new MutationObserver(update).observe(content, { childList: true, subtree: true });

  update();
}
initCustomScrollbar(
  '.catalog-categories-wrapper',
  '.catalog-categories'
);

initCustomScrollbar(
  '.catalog-content-wrapper',
  '.catalog-content'
);


/* разделы */
document.addEventListener('DOMContentLoaded', () => {
  const categories = document.querySelectorAll('.catalog-category');
  const contentContainer = document.getElementById('catalogContent');

  // Данные категорий (можно загружать с сервера)
  const categoryData = {
    instruments: {
      title: "Инструменты",
      columns: [
        {
          title: "Столярный и слесарный инструмент",
          items: [
            "Ножи и лезвия", "Биты", "Головки торцевые, переходники",
            "Зубила и скальпели", "Кирки, ломы, гвоздодеры",
            "Молотки", "Напильники", "Отвёртки", "Пассатижи", "Клещи"
          ] // >5 пунктов
        },
        {
          title: "Садовый инвентарь",
          items: [
            "Буры садовые", "Землеобрабатывающая инвентарь",
            "Косы и серп", "Лом, ледорубы", "Лопаты и черенки и метла",
            "Грабли", "Секаторы", "Сучкорезы"
          ]
        },
        {
          title: "Электроинструменты",
          items: [
            "Насосы", "Триммеры", "Мотоблоки, мотокультиваторы и аксессуары к ним",
            "Бетономесители", "Дрели, шуруповерты"
            // ровно 5 — кнопка "Еще" не показывается
          ]
        },
        {
          title: "Столярный и слесарный инструмент",
          items: [
            "Ножи и лезвия", "Биты", "Головки торцевые, переходники",
            "Зубила и скальпели", "Кирки, ломы, гвоздодеры",
            "Молотки", "Напильники", "Отвёртки", "Пассатижи", "Клещи"
          ] // >5 пунктов
        },
        {
          title: "Садовый инвентарь",
          items: [
            "Буры садовые", "Землеобрабатывающая инвентарь",
            "Косы и серп", "Лом, ледорубы", "Лопаты и черенки и метла",
            "Грабли", "Секаторы", "Сучкорезы"
          ]
        },
        {
          title: "Электроинструменты",
          items: [
            "Насосы", "Триммеры", "Мотоблоки, мотокультиваторы и аксессуары к ним",
            "Бетономесители", "Дрели, шуруповерты"
            // ровно 5 — кнопка "Еще" не показывается
          ]
        }
      ]
    },
    ventilation: { title: "Вентиляция", columns: [] },
    doors: { title: "Двери, комплектующие, фурнитура", columns: [] },
    wood: { title: "Древесно-плитные материалы", columns: [] },
    scaffolding: { title: "Опалубка", columns: [] },
    heating: { title: "Отопление, водоснабжение, канализация и комплектующие", columns: [] },
    household: { title: "Посуда и домашняя утварь", columns: [] },
    paint: { title: "Обои", columns: [] },
    composite: { title: "Композитная арматура", columns: [] },
    fasteners: { title: "Крепеж", columns: [] },
    soil: { title: "Лкм и грунты", columns: [] },
    metal: { title: "Металлопрокат", columns: [] },
    flooring: { title: "Напольное покрытие и комплектующие", columns: [] },
    foam: { title: "Пена, герметики, жидкий клей", columns: [] }
  };

  function renderCategory(categoryKey) {
    const data = categoryData[categoryKey];
    if (!data) return;

    let html = `<h2>${data.title}</h2><div class="catalog-columns">`;

    data.columns.forEach((col, colIndex) => {
      const hasMore = col.items.length > 5;
      const uniqueId = `col-${categoryKey}-${colIndex}`;

      // Отображаем первые 5 пунктов изначально
      const visibleItems = col.items.slice(0, 5);

      html += `
      <div class="catalog-column">
        <h3>${col.title}</h3>
        <ul id="items-${uniqueId}" class="items-list">
          ${visibleItems.map(item => `<li>${item}</li>`).join('')}
        </ul>
        ${hasMore ? `
          <div class="more-link" 
               data-target="items-${uniqueId}" 
               data-full='${JSON.stringify(col.items)}'
               data-expanded="false">
            Еще 
            <img src="assets/images/shorts/arr_white.svg" alt="arr_white" class="more-arrow">
          </div>
        ` : ''}
      </div>
    `;
    });

    html += `</div>`;
    contentContainer.innerHTML = html;

    // Обработчик переключения
    contentContainer.querySelectorAll('.more-link').forEach(btn => {
      const arrow = btn.querySelector('.more-arrow');
      const targetId = btn.dataset.target;
      const fullItems = JSON.parse(btn.dataset.full);
      const targetUl = document.getElementById(targetId);

      btn.addEventListener('click', () => {
        const isExpanded = btn.dataset.expanded === 'true';

        if (isExpanded) {
          // Скрываем — оставляем только первые 5
          targetUl.innerHTML = fullItems.slice(0, 5).map(item => `<li>${item}</li>`).join('');
          btn.dataset.expanded = 'false';
          arrow.style.transform = 'rotate(-90deg)'; // вниз (как у вас: rotate(180deg) → значит, 90deg = вниз)
        } else {
          // Раскрываем — все пункты
          targetUl.innerHTML = fullItems.map(item => `<li>${item}</li>`).join('');
          btn.dataset.expanded = 'true';
          arrow.style.transform = 'rotate(90deg)'; // вверх
        }
      });
    });
  }

  // Инициализация — показываем первую категорию
  renderCategory('instruments');

  // Обработчики кликов по категориям
  categories.forEach(cat => {
    cat.addEventListener('click', () => {
      categories.forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      renderCategory(cat.dataset.category);
    });
  });
});


/* модалка вопросов */
// Получаем элементы
const modal = document.querySelector('.modal');
const closeButtons = document.querySelectorAll('.close, .close-btn');
const form = document.getElementById('questionForm');
const modalForm = document.getElementById('modalForm');
const modalSuccess = document.getElementById('modalSuccess');

// Открытие модалки — ВСЕ кнопки
document.addEventListener('click', (e) => {
  if (e.target.closest('.h-r-btn')) {
    modal.style.display = 'flex';
  }
});

// Закрытие модалки
closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal();
  });
});

// Закрытие по клику вне формы
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Обработка отправки формы
form.addEventListener('submit', (e) => {
  e.preventDefault();
  setTimeout(() => {
    modalForm.style.display = 'none';
    modalSuccess.style.display = 'block';
  }, 500);
});

function closeModal() {
  modal.style.display = 'none';
  modalForm.style.display = 'block';
  modalSuccess.style.display = 'none';
  form.reset();
}

//валидация формы
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('questionForm');
  const submitBtn = form.querySelector('.submit-btn');

  // Состояние валидности каждого поля
  const validationState = {
    name: false,
    phone: false,
    email: false,
    message: false,
    agree: false
  };

  // Утилита: показать ошибку
  function showError(fieldId, message) {
    const errorEl = document.getElementById(`${fieldId}-error`);
    const input = document.getElementById(fieldId);
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    if (input) input.classList.add('input-error');
    validationState[fieldId] = false;
    updateSubmitButton();
  }

  // Утилита: скрыть ошибку
  function hideError(fieldId) {
    const errorEl = document.getElementById(`${fieldId}-error`);
    const input = document.getElementById(fieldId);
    errorEl.style.display = 'none';
    if (input) input.classList.remove('input-error');
    validationState[fieldId] = true;
    updateSubmitButton();
  }

  // Обновить состояние кнопки (активна/неактивна)
  function updateSubmitButton() {
    const allValid = Object.values(validationState).every(v => v === true);
    submitBtn.disabled = !allValid;
    submitBtn.style.opacity = allValid ? 1 : 0.6;
    submitBtn.style.cursor = allValid ? 'pointer' : 'not-allowed';
  }

  // Валидация поля
  function validateField(fieldId, value) {
    switch (fieldId) {
      case 'name':
        if (!value.trim()) {
          showError('name', 'Пожалуйста, укажите ваше имя');
        } else if (!/^[а-яА-ЯёЁ\s]{2,50}$/.test(value.trim())) {
          showError('name', 'Имя должно содержать только кириллицу и быть от 2 до 50 символов');
        } else {
          hideError('name');
        }
        break;

      case 'phone':
        const digits = value.replace(/\D/g, '');
        if (!digits) {
          showError('phone', 'Пожалуйста, введите номер телефона');
        } else if (digits.length !== 11 || !/^7/.test(digits)) {
          showError('phone', 'Номер должен быть в формате +7 (XXX) XXX-XX-XX');
        } else {
          hideError('phone');
        }
        break;

      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          showError('email', 'Пожалуйста, укажите email');
        } else if (!emailPattern.test(value.trim())) {
          showError('email', 'Некорректный email');
        } else {
          hideError('email');
        }
        break;

      case 'message':
        if (!value.trim()) {
          showError('message', 'Пожалуйста, опишите ваш вопрос');
        } else if (value.trim().length < 10) {
          showError('message', 'Вопрос должен содержать минимум 10 символов');
        } else {
          hideError('message');
        }
        break;

      case 'agree':
        if (!value) {
          showError('agree', 'Необходимо согласие на обработку персональных данных');
        } else {
          hideError('agree');
        }
        break;
    }
  }

  // Привязка валидации к полям
  const fields = ['name', 'phone', 'email', 'message'];
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    field.addEventListener('blur', () => validateField(fieldId, field.value));
    field.addEventListener('input', () => validateField(fieldId, field.value));
  });

  // Чекбокс
  const agreeCheckbox = document.getElementById('agree');
  agreeCheckbox.addEventListener('change', () => {
    validateField('agree', agreeCheckbox.checked);
  });

  // Отправка формы
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Принудительная валидация всех полей (на случай, если пользователь не трогал какое-то)
    validateField('name', document.getElementById('name').value);
    validateField('phone', document.getElementById('phone').value);
    validateField('email', document.getElementById('email').value);
    validateField('message', document.getElementById('message').value);
    validateField('agree', agreeCheckbox.checked);

    // Проверка итогового состояния
    const allValid = Object.values(validationState).every(v => v === true);
    if (allValid) {
      // Отправка (имитация)
      console.log('Форма отправлена');
      document.getElementById('modalForm').style.display = 'none';
      document.getElementById('modalSuccess').style.display = 'block';
    }
    // Если не все валидны — ошибки уже показаны
  });

  // Изначально кнопка неактивна
  updateSubmitButton();
});
/* =============================
   Модалка: Оформить заказ в 1 клик (с полным набором полей)
============================= */

const orderModal = document.querySelector('.modal-order');
if (orderModal) {
  const orderForm = document.getElementById('orderForm');
  const orderFormContainer = document.getElementById('orderFormContainer');
  const orderSuccess = document.getElementById('orderSuccess');
  const orderCloseButtons = orderModal.querySelectorAll('.close');

  // Открытие
  document.addEventListener('click', (e) => {
    if (e.target.closest('.open-cart')) {
      orderModal.style.display = 'flex';
    }
  });

  // Закрытие
  function closeOrderModal() {
    orderModal.style.display = 'none';
    orderFormContainer.style.display = 'block';
    orderSuccess.style.display = 'none';
    orderForm.reset();
    // Сброс ошибок
    orderForm.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    orderForm.querySelectorAll('input, textarea').forEach(el => el.classList.remove('input-error'));
  }

  orderCloseButtons.forEach(btn => btn.addEventListener('click', closeOrderModal));
  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) closeOrderModal();
  });

  // Валидация
  document.addEventListener('DOMContentLoaded', () => {
    const orderSubmitBtn = orderForm.querySelector('.submit-btn');
    const orderValidationState = {
      name: false,
      phone: false,
      email: false,
      message: false,
      agree: false
    };

    function showOrderError(fieldId, message) {
      const errorEl = document.getElementById(`order-${fieldId}-error`);
      const input = document.getElementById(`order-${fieldId}`);
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      if (input) input.classList.add('input-error');
      orderValidationState[fieldId] = false;
      updateOrderSubmitButton();
    }

    function hideOrderError(fieldId) {
      const errorEl = document.getElementById(`order-${fieldId}-error`);
      const input = document.getElementById(`order-${fieldId}`);
      errorEl.style.display = 'none';
      if (input) input.classList.remove('input-error');
      orderValidationState[fieldId] = true;
      updateOrderSubmitButton();
    }

    function updateOrderSubmitButton() {
      const allValid = Object.values(orderValidationState).every(v => v === true);
      orderSubmitBtn.disabled = !allValid;
      orderSubmitBtn.style.opacity = allValid ? 1 : 0.6;
      orderSubmitBtn.style.cursor = allValid ? 'pointer' : 'not-allowed';
    }

    function validateOrderField(fieldId, value) {
      switch (fieldId) {
        case 'name':
          if (!value.trim()) {
            showOrderError('name', 'Пожалуйста, укажите ваше имя');
          } else if (!/^[а-яА-ЯёЁ\s]{2,50}$/.test(value.trim())) {
            showOrderError('name', 'Имя должно содержать только кириллицу и быть от 2 до 50 символов');
          } else {
            hideOrderError('name');
          }
          break;

        case 'phone':
          const digits = value.replace(/\D/g, '');
          if (!digits) {
            showOrderError('phone', 'Пожалуйста, введите номер телефона');
          } else if (digits.length !== 11 || !/^7/.test(digits)) {
            showOrderError('phone', 'Номер должен быть в формате +7 (XXX) XXX-XX-XX');
          } else {
            hideOrderError('phone');
          }
          break;

        case 'email':
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value.trim()) {
            showOrderError('email', 'Пожалуйста, укажите email');
          } else if (!emailPattern.test(value.trim())) {
            showOrderError('email', 'Некорректный email');
          } else {
            hideOrderError('email');
          }
          break;

        case 'message':
          const trimmed = value.trim();
          if (trimmed === '') {
            // Поле пустое — допустимо, скрываем ошибку
            hideOrderError('message');
          } else if (trimmed.length < 10) {
            showOrderError('message', 'Комментарий должен содержать минимум 10 символов');
          } else {
            hideOrderError('message');
          }
          break;

        case 'agree':
          if (!value) {
            showOrderError('agree', 'Необходимо согласие на обработку персональных данных');
          } else {
            hideOrderError('agree');
          }
          break;
      }
    }

    // Привязка событий
    ['name', 'phone', 'email', 'message'].forEach(fieldId => {
      const field = document.getElementById(`order-${fieldId}`);
      field.addEventListener('blur', () => validateOrderField(fieldId, field.value));
      field.addEventListener('input', () => validateOrderField(fieldId, field.value));
    });

    const orderAgree = document.getElementById('order-agree');
    orderAgree.addEventListener('change', () => {
      validateOrderField('agree', orderAgree.checked);
    });

    // Отправка
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Принудительная валидация всех полей
      validateOrderField('name', document.getElementById('order-name').value);
      validateOrderField('phone', document.getElementById('order-phone').value);
      validateOrderField('email', document.getElementById('order-email').value);
      validateOrderField('message', document.getElementById('order-message').value);
      validateOrderField('agree', orderAgree.checked);

      if (Object.values(orderValidationState).every(v => v === true)) {
        // Имитация отправки
        setTimeout(() => {
          orderFormContainer.style.display = 'none';
          orderSuccess.style.display = 'block';
        }, 300);
      }
    });

    updateOrderSubmitButton();
  });
}

/* =============================
   Модалка: Получить предложение
============================= */

const predModal = document.querySelector('.modal-pred');
if (predModal) {
  const predForm = document.getElementById('predForm');
  const predFormContainer = document.getElementById('predFormContainer');
  const predSuccess = document.getElementById('predSuccess');
  const predCloseButtons = predModal.querySelectorAll('.close');

  // Открытие по кнопке .open-pred
  document.addEventListener('click', (e) => {
    if (e.target.closest('.open-pred')) {
      predModal.style.display = 'flex';
    }
  });

  // Закрытие
  function closePredModal() {
    predModal.style.display = 'none';
    predFormContainer.style.display = 'block';
    predSuccess.style.display = 'none';
    predForm.reset();
    predForm.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    predForm.querySelectorAll('input, textarea').forEach(el => el.classList.remove('input-error'));
  }

  predCloseButtons.forEach(btn => btn.addEventListener('click', closePredModal));
  predModal.addEventListener('click', (e) => {
    if (e.target === predModal) closePredModal();
  });

  // Валидация
  document.addEventListener('DOMContentLoaded', () => {
    const predSubmitBtn = predForm.querySelector('.submit-btn');
    const predValidationState = {
      name: false,
      phone: false,
      email: false,
      message: false,
      agree: false
    };

    function showPredError(fieldId, message) {
      const errorEl = document.getElementById(`pred-${fieldId}-error`);
      const input = document.getElementById(`pred-${fieldId}`);
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      if (input) input.classList.add('input-error');
      predValidationState[fieldId] = false;
      updatePredSubmitButton();
    }

    function hidePredError(fieldId) {
      const errorEl = document.getElementById(`pred-${fieldId}-error`);
      const input = document.getElementById(`pred-${fieldId}`);
      errorEl.style.display = 'none';
      if (input) input.classList.remove('input-error');
      predValidationState[fieldId] = true;
      updatePredSubmitButton();
    }

    function updatePredSubmitButton() {
      const allValid = Object.values(predValidationState).every(v => v === true);
      predSubmitBtn.disabled = !allValid;
      predSubmitBtn.style.opacity = allValid ? 1 : 0.6;
      predSubmitBtn.style.cursor = allValid ? 'pointer' : 'not-allowed';
    }

    function validatePredField(fieldId, value) {
      switch (fieldId) {
        case 'name':
          if (!value.trim()) {
            showPredError('name', 'Пожалуйста, укажите ваше имя');
          } else if (!/^[а-яА-ЯёЁ\s]{2,50}$/.test(value.trim())) {
            showPredError('name', 'Имя должно содержать только кириллицу и быть от 2 до 50 символов');
          } else {
            hidePredError('name');
          }
          break;

        case 'phone':
          const digits = value.replace(/\D/g, '');
          if (!digits) {
            showPredError('phone', 'Пожалуйста, введите номер телефона');
          } else if (digits.length !== 11 || !/^7/.test(digits)) {
            showPredError('phone', 'Номер должен быть в формате +7 (XXX) XXX-XX-XX');
          } else {
            hidePredError('phone');
          }
          break;

        case 'email':
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value.trim()) {
            showPredError('email', 'Пожалуйста, укажите email');
          } else if (!emailPattern.test(value.trim())) {
            showPredError('email', 'Некорректный email');
          } else {
            hidePredError('email');
          }
          break;

        case 'message':

          if (!value.trim()) {
            showPredError('message', 'Пожалуйста, опишите ваше предложение');
          } else if (value.trim().length < 10) {
            showPredError('message', 'Комментарий должен содержать минимум 10 символов');
          } else {
            hidePredError('message');
          }
          break;

        case 'agree':
          if (!value) {
            showPredError('agree', 'Необходимо согласие на обработку персональных данных');
          } else {
            hidePredError('agree');
          }
          break;
      }
    }

    ['name', 'phone', 'email', 'message'].forEach(fieldId => {
      const field = document.getElementById(`pred-${fieldId}`);
      field.addEventListener('blur', () => validatePredField(fieldId, field.value));
      field.addEventListener('input', () => validatePredField(fieldId, field.value));
    });

    const predAgree = document.getElementById('pred-agree');
    predAgree.addEventListener('change', () => {
      validatePredField('agree', predAgree.checked);
    });

    predForm.addEventListener('submit', (e) => {
      e.preventDefault();

      validatePredField('name', document.getElementById('pred-name').value);
      validatePredField('phone', document.getElementById('pred-phone').value);
      validatePredField('email', document.getElementById('pred-email').value);
      validatePredField('message', document.getElementById('pred-message').value);
      validatePredField('agree', predAgree.checked);

      if (Object.values(predValidationState).every(v => v === true)) {
        setTimeout(() => {
          predFormContainer.style.display = 'none';
          predSuccess.style.display = 'block';
        }, 300);
      }
    });

    updatePredSubmitButton();
  });
}


document.addEventListener('DOMContentLoaded', () => {
  // ========================
  // 1. БАННЕР СЛАЙДЕР
  // ========================
  const bannerSlides = document.querySelectorAll('.ban-slide');
  const dotsContainer = document.getElementById('sliderDots');
  if (bannerSlides.length > 0 && dotsContainer) {
    const totalBannerSlides = bannerSlides.length;
    let currentBannerIndex = 0;
    let progressInterval = null;
    const slideDuration = 5000;

    // Создаём точки
    bannerSlides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'ban-slider-dot';
      if (i === 0) dot.classList.add('active');

      const progress = document.createElement('div');
      progress.className = 'progress';
      dot.appendChild(progress);
      dotsContainer.appendChild(dot);

      dot.addEventListener('click', () => {
        clearInterval(progressInterval);
        goToBannerSlide(i);
        startBannerProgress();
      });
    });

    const dots = document.querySelectorAll('.ban-slider-dot');

    function goToBannerSlide(index) {
      bannerSlides.forEach(slide => slide.classList.remove('ban-slide-active'));
      dots.forEach(dot => dot.classList.remove('active'));

      bannerSlides[index].classList.add('ban-slide-active');
      dots[index].classList.add('active');
      currentBannerIndex = index;

      // Сброс прогресса
      document.querySelectorAll('.ban-slider-dot .progress').forEach(pb => {
        pb.style.width = '0%';
      });
    }

    function startBannerProgress() {
      const activeDot = dots[currentBannerIndex];
      const progressBar = activeDot.querySelector('.progress');
      let progress = 0;
      const step = 100 / (slideDuration / 100);

      progressInterval = setInterval(() => {
        progress += step;
        progressBar.style.width = `${Math.min(progress, 100)}%`;

        if (progress >= 100) {
          clearInterval(progressInterval);
          nextBannerSlide();
        }
      }, 100);
    }

    function nextBannerSlide() {
      const nextIndex = (currentBannerIndex + 1) % totalBannerSlides;
      goToBannerSlide(nextIndex);
      startBannerProgress();
    }

    // Запуск автопрокрутки
    startBannerProgress();
  }

  // ========================
  // 2. ШОРТС СЛАЙДЕР
  // ========================
  const shortsSlider = document.getElementById('shortsSlider');
  const shortsSlides = document.querySelectorAll('.shorts-slide');
  const prevBtn = document.querySelector('.circle-left');
  const nextBtn = document.querySelector('.circle-right');

  if (shortsSlider && shortsSlides.length > 0 && prevBtn && nextBtn) {
    let currentShortsIndex = 0;
    const totalShortsSlides = shortsSlides.length;

    function getVisibleSlides() {
      const slideWidth = shortsSlides[0].offsetWidth + 20;
      const containerWidth = shortsSlider.parentElement.offsetWidth;
      return Math.max(1, Math.floor(containerWidth / slideWidth));
    }

    function updateButtonState() {
      const visible = getVisibleSlides();
      const maxIndex = Math.max(0, totalShortsSlides - visible);

      prevBtn.classList.toggle('disabled', currentShortsIndex === 0);
      nextBtn.classList.toggle('disabled', currentShortsIndex >= maxIndex);
      prevBtn.disabled = currentShortsIndex === 0;
      nextBtn.disabled = currentShortsIndex >= maxIndex;
    }

    function updateSlider() {
      const visible = getVisibleSlides();
      const maxIndex = Math.max(0, totalShortsSlides - visible);
      currentShortsIndex = Math.min(currentShortsIndex, maxIndex);

      const offset = -currentShortsIndex * (shortsSlides[0].offsetWidth + 20);
      shortsSlider.style.transform = `translateX(${offset}px)`;
      updateButtonState();
    }

    prevBtn.addEventListener('click', () => {
      if (!prevBtn.disabled) {
        const visible = getVisibleSlides();
        currentShortsIndex = Math.max(0, currentShortsIndex - visible);
        updateSlider();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (!nextBtn.disabled) {
        const visible = getVisibleSlides();
        const maxIndex = Math.max(0, totalShortsSlides - visible);
        currentShortsIndex = Math.min(maxIndex, currentShortsIndex + visible);
        updateSlider();
      }
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();
  }

  // ========================
  // 3. МОДАЛЬНОЕ ОКНО ДЛЯ ВИДЕО (ЕДИНОЕ)
  // ========================
  const modal = document.createElement('div');
  modal.className = 'modal-video';
  modal.innerHTML = `
    <button class="modal-close" aria-label="Закрыть">×</button>
    <video controls playsinline></video>
  `;
  document.body.appendChild(modal);

  const modalVideo = modal.querySelector('video');
  const modalClose = modal.querySelector('.modal-close');

  function showUnmuteButton() {
    const existing = modal.querySelector('.unmute-btn');
    if (existing) existing.remove();

    const btn = document.createElement('button');
    btn.className = 'unmute-btn';
    btn.textContent = '🔊 Включить звук';
    Object.assign(btn.style, {
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: '100',
      padding: '8px 16px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    });

    btn.onclick = () => {
      modalVideo.muted = false;
      modalVideo.play().then(() => {
        btn.remove();
      }).catch(e => console.warn('Не удалось включить звук:', e));
    };

    modal.appendChild(btn);
  }

  function closeModal() {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    modal.querySelector('.unmute-btn')?.remove();
  }

  // Универсальный обработчик для ЛЮБОГО .video-trigger
  document.querySelectorAll('.video-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Ищем ближайший слайд с data-video
      const slide = btn.closest('.ban-slide, .shorts-slide');
      const videoSrc = slide?.dataset.video;

      if (!videoSrc) return;

      // Сброс состояния
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.load();
      modalVideo.src = videoSrc;
      modalVideo.currentTime = 0;
      modalVideo.muted = false; // пытаемся сразу со звуком

      modal.classList.add('active');

      // Попытка воспроизвести
      const playPromise = modalVideo.play();
      if (playPromise) {
        playPromise
          .then(() => {
            // Успех — звук разрешён
          })
          .catch(err => {
            console.warn('Safari заблокировал звук:', err);
            modalVideo.muted = true;
            showUnmuteButton();
          });
      }
    });
  });

  // Закрытие модалки
  modalClose?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
});

//счетчик на странице продукта
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.product-right-basket-btn-bg-transp');
  const button2 = document.querySelector('.product-right-basket-btn-left');
  if (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      // Устанавливаем flex-стили
      this.style.display = 'flex';
      this.style.justifyContent = 'space-between';
      this.style.alignItems = 'center';
      this.style.fontWeight = '600';
      this.style.gap = '30px'; // небольшой отступ между элементами

      // Заменяем содержимое
      this.innerHTML = `
                <span>–</span>
                <span>1</span>
                <span>+</span>
            `;
      button2.style.display = 'flex';
      button2.style.justifyContent = 'space-between';
      button2.style.alignItems = 'center';
      button2.style.gap = '10px';
      button2.innerHTML = `  <span>В корзине</span>
                <img src="assets/images/catalog/ArrowRight.svg" alt="ArrowRight">`
    });
  }
});

/* вкладки на странице продукта */
const tabs = document.querySelectorAll('.product-btn-filter-v')
const content = document.querySelectorAll('.product-content-filter')

tabs.forEach((tab, index) => {
  tab.addEventListener('click', function () {
    document.querySelector('.product-btn-filter-v.active').classList.remove('active')
    tab.classList.add('active');
    document.querySelector('.product-content-filter.active').classList.remove('active')
    content[index].classList.add('active')
  })
})

/* вкладки на странице контактов */
const tabs1 = document.querySelectorAll('.product-btn-filter-v')
const content1 = document.querySelectorAll('.contact-box-filter')

tabs1.forEach((tab, index) => {
  tab.addEventListener('click', function () {
    document.querySelector('.product-btn-filter-v.active').classList.remove('active')
    tab.classList.add('active');
    document.querySelector('.contact-box-filter.active').classList.remove('active')
    content1[index].classList.add('active')
  })
})

/* вкладки на странице news */
const tabs2 = document.querySelectorAll('.news-btn-filter-v')
const content2 = document.querySelectorAll('.news-content-filter')

tabs2.forEach((tab, index) => {
  tab.addEventListener('click', function () {
    document.querySelector('.news-btn-filter-v.active').classList.remove('active')
    tab.classList.add('active');
    document.querySelector('.news-content-filter.active').classList.remove('active')
    content2[index].classList.add('active')
  })
})

/* слайдер  с кем мы сотрудничаем */
if (window.innerWidth <= 575) {
  const slider = document.querySelector('.partners-cards');

  if (slider) {
    slider.addEventListener('click', (e) => {
      const card = e.target.closest('.partners-card');
      if (!card) return;

      card.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    });
  }
}
/* слайдер  каталога на главной и b2b */
if (window.innerWidth <= 575) {
  const catalogSlider = document.getElementById('scroll-catalog');

  if (catalogSlider) {
    catalogSlider.addEventListener('click', (e) => {
      const card = e.target.closest('.catalog-home-card');
      if (!card) return;

      card.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    });
  }
}
