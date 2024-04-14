import { getInstalled, setInstalled } from "./database";

const butInstall = document.getElementById("buttonInstall");

// Logic for installing the PWA
if (window.matchMedia("(display-mode: standalone)").matches) {
  butInstall.style.display = "none";
}

window.addEventListener("DOMContentLoaded", async () => {
  const installed = await getInstalled();

  if (installed) {
    butInstall.style.display = "none";
  }
});

// Logic for installing the PWA, not already installed
let deferredPrompt;
window.addEventListener("beforeinstallprompt", async (event) => {
  event.preventDefault();
  deferredPrompt = event;
  butInstall.style.display = "block";

  await setInstalled(false);
});

// TODO: Implement a click event handler on the `butInstall` element
butInstall.addEventListener("click", async () => {
  if (!deferredPrompt) {
    return;
  }

  console.log(deferredPrompt);

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    await setInstalled(true);
  }
  deferredPrompt = null;
});

// TODO: Add an handler for the `appinstalled` event
window.addEventListener("appinstalled", (event) => {
  butInstall.style.display = "none";
});
