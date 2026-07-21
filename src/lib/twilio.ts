import twilio from "twilio";
import type { Subscriber } from "./subscribers";

export interface SendResult {
  sent: number;
  failed: number;
  total: number;
}

/**
 * Send an SMS to a list of subscribers using the configured Twilio account.
 * Throws if Twilio env vars are missing so callers can return a 500.
 */
export async function sendSmsToSubscribers(
  message: string,
  subscribers: Subscriber[]
): Promise<SendResult> {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY_SID,
    TWILIO_API_KEY_SECRET,
    TWILIO_AUTH_TOKEN,
    TWILIO_MESSAGING_SERVICE_SID,
    TWILIO_PHONE_NUMBER,
  } = process.env;

  const hasApiKey =
    !!TWILIO_ACCOUNT_SID && !!TWILIO_API_KEY_SID && !!TWILIO_API_KEY_SECRET;
  const hasAuthToken = !!TWILIO_ACCOUNT_SID && !!TWILIO_AUTH_TOKEN;
  const hasSender = !!TWILIO_MESSAGING_SERVICE_SID || !!TWILIO_PHONE_NUMBER;

  if ((!hasApiKey && !hasAuthToken) || !hasSender) {
    throw new Error("Twilio is not configured.");
  }

  const client = hasApiKey
    ? twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
        accountSid: TWILIO_ACCOUNT_SID,
      })
    : twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const body = message.trim();

  const results = await Promise.allSettled(
    subscribers.map((sub) =>
      client.messages.create({
        body,
        ...(TWILIO_MESSAGING_SERVICE_SID
          ? { messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID }
          : { from: TWILIO_PHONE_NUMBER }),
        to: sub.phone,
      })
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return { sent, failed, total: subscribers.length };
}
