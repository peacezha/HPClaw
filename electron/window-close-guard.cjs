function createWindowCloseGuard({ confirmClose, getWindow }) {
  let approved = false;
  let confirmationPending = false;

  return function guardWindowClose(event) {
    if (approved) return;

    // Electron requires preventDefault() during the synchronous close event.
    // Waiting for an async dialog before calling it allows the window to close.
    event.preventDefault();
    if (confirmationPending) return;

    confirmationPending = true;
    Promise.resolve(confirmClose())
      .then(shouldClose => {
        confirmationPending = false;
        if (!shouldClose) return;
        approved = true;
        getWindow()?.close();
      })
      .catch(() => {
        confirmationPending = false;
      });
  };
}

module.exports = { createWindowCloseGuard };
