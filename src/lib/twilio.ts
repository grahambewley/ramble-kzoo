import twilio from "twilio";
import type { Subscriber } from "./subscribers";

export interface SendResult {
  sent: number;
  failed: number;
  total: number;
}

/** Build a configured Twilio client, or throw if env vars are missing. */
function getClient() {
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

  const sender = TWILIO_MESSAGING_SERVICE_SID
    ? { messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID }
    : { from: TWILIO_PHONE_NUMBER };

  return { client, sender };
}

/** Send a single SMS. Throws if Twilio is not configured or the send fails. */
export async function sendSms(to: string, message: string): Promise<void> {
  const { client, sender } = getClient();
  await client.messages.create({ body: message.trim(), ...sender, to });
}

/**
 * Send an SMS to a list of subscribers using the configured Twilio account.
 * Throws if Twilio env vars are missing so callers can return a 500.
 */
export async function sendSmsToSubscribers(
  message: string,
  subscribers: Subscriber[]
): Promise<SendResult> {
  const { client, sender } = getClient();
  const body = message.trim();

  const results = await Promise.allSettled(
    subscribers.map((sub) =>
      client.messages.create({ body, ...sender, to: sub.phone })
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return { sent, failed, total: subscribers.length };
}
