import { BrevoClient } from '@getbrevo/brevo'

type SendEmailArgs = {
  from?: string
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

const apiKey = process.env.BREVO_API_KEY
const defaultFrom = process.env.BREVO_FROM_EMAIL || process.env.SES_FROM_EMAIL || process.env.MAIL_FROM_EMAIL

export function isEmailConfigured() {
  return Boolean(apiKey && defaultFrom)
}

export function getDefaultFromEmail() {
  return defaultFrom || 'contact@votre-domaine.com'
}

export async function sendEmail({
  from,
  to,
  subject,
  html,
  replyTo,
}: SendEmailArgs) {
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured.')
  }

  const fromAddress = from || defaultFrom
  if (!fromAddress) {
    throw new Error('BREVO_FROM_EMAIL is missing.')
  }

  const toAddresses = Array.isArray(to) ? to : [to]

  const client = new BrevoClient({ apiKey })

  const result = await client.transactionalEmails.sendTransacEmail({
    sender: { email: fromAddress },
    to: toAddresses.map((email) => ({ email })),
    subject,
    htmlContent: html,
    ...(replyTo ? { replyTo: { email: replyTo } } : {}),
  })

  return result.messageId
}
