const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const MODULE_ID = "tablet-messenger";
const CHAT_STORAGE_KEY = "chatHistory";

const DEFAULT_CONTACTS = [
  { id: "mara-quinn", name: "Mara Quinn", status: "online" },
  { id: "rook-ironhand", name: "Rook Ironhand", status: "away" },
  { id: "selene-ash", name: "Selene Ash", status: "offline" },
  { id: "bram-tallow", name: "Bram Tallow", status: "online" }
];

const DEFAULT_CHAT_HISTORY = {
  "mara-quinn": [
    { sender: "Mara Quinn", text: "Ты уже в городе?", timestamp: "2026-05-17T10:31:00.000Z" },
    { sender: "Я", text: "Да, подхожу к рынку.", timestamp: "2026-05-17T10:32:00.000Z" },
    { sender: "Mara Quinn", text: "Отлично. Встречаемся у восточных ворот.", timestamp: "2026-05-17T10:42:00.000Z" },
    { sender: "Я", text: "Принято, буду через пять минут.", timestamp: "2026-05-17T10:43:00.000Z" }
  ],
  "rook-ironhand": [
    { sender: "Rook Ironhand", text: "Я почти на месте.", timestamp: "2026-05-17T09:58:00.000Z" }
  ],
  "selene-ash": [
    { sender: "Selene Ash", text: "Проверьте карту руин.", timestamp: "2026-05-16T18:15:00.000Z" }
  ],
  "bram-tallow": [
    { sender: "Bram Tallow", text: "Собрал припасы для отряда.", timestamp: "2026-05-17T08:17:00.000Z" }
  ]
};

const cloneData = (data) => foundry.utils.deepClone(data);

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

  constructor(options = {}) {
    super(options);
    this._activeContactId = game.settings.get(MODULE_ID, CHAT_STORAGE_KEY).activeContactId || DEFAULT_CONTACTS[0].id;
  }

  _getChatData() {
    const stored = game.settings.get(MODULE_ID, CHAT_STORAGE_KEY);
    return {
      activeContactId: stored.activeContactId || DEFAULT_CONTACTS[0].id,
      histories: {
        ...cloneData(DEFAULT_CHAT_HISTORY),
        ...(stored.histories ?? {})
      }
    };
  }

  _formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  async _prepareContext() {
    const chatData = this._getChatData();
    const activeContactId = this._activeContactId || chatData.activeContactId;
    const contacts = DEFAULT_CONTACTS.map((contact) => {
      const history = chatData.histories[contact.id] ?? [];
      const lastMessage = history.at(-1);
      return {
        ...contact,
        active: contact.id === activeContactId,
        lastMessage: lastMessage?.text ?? "",
        time: lastMessage ? this._formatTimestamp(lastMessage.timestamp) : ""
      };
    });

    const activeContact = contacts.find((c) => c.id === activeContactId) ?? contacts[0];
    const messages = (chatData.histories[activeContact.id] ?? []).map((message) => ({
      ...message,
      mine: message.sender === "Я",
      isNpc: message.senderType === "npc",
      time: this._formatTimestamp(message.timestamp)
    }));

    return {
      contacts,
      activeContact,
      messages,
      canSendAsNpc: game.user.isGM
    };
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    for (const contactElement of this.element.querySelectorAll(".tablet-contact")) {
      contactElement.addEventListener("click", async () => {
        this._activeContactId = contactElement.dataset.contactId;
        await game.settings.set(MODULE_ID, CHAT_STORAGE_KEY, {
          ...this._getChatData(),
          activeContactId: this._activeContactId
        });
        this.render();
      });
    }

    this.element.querySelector(".tablet-send")?.addEventListener("click", () => this._sendMessage());
    this.element.querySelector(".tablet-input")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this._sendMessage();
      }
    });
  }

  async _sendMessage() {
    const input = this.element.querySelector(".tablet-input");
    const text = input?.value.trim();
    if (!text) return;

    const asNpc = game.user.isGM && this.element.querySelector(".tablet-send-as")?.value === "npc";
    const activeContact = DEFAULT_CONTACTS.find((contact) => contact.id === this._activeContactId);

    const chatData = this._getChatData();
    const history = chatData.histories[this._activeContactId] ?? [];
    history.push({
      sender: asNpc ? activeContact?.name ?? "NPC" : "Я",
      senderType: asNpc ? "npc" : "player",
      text,
      timestamp: new Date().toISOString()
    });

    chatData.histories[this._activeContactId] = history;
    chatData.activeContactId = this._activeContactId;
    await game.settings.set(MODULE_ID, CHAT_STORAGE_KEY, chatData);

    input.value = "";
    this.render();
  }
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, CHAT_STORAGE_KEY, {
    scope: "world",
    config: false,
    type: Object,
    default: {
      activeContactId: DEFAULT_CONTACTS[0].id,
      histories: cloneData(DEFAULT_CHAT_HISTORY)
    }
  });
});

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
