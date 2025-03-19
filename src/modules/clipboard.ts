import { toast } from "react-toastify";

export async function yankClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard!");
  } catch {
    toast.error("Error copying to clipboard");
  }
}
