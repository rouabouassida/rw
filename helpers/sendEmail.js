import nodemailer from "nodemailer";

const sendNewAccountInfo = async (email, name, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wafasassi49@gmail.com",
        pass: "xywgeetxyqcqpogd",
      },
    });
    const mailOptions = {
      from: "votre_email@gmail.com",
      to: email,
      subject: "Your Account Information",
      html: `<p>Hello ${name},</p>
                 <p>Your account has been successfully created.</p>
                 <p>Your login credentials are:</p>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Password:</strong> ${password}</p>
                 <p>Please keep this information secure.</p>
                 <p>Regards,</p>
                 <p>Your Company</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendUpdateInfo = async (email, name, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "votre_email@gmail.com",
        pass: "votre_mot_de_passe_gmail",
      },
    });

    const mailOptions = {
      from: "votre_email@gmail.com",
      to: email,
      subject: "Your Updated Account Information",
      html: `<p>Hello ${name},</p>
                 <p>Your account information has been successfully updated.</p>
                 <p>Your updated login credentials are:</p>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Password:</strong> ${password}</p>
                 <p>Please keep this information secure.</p>
                 <p>Regards,</p>
                 <p>Your Company</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendNewAccountInfo, sendUpdateInfo };
