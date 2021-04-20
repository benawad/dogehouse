import { showErrorToast } from "../../lib/showErrorToast";

// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
export function copyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let good = true;

  try {
    good = document.execCommand("copy");
  } catch (err) {
    console.error(err);
    showErrorToast(err);
    good = false;
  }

  document.body.removeChild(textArea);

  return good;
}
