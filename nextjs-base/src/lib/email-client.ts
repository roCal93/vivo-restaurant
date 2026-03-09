import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

type SendEmailArgs = {
  from?: string
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

const sesRegion = process.env.AWS_SES_REGION || process.env.AWS_REGION
const defaultFrom = process.env.SES_FROM_EMAIL || process.env.MAIL_FROM_EMAIL

const sesClient = sesRegion
  ? new SESv2Client({
      region: sesRegion,
    })
  : null

export function isEmailConfigured() {
  return Boolean(sesClient && defaultFrom)
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
  if (!sesClient) {
    throw new Error('AWS SES client is not configured.')
  }

  const fromAddress = from || defaultFrom
  if (!fromAddress) {
    throw new Error('SES_FROM_EMAIL or MAIL_FROM_EMAIL is missing.')
  }

  const toAddresses = Array.isArray(to) ? to : [to]

  const result = await sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: fromAddress,
      Destination: {
        ToAddresses: toAddresses,
      },
      ReplyToAddresses: replyTo ? [replyTo] : undefined,
      Content: {
        Simple: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
          },
        },
      },
    })
  )

  return result.MessageId
}
