declare module '@aws-sdk/client-sesv2' {
  export class SESv2Client {
    constructor(config: { region?: string })
    send(command: unknown): Promise<{ MessageId?: string }>
  }

  export class SendEmailCommand {
    constructor(input: unknown)
  }
}
