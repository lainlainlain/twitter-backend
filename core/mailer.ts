import nodemailer from 'nodemailer';

const options = {
  host: process.env.NODEMAILER_HOST || 'smth.mailtrap.io',
  port: Number(process.env.NODEMAILER_PORT) || 2525,
  auth: {
    user: '98398ac03afbe0',
    pass: 'c84ef4ab9b600d',
  },
};

const transport = nodemailer.createTransport(options);

export default transport;
