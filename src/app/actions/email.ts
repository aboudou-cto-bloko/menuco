"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOwnerCredentials({
  restaurantName,
  ownerEmail,
  password,
  menuUrl,
  dashboardUrl,
}: {
  restaurantName: string;
  ownerEmail: string;
  password: string;
  menuUrl: string;
  dashboardUrl: string;
}) {
  if (!process.env.SMTP_USER) return;

  await transporter.sendMail({
    from: `"MenuCo" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `Vos accès MenuCo — ${restaurantName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Arial,sans-serif">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#0f0705;padding:28px 32px;text-align:center">
      <div style="display:inline-flex;width:40px;height:40px;background:#f97316;border-radius:8px;align-items:center;justify-content:center;margin-bottom:12px">
        <span style="color:#fff;font-weight:700;font-size:18px">M</span>
      </div>
      <h1 style="color:#f6ded3;font-size:20px;margin:0;font-weight:600">MenuCo</h1>
    </div>

    <div style="padding:32px">
      <h2 style="font-size:18px;color:#111;margin:0 0 8px">Votre menu digital est prêt ! 🎉</h2>
      <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px">
        Bonjour, voici vos identifiants pour accéder au dashboard de <strong>${restaurantName}</strong>.
      </p>

      <div style="background:#f8f8f8;border-radius:8px;padding:20px;margin-bottom:24px">
        <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.05em">Vos identifiants</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;font-size:13px;color:#888;width:100px">Dashboard</td>
              <td style="padding:6px 0;font-size:13px;color:#111;font-family:monospace">${dashboardUrl}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#888">Email</td>
              <td style="padding:6px 0;font-size:13px;color:#111;font-family:monospace">${ownerEmail}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#888">Mot de passe</td>
              <td style="padding:6px 0;font-size:13px;color:#111;font-family:monospace;font-weight:600">${password}</td></tr>
        </table>
      </div>

      <a href="${dashboardUrl}" style="display:block;background:#f97316;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:8px;font-weight:600;font-size:14px;margin-bottom:16px">
        Accéder à mon dashboard →
      </a>

      <a href="${menuUrl}" style="display:block;border:1px solid #e5e5e5;color:#555;text-decoration:none;text-align:center;padding:12px;border-radius:8px;font-size:13px">
        Voir mon menu public
      </a>
    </div>

    <div style="padding:20px 32px;border-top:1px solid #f0f0f0;text-align:center">
      <p style="margin:0;font-size:11px;color:#aaa">Propulsé par MenuCo · Créé par François Zinsou</p>
    </div>
  </div>
</body>
</html>`,
  });
}
