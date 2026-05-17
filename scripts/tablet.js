const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class TabletMessengerApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "tablet-messenger-app",
    tag: "section",
    classes: ["tablet-messenger"],
    position: {
      width: 900,
      height: 620
    },
    window: {
      title: "Tablet"
    }
  };

  static PARTS = {
    body: {
      template: "modules/tablet-messenger/templates/tablet.hbs"
    }
  };

  async _prepareContext() {
    return {
      contacts: [
        { name: "Mara Quinn", status: "online", lastMessage: "Встречаемся у восточных ворот.", time: "10:42", active: true },
        { name: "Rook Ironhand", status: "away", lastMessage: "Я почти на месте.", time: "09:58" },
        { name: "Selene Ash", status: "offline", lastMessage: "Проверьте карту руин.", time: "Вчера" },
        { name: "Bram Tallow", status: "online", lastMessage: "Собрал припасы для отряда.", time: "08:17" }
      ],
      activeContact: {
        name: "Mara Quinn",
        status: "В сети"
      },
      messages: [
        { author: "Mara Quinn", text: "Ты уже в городе?", time: "10:31", mine: false },
        { author: "Я", text: "Да, подхожу к рынку.", time: "10:32", mine: true },
        { author: "Mara Quinn", text: "Отлично. Встречаемся у восточных ворот.", time: "10:42", mine: false },
        { author: "Я", text: "Принято, буду через пять минут.", time: "10:43", mine: true }
      ]
    };
  }
}

Hooks.on("getSceneControlButtons", (controls) => {
  const targetControl = controls.find((control) => control.name === "token") ?? controls[0];
  if (!targetControl) return;

  const alreadyExists = targetControl.tools.some((tool) => tool.name === "tablet-messenger");
  if (alreadyExists) return;

  targetControl.tools.push({
    name: "tablet-messenger",
    title: "Tablet",
    icon: "fas fa-tablet-alt",
    button: true,
    onClick: () => {
      new TabletMessengerApp().render(true);
    }
  });
});
