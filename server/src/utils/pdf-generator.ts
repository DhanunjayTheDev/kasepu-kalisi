import PDFDocument from "pdfkit";
import { renderQrPng } from "../modules/qr/qr.service";

interface TicketPdfInput {
  ticketId: string;
  bookingId: string;
  eventTitle: string;
  eventDate: string;
  venueName: string;
  venueCity: string;
  ticketTypeName: string;
  attendeeName: string;
  qrToken: string;
}

const BRAND = {
  ivory: "#F7F1E9",
  teal: "#1E6C71",
  terracotta: "#DB734D",
  gold: "#E8B03F",
  slate: "#5C777F",
};

export async function generateTicketPdf(input: TicketPdfInput): Promise<Buffer> {
  const qrPng = await renderQrPng(input.qrToken);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [320, 560], margin: 0 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(0, 0, 320, 560).fill(BRAND.ivory);
    doc.rect(0, 0, 320, 120).fill(BRAND.teal);

    doc
      .fillColor(BRAND.ivory)
      .fontSize(16)
      .text("KASEPU KALISI", 0, 32, { width: 320, align: "center" });
    doc
      .fontSize(20)
      .text(input.eventTitle, 20, 60, { width: 280, align: "center" });
    doc
      .fontSize(9)
      .fillColor(BRAND.gold)
      .text(input.ticketTypeName.toUpperCase(), 0, 96, { width: 320, align: "center" });

    doc
      .fillColor(BRAND.slate)
      .fontSize(10)
      .text(`${input.eventDate}`, 20, 140, { width: 280, align: "center" })
      .text(`${input.venueName}, ${input.venueCity}`, 20, 155, { width: 280, align: "center" });

    doc.image(qrPng, 80, 190, { width: 160, height: 160 });

    doc
      .fillColor(BRAND.teal)
      .fontSize(11)
      .text(input.ticketId, 20, 365, { width: 280, align: "center" });
    doc
      .fillColor(BRAND.slate)
      .fontSize(9)
      .text(`Booking ${input.bookingId}`, 20, 382, { width: 280, align: "center" })
      .text(input.attendeeName, 20, 398, { width: 280, align: "center" });

    doc
      .moveTo(20, 440)
      .lineTo(300, 440)
      .dash(3, { space: 3 })
      .strokeColor(BRAND.slate)
      .stroke();

    doc
      .undash()
      .fillColor(BRAND.slate)
      .fontSize(8)
      .text(
        "Valid for single entry. Present this QR at the venue gate along with a photo ID.",
        20,
        460,
        { width: 280, align: "center" }
      );

    doc.end();
  });
}
