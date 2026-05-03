import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  try {
    await resend.emails.send({
      from: 'TechStore <onboarding@resend.dev>',
      to: email,
      subject: 'Verifica tu correo electrónico',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background-color: #1C1C1E; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">TechStore</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #111111; margin-top: 0;">Verifica tu correo electrónico</h2>
              <p style="color: #333333; line-height: 1.6;">
                Gracias por registrarte en TechStore. Por favor, haz clic en el botón de abajo para verificar tu correo electrónico.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background-color: #0A84FF; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Verificar Correo
                </a>
              </div>
              <p style="color: #666666; font-size: 14px;">
                Si no creaste esta cuenta, puedes ignorar este correo.
              </p>
              <p style="color: #666666; font-size: 12px; margin-top: 30px;">
                Este enlace expira en 24 horas.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`

  try {
    await resend.emails.send({
      from: 'TechStore <onboarding@resend.dev>',
      to: email,
      subject: 'Restablece tu contraseña',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background-color: #1C1C1E; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">TechStore</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #111111; margin-top: 0;">Restablece tu contraseña</h2>
              <p style="color: #333333; line-height: 1.6;">
                Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background-color: #0A84FF; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Restablecer Contraseña
                </a>
              </div>
              <p style="color: #666666; font-size: 14px;">
                Si no solicitaste este cambio, puedes ignorar este correo.
              </p>
              <p style="color: #666666; font-size: 12px; margin-top: 30px;">
                Este enlace expira en 1 hora.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error }
  }
}