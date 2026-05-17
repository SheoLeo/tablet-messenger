class TabletMessengerApp extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {
    id: "tablet-messenger-app",
    tag: "section",
    classes: ["tablet-messenger"],
    position: {
      width: 360,
      height: "auto"
    },
    window: {
      title: "Tablet"
    }
  };

  async _prepareContext() {
    return {
      message: "Tablet Messenger Loaded"
    };
  }

  async _renderHTML(context) {
    const container = document.createElement("div");
    container.classList.add("tablet-messenger__content");
    container.textContent = context.message;
    return container;
  }

  _replaceHTML(result, content) {
    content.replaceChildren(result);
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
