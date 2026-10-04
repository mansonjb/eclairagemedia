import { NextResponse } from "next/server";

// Envoie la demande d'inscription à bonjour@eclairagemedia.com via l'API Brevo (variable BREVO_API_KEY sur Vercel).
export async function POST(req: Request) {
  const { email, rubriques } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const liste = Array.isArray(rubriques) ? rubriques.filter((r) => typeof r === "string").slice(0, 6).join(", ") : "";
  const key = process.env.BREVO_API_KEY;
  if (!key) return NextResponse.json({ ok: false }, { status: 503 });
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Site Éclairage", email: "bonjour@eclairagemedia.com" },
      to: [{ email: "bonjour@eclairagemedia.com" }],
      replyTo: { email },
      subject: `Inscription : ${email}`,
      textContent: `Nouvelle demande d'inscription\nEmail : ${email}\nRubriques : ${liste || "non précisé"}`,
    }),
  });
  return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 502 });
}
