(() => {
  "use strict";

  const lockClass = "office-modal-open";
  const modalSelector = "dialog[open], [aria-modal='true']:not([hidden])";
  let locked = false;
  let scrollY = 0;
  let previousBodyStyles = null;

  const style = document.createElement("style");
  style.textContent = `
    html.${lockClass} {
      overflow: hidden !important;
      overscroll-behavior: none;
    }
    body.${lockClass} {
      position: fixed !important;
      left: 0;
      right: 0;
      width: 100%;
      overflow: hidden !important;
      overscroll-behavior: none;
    }
  `;
  document.head.append(style);

  function lockPage() {
    if (locked) return;
    locked = true;
    scrollY = window.scrollY;
    previousBodyStyles = {
      left: document.body.style.left,
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      right: document.body.style.right,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.documentElement.classList.add(lockClass);
    document.body.classList.add(lockClass);
    document.body.style.top = `-${scrollY}px`;
  }

  function unlockPage() {
    if (!locked) return;
    locked = false;
    document.documentElement.classList.remove(lockClass);
    document.body.classList.remove(lockClass);
    Object.assign(document.body.style, previousBodyStyles);
    previousBodyStyles = null;
    window.scrollTo(0, scrollY);
  }

  function updateLock() {
    const modalOpen = [...document.querySelectorAll(modalSelector)].some(
      (modal) => !modal.closest("[hidden]"),
    );
    if (modalOpen) lockPage();
    else unlockPage();
  }

  const observer = new MutationObserver(updateLock);
  observer.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ["open", "hidden", "aria-hidden", "class"],
  });
  updateLock();
})();
