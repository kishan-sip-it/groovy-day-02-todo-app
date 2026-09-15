const COMMANDS = [
  { key: "d", label: "Dashboard", hint: "Open dashboard", action: () => document.querySelectorAll(".nav-btn")[0]?.click() },
  { key: "b", label: "Board", hint: "Open Kanban board", action: () => document.querySelectorAll(".nav-btn")[1]?.click() },
  { key: "p", label: "Profile", hint: "Open profile", action: () => document.querySelectorAll(".nav-btn")[2]?.click() },
  {
    key: "n",
    label: "New task",
    hint: "Open the task editor",
    action: () => {
      const board = document.querySelectorAll(".nav-btn")[1];
      board?.click();
      window.setTimeout(() => {
        [...document.querySelectorAll("button")]
          .find((button) => button.textContent?.includes("New Task"))
          ?.click();
      }, 60);
    }
  }
];

export function initCommandPalette() {
  if (document.getElementById("command-palette-root")) return;

  const root = document.createElement("div");
  root.id = "command-palette-root";
  root.innerHTML = `
    <div class="command-palette-backdrop" hidden>
      <div class="command-palette" role="dialog" aria-modal="true" aria-label="TaskFlow command palette">
        <div class="command-palette-head">
          <div>
            <strong>Quick Actions</strong>
            <span>Ctrl/⌘ + K</span>
          </div>
          <button type="button" data-close aria-label="Close">Esc</button>
        </div>
        <input class="command-palette-search" data-search placeholder="Type a command…" autocomplete="off" />
        <div class="command-list" data-list></div>
        <div class="command-palette-foot">D Dashboard · B Board · N New Task · P Profile</div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const backdrop = root.querySelector(".command-palette-backdrop");
  const search = root.querySelector("[data-search]");
  const list = root.querySelector("[data-list]");

  function close() {
    backdrop.hidden = true;
    search.value = "";
  }

  function run(command) {
    close();
    command.action();
  }

  function render(filter = "") {
    const query = filter.trim().toLowerCase();
    const matches = COMMANDS.filter((command) => `${command.label} ${command.hint}`.toLowerCase().includes(query));
    list.innerHTML = matches.length
      ? matches.map((command) => `<button class="command-item" type="button" data-command="${command.key}"><span><strong>${command.label}</strong><small>${command.hint}</small></span><kbd>${command.key.toUpperCase()}</kbd></button>`).join("")
      : `<div class="command-empty">No matching action.</div>`;

    list.querySelectorAll("[data-command]").forEach((button) => {
      button.addEventListener("click", () => {
        const command = COMMANDS.find((item) => item.key === button.dataset.command);
        if (command) run(command);
      });
    });
  }

  function open() {
    backdrop.hidden = false;
    render();
    requestAnimationFrame(() => search.focus());
  }

  root.querySelector("[data-close]").addEventListener("click", close);
  backdrop.addEventListener("mousedown", (event) => {
    if (event.target === backdrop) close();
  });
  search.addEventListener("input", (event) => render(event.target.value));

  document.addEventListener("keydown", (event) => {
    const modifier = event.ctrlKey || event.metaKey;
    const activeTag = document.activeElement?.tagName;
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);

    if (modifier && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
      return;
    }

    if (!backdrop.hidden && event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (!typing && !modifier && !event.altKey) {
      const command = COMMANDS.find((item) => item.key === event.key.toLowerCase());
      if (command) {
        event.preventDefault();
        run(command);
      }
    }
  });
}
