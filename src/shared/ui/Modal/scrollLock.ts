let scrollPosition = 0;

export const lockScroll = (): void => {
  const body = document.body;

  if (body.classList.contains("body--lock-scroll")) return;

  scrollPosition = window.scrollY || window.pageYOffset || 0;

  body.style.top = `-${scrollPosition}px`;
  body.classList.add("body--lock-scroll");
};

export const unlockScroll = (): void => {
  const body = document.body;

  if (!body.classList.contains("body--lock-scroll")) return;

  body.classList.remove("body--lock-scroll");
  body.style.top = "";

  window.scrollTo(0, scrollPosition);
};
