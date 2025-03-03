Hooks.on("renderActorSheet", (app, html, data) => {
  if (!app.options.editable || app.actor.type !== 'character') return;

  // Находим контейнер заголовка персонажа
  const header = html.find('.sheet-header');
  if (!header.length) return;

  // Создаём кнопки
  const buttons = $(`
    <div class="image-picker-wrapper">
      <button class="image-picker-btn local" title="Выбрать из хранилища">
        <i class="fas fa-folder-open"></i>
      </button>
      <button class="image-picker-btn pinterest" title="Искать в Pinterest">
        <i class="fab fa-pinterest"></i>
      </button>
    </div>
  `);

  // Вставляем после аватара персонажа
  header.find('.profile').append(buttons);

  // Обработчики событий (как в предыдущих версиях)
  buttons.find('.local').click(/* ... */);
  buttons.find('.pinterest').click(/* ... */);
});