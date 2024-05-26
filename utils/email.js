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

  //1) create service email
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }

    return nodemailer.createTransport({
      service: 'gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  //2) create email option
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      name: this.name,
      url: this.url,
      subject,
    });

    const emailOption = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    //3) active email
    await this.newTransport().sendMail(emailOption);
  }

  async sendWelcome() {
    await this.send(
      'welcome',
      'Cảm ơn quý khách đã lựa chọn dịch vụ du lịch của chúng tôi!'
    );
  }

  async sendPasswordReset() {
    await this.send(
      'resetPassword',
      'Token đặt lại mật khẩu của bạn (có hiệu lực trong 10 phút)'
    );
  }
};
