import { SMTPClient } from "emailjs";
import { Token } from "./token";
import { format } from "date-fns";

export default async function sendEmail(token: Token) {
  const client = new SMTPClient({
    user: process.env.EMAIL_ADDRESS,
    password: process.env.EMAIL_PASSWORD,
    host: "smtp.gmail.com",
    ssl: true,
  });

  const emailText = `
  This is the news site token e-mail
  Here is your token: ${token.token}
  The token is issued on ${format(
    new Date(token.issuedAt * 1000),
    "yyyy/MM/dd HH:mm:ss (OOO)"
  )} and valid for 1 hour!
  `;

  try {
    await client.sendAsync({
      text: emailText,
      from: "news@csornyei.com",
      to: "mate.csornyei@gmail.com",
      subject: "News Site token",
    });
  } catch (error) {
    console.error(error);
    throw new Error("can't send email!");
  }
}
