import { env } from "../../config/env";
import { WhatsAppLog } from "./whatsappLog.model";

interface SendWhatsAppInput {
  to: string;
  template: string;
  data: Record<string, unknown>;
}

// Talks to the Meta WhatsApp Cloud API. Falls back to a console log in dev when
// credentials aren't configured, so the rest of the flow still completes.
export async function sendWhatsApp({ to, template, data }: SendWhatsAppInput) {
  try {
    if (env.WHATSAPP_API_KEY && env.WHATSAPP_PHONE_NUMBER_ID) {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.WHATSAPP_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "template",
            template: { name: template, language: { code: "en" }, components: buildComponents(data) },
          }),
        }
      );

      if (!response.ok) throw new Error(`WhatsApp API responded ${response.status}`);
    } else {
      console.log(`[whatsapp:console] to=${to} template=${template}`, data);
    }

    await WhatsAppLog.create({ to, template, status: "sent" });
  } catch (err) {
    await WhatsAppLog.create({ to, template, status: "failed", error: (err as Error).message });
    throw err;
  }
}

function buildComponents(data: Record<string, unknown>) {
  const values = Object.values(data).filter((v) => typeof v === "string" || typeof v === "number");
  if (values.length === 0) return [];
  return [{ type: "body", parameters: values.map((value) => ({ type: "text", text: String(value) })) }];
}
