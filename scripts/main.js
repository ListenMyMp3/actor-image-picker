Hooks.on("renderActorSheet", (app, html, data) => {
    if (!app.options.editable) return;
  
    const buttonContainer = $('<div class="image-picker-buttons"></div>');
    
    // Кнопка для локальных файлов
    const localButton = $(`
      <button class="image-picker-btn local" title="Выбрать из хранилища">
        <i class="fas fa-folder-open"></i>
      </button>
    `);
  
    // Кнопка для Pinterest
    const pinterestButton = $(`
      <button class="image-picker-btn pinterest" title="Искать в Pinterest">
        <i class="fab fa-pinterest"></i>
      </button>
    `);
  
    buttonContainer.append(localButton, pinterestButton);
    html.find('.profile-image').append(buttonContainer);
  
    // Обработчик для локальных файлов
    localButton.click(async () => {
      try {
        new FilePicker({
          type: "image",
          current: app.object.img,
          callback: async path => await app.object.update({img: path})
        }).browse();
      } catch(err) {
        console.error("ActorImagePicker | Local error:", err);
      }
    });
  
    // Обработчик для Pinterest
    pinterestButton.click(async () => {
      new Dialog({
        title: "Импорт из Pinterest",
        content: await renderTemplate("modules/actor-image-picker/templates/pinterest-dialog.html"),
        buttons: {
          import: {
            icon: '<i class="fas fa-download"></i>',
            label: "Импорт",
            callback: async (html) => {
              const url = html.find('input[name="pinterest-url"]').val();
              if (!isValidImageUrl(url)) {
                ui.notifications.error("Некорректный URL изображения!");
                return;
              }
              
              // Проверка доступности изображения
              try {
                const test = await fetch(url, {method: "HEAD"});
                if (!test.ok) throw new Error();
                await app.object.update({img: url});
                ui.notifications.info("Изображение успешно обновлено!");
              } catch {
                ui.notifications.error("Не удалось загрузить изображение!");
              }
            }
          }
        }
      }).render(true);
      
      // Открытие Pinterest в новом окне
      window.open("https://ru.pinterest.com/", "PinterestWindow");
    });
  });
  
  // Валидация URL изображений
  function isValidImageUrl(url) {
    return /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp))$/i.test(url);
  }