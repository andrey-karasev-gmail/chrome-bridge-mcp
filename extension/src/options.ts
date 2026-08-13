/**
 * Options page — configures the port the extension connects to.
 *
 * The port lives in chrome.storage.local; background.ts watches for changes
 * and reconnects, so saving here takes effect without reloading the extension.
 */

// `export {}` marks this file as a module so its top-level names stay scoped to
// it — background.ts is a global script and also declares DEFAULT_PORT.
// options.html loads the emitted file with type="module" to match.
export {};

const DEFAULT_PORT = 9229;

const portInput = document.getElementById("port") as HTMLInputElement | null;
const saveButton = document.getElementById("save");
const statusEl = document.getElementById("status");

function showStatus(message: string, kind: "saved" | "error"): void {
  if (!statusEl) {
    return;
  }
  statusEl.textContent = message;
  statusEl.className = `status ${kind}`;
}

async function load(): Promise<void> {
  const { wsPort } = await chrome.storage.local.get({ wsPort: DEFAULT_PORT });
  if (portInput) {
    portInput.value = String(wsPort);
  }
}

async function save(): Promise<void> {
  if (!portInput) {
    return;
  }

  const port = Number.parseInt(portInput.value, 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    showStatus("Enter a valid port between 1 and 65535.", "error");
    return;
  }

  await chrome.storage.local.set({ wsPort: port });
  showStatus(`Saved — reconnecting to ws://localhost:${port}...`, "saved");
}

saveButton?.addEventListener("click", () => {
  void save();
});

portInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    void save();
  }
});

void load();
