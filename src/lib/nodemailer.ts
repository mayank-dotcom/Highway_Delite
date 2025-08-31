import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
  },
});

export const sendOTPEmail = async (email: string, otp: string, name?: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for HD App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">HD App</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your One-Time Password</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name || 'there'}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            You requested an OTP to access your HD App account. Please use the following code to complete your authentication:
          </p>
          
          <div style="background: #fff; border: 2px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0;">
            <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 5px; font-family: 'Courier New', monospace;">${otp}</h1>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This OTP will expire in 10 minutes for security reasons.
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If you didn't request this OTP, please ignore this email.
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0; font-size: 14px;">© 2024 HD App. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default transporter;
