export function fireToast(message: string) {
  const toast = document.createElement("ui-toast");
  toast.innerText = message;
  document.body.appendChild(toast);
}
