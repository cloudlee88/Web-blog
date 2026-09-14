/**
 * ESP (Email Service Provider) integration for the newsletter (FR-8.1).
 * Supports ConvertKit or Brevo via env config; a no-op when unconfigured so the
 * form still works in local dev (subscribers are stored in the DB as a backup).
 */
export async function addSubscriberToEsp(email: string): Promise<{ ok: boolean; error?: string }> {
  const provider = process.env.ESP_PROVIDER;
  const apiKey = process.env.ESP_API_KEY;

  if (!provider || !apiKey) return { ok: true }; // ESP disabled — DB backup only

  try {
    if (provider === "convertkit") {
      const formId = process.env.ESP_FORM_ID;
      if (!formId) return { ok: false, error: "ESP_FORM_ID not set" };
      const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, email }),
      });
      return res.ok ? { ok: true } : { ok: false, error: `ConvertKit ${res.status}` };
    }

    if (provider === "brevo") {
      const listId = process.env.ESP_LIST_ID;
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": apiKey },
        body: JSON.stringify({
          email,
          updateEnabled: true,
          ...(listId ? { listIds: [Number(listId)] } : {}),
        }),
      });
      // Brevo returns 201 (created) or 204 (updated).
      return res.ok ? { ok: true } : { ok: false, error: `Brevo ${res.status}` };
    }

    return { ok: false, error: `Unknown ESP provider: ${provider}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "ESP request failed" };
  }
}
