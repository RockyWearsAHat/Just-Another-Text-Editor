const butInstall = document.getElementById("buttonInstall");

// Logic for installing the PWA
if (window.matchMedia("(display-mode: standalone)").matches) {
  butInstall.style.display = "none";
}

window.addEventListener("load", () => {
  if (navigator.getInstalledRelatedApps()) {
    butInstall.style.display = "none";
  } else {
    // Logic for installing the PWA, not already installed
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredPrompt = event;

      butInstall.style.display = "block";
    });

    // TODO: Implement a click event handler on the `butInstall` element
    butInstall.addEventListener("click", async () => {
      if (!deferredPrompt) {
        return;
      }

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
    });

    // TODO: Add an handler for the `appinstalled` event
    window.addEventListener("appinstalled", (event) => {
      butInstall.style.display = "none";
    });
  }
});
