const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.name = user.name;
    this.from = `ThanhNG <${process.env.EMAIL_FROM}>`;
  }

  // Create transporter for sending emails
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    // For development environment, you may need to set up other options
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send email using Pug template
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      name: this.name,
      url: this.url,
      subject,
    });

    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // Send email using transporter
    await this.newTransport().sendMail(emailOptions);
  }

  // Method to send welcome email
  async sendWelcome() {
    await this.send(
      'welcome',
      'Cảm ơn quý khách đã lựa chọn dịch vụ du lịch của chúng tôi!'
    );
  }

  // Method to send password reset email
  async sendPasswordReset() {
    await this.send(
      'resetPassword',
      'Token đặt lại mật khẩu của bạn (có hiệu lực trong 10 phút)'
    );
  }
};
