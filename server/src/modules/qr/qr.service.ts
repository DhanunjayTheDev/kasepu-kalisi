import QRCode from "qrcode";

export async function renderQrPng(token: string): Promise<Buffer> {
  return QRCode.toBuffer(token, { type: "png", width: 400, margin: 1 });
}

export async function renderQrDataUrl(token: string): Promise<string> {
  return QRCode.toDataURL(token, { width: 400, margin: 1 });
}
