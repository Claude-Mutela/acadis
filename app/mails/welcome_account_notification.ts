import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'

interface WelcomeAccountData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export default class WelcomeAccountNotification extends BaseMail {
  from = env.get('MAIL_FROM_ADDRESS')
  subject = 'Votre compte Acadis a été créé'

  constructor(private data: WelcomeAccountData) {
    super()
  }

  prepare() {
    this.message
      .to(this.data.email)
      .htmlView('emails/welcome_account', {
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
        password: this.data.password,
        loginUrl: `${env.get('APP_URL')}/login`,
      })
  }
}
