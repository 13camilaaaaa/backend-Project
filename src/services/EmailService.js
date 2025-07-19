import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,      // ejemplo: smtp.gmail.com
    port: process.env.EMAIL_PORT,      // 465 (SSL) o 587 (TLS)
    secure: process.env.EMAIL_SECURE === 'true', // true para 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const EmailService = {
    enviarCodigoVerificacion: async (destinatario, codigo) => {
        const mailOptions = {
            from: `"ROSS MILLE" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: `Tu clave de acceso: ${codigo}`,
            html: `
                <p>Hola 👋,</p>
                <p>Recibimos una solicitud para verificar tu identidad.</p>
                <p>Tu código de verificación es:</p>
                <h2 style="color:#0066cc">${codigo}</h2>
                <p>Este código es válido por unos minutos.</p>
                <p>Si no solicitaste este código, puedes ignorar este mensaje.</p>
                <br>
                <p>Gracias,</p>
                <p><strong>ROSS MILLE</strong></p>
            `,
        };
        await transporter.sendMail(mailOptions);
    }
};

