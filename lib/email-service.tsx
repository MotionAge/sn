import nodemailer from "nodemailer"
import { getSupabaseClient } from "./supabase"

interface EmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
  template?: string
  templateData?: Record<string, any>
  referenceType?: string
  referenceId?: string
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private async initializeTransporter() {
    try {
      // Get SMTP settings from environment or database
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com"
      const smtpPort = Number.parseInt(process.env.SMTP_PORT || "587")
      const smtpUser = process.env.SMTP_USER || ""
      const smtpPassword = process.env.SMTP_PASSWORD || ""

      if (!smtpUser || !smtpPassword) {
        console.warn("SMTP credentials not configured. Email service disabled.")
        return
      }

      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
        tls: {
          rejectUnauthorized: false,
        },
      })

      // Verify connection
      await this.transporter.verify()
      console.log("Email service initialized successfully")
    } catch (error) {
      console.error("Failed to initialize email service:", error)
      this.transporter = null
    }
  }

  private getEmailTemplate(templateName: string, data: Record<string, any>): EmailTemplate {
    const templates: Record<string, (data: any) => EmailTemplate> = {
      "donation-confirmation": (data) => ({
        subject: `Donation Confirmation - Receipt #${data.receiptNumber}`,
        html: this.getDonationConfirmationHTML(data),
        text: this.getDonationConfirmationText(data),
      }),
      "membership-welcome": (data) => ({
        subject: "Welcome to Sanatan Dharma Bikash Nepal!",
        html: this.getMembershipWelcomeHTML(data),
        text: this.getMembershipWelcomeText(data),
      }),
      "membership-approval": (data) => ({
        subject: "Membership Application Approved",
        html: this.getMembershipApprovalHTML(data),
        text: this.getMembershipApprovalText(data),
      }),
      "event-registration": (data) => ({
        subject: `Event Registration Confirmation - ${data.eventTitle}`,
        html: this.getEventRegistrationHTML(data),
        text: this.getEventRegistrationText(data),
      }),
      "payment-success": (data) => ({
        subject: "Payment Successful",
        html: this.getPaymentSuccessHTML(data),
        text: this.getPaymentSuccessText(data),
      }),
      "contact-form": (data) => ({
        subject: `New Contact Form Submission from ${data.name}`,
        html: this.getContactFormHTML(data),
        text: this.getContactFormText(data),
      }),
    }

    const template = templates[templateName]
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`)
    }

    return template(data)
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.error("Email service not initialized")
      return false
    }

    try {
      let emailContent: { subject: string; html?: string; text?: string }

      if (options.template && options.templateData) {
        const template = this.getEmailTemplate(options.template, options.templateData)
        emailContent = {
          subject: template.subject,
          html: template.html,
          text: template.text,
        }
      } else {
        emailContent = {
          subject: options.subject,
          html: options.html,
          text: options.text,
        }
      }

      const fromEmail = process.env.FROM_EMAIL || "noreply@sanatandharma.org"
      const fromName = process.env.FROM_NAME || "Sanatan Dharma Bikash Nepal"

      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: options.to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }

      const result = await this.transporter.sendMail(mailOptions)

      // Log email to database
      await this.logEmail({
        to_email: options.to,
        from_email: fromEmail,
        subject: emailContent.subject,
        body: emailContent.html || emailContent.text || "",
        template_used: options.template || null,
        status: "sent",
        reference_type: options.referenceType || null,
        reference_id: options.referenceId || null,
        sent_at: new Date().toISOString(),
        metadata: { messageId: result.messageId },
      })

      console.log("Email sent successfully:", result.messageId)
      return true
    } catch (error) {
      console.error("Failed to send email:", error)

      // Log failed email
      await this.logEmail({
        to_email: options.to,
        from_email: process.env.FROM_EMAIL || "noreply@sanatandharma.org",
        subject: options.subject,
        body: options.html || options.text || "",
        template_used: options.template || null,
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
        reference_type: options.referenceType || null,
        reference_id: options.referenceId || null,
      })

      return false
    }
  }

  private async logEmail(emailData: any) {
    try {
      const supabase = getSupabaseClient()
      if (supabase) {
        await supabase.from("email_logs").insert(emailData)
      }
    } catch (error) {
      console.error("Failed to log email:", error)
    }
  }

  // Email Templates
  private getDonationConfirmationHTML(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Donation Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .amount { font-size: 24px; font-weight: bold; color: #f97316; }
          .receipt-box { background: white; padding: 15px; border-left: 4px solid #f97316; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Donation!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.donorName},</p>
            <p>We are deeply grateful for your generous donation to Sanatan Dharma Bikash Nepal.</p>
            
            <div class="receipt-box">
              <h3>Donation Details</h3>
              <p><strong>Amount:</strong> <span class="amount">${data.currency} ${data.amount}</span></p>
              <p><strong>Receipt Number:</strong> ${data.receiptNumber}</p>
              <p><strong>Date:</strong> ${new Date(data.donationDate).toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
              ${data.purpose ? `<p><strong>Purpose:</strong> ${data.purpose}</p>` : ""}
              ${data.message ? `<p><strong>Your Message:</strong> "${data.message}"</p>` : ""}
            </div>

            <p>Your contribution will help us continue our mission of preserving and promoting Sanatan Dharma values through education and community service.</p>
            
            <p>A detailed receipt has been generated and will be available for download from your account.</p>
            
            <p>With gratitude,<br>
            <strong>Sanatan Dharma Bikash Nepal Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>Contact us: info@sanatandharma.org | +977-1-4444444</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getDonationConfirmationText(data: any): string {
    return `
Thank You for Your Donation!

Dear ${data.donorName},

We are deeply grateful for your generous donation to Sanatan Dharma Bikash Nepal.

Donation Details:
- Amount: ${data.currency} ${data.amount}
- Receipt Number: ${data.receiptNumber}
- Date: ${new Date(data.donationDate).toLocaleDateString()}
- Payment Method: ${data.paymentMethod}
${data.purpose ? `- Purpose: ${data.purpose}` : ""}
${data.message ? `- Your Message: "${data.message}"` : ""}

Your contribution will help us continue our mission of preserving and promoting Sanatan Dharma values through education and community service.

A detailed receipt has been generated and will be available for download from your account.

With gratitude,
Sanatan Dharma Bikash Nepal Team

Contact us: info@sanatandharma.org | +977-1-4444444
    `
  }

  private getMembershipWelcomeHTML(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to SDB Nepal</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .membership-box { background: white; padding: 15px; border-left: 4px solid #f97316; margin: 20px 0; }
          .benefits { background: white; padding: 15px; margin: 20px 0; }
          .benefits ul { margin: 0; padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Community!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.fullName},</p>
            <p>Welcome to Sanatan Dharma Bikash Nepal! We are delighted to have you as a member of our community.</p>
            
            <div class="membership-box">
              <h3>Your Membership Details</h3>
              <p><strong>Member ID:</strong> ${data.memberId}</p>
              <p><strong>Membership Type:</strong> ${data.membershipType}</p>
              <p><strong>Join Date:</strong> ${new Date(data.joinDate).toLocaleDateString()}</p>
              ${data.expiryDate ? `<p><strong>Expiry Date:</strong> ${new Date(data.expiryDate).toLocaleDateString()}</p>` : "<p><strong>Validity:</strong> Lifetime</p>"}
            </div>

            <div class="benefits">
              <h3>Your Membership Benefits</h3>
              <ul>
                <li>Access to all events and workshops</li>
                <li>Monthly newsletter with updates</li>
                <li>Library access to Sanskrit texts and resources</li>
                <li>Community forum participation</li>
                <li>Special discounts on events and courses</li>
                <li>Certificate of membership</li>
              </ul>
            </div>

            <p>Your membership certificate will be generated and made available for download from your member portal.</p>
            
            <p>We encourage you to participate in our upcoming events and connect with fellow members who share your interest in Sanatan Dharma.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>With warm regards,<br>
            <strong>Sanatan Dharma Bikash Nepal Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>Contact us: info@sanatandharma.org | +977-1-4444444</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getMembershipWelcomeText(data: any): string {
    return `
Welcome to Our Community!

Dear ${data.fullName},

Welcome to Sanatan Dharma Bikash Nepal! We are delighted to have you as a member of our community.

Your Membership Details:
- Member ID: ${data.memberId}
- Membership Type: ${data.membershipType}
- Join Date: ${new Date(data.joinDate).toLocaleDateString()}
${data.expiryDate ? `- Expiry Date: ${new Date(data.expiryDate).toLocaleDateString()}` : "- Validity: Lifetime"}

Your Membership Benefits:
- Access to all events and workshops
- Monthly newsletter with updates
- Library access to Sanskrit texts and resources
- Community forum participation
- Special discounts on events and courses
- Certificate of membership

Your membership certificate will be generated and made available for download from your member portal.

We encourage you to participate in our upcoming events and connect with fellow members who share your interest in Sanatan Dharma.

If you have any questions, please don't hesitate to contact us.

With warm regards,
Sanatan Dharma Bikash Nepal Team

Contact us: info@sanatandharma.org | +977-1-4444444
    `
  }

  private getMembershipApprovalHTML(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Membership Approved</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .approval-box { background: white; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Membership Approved!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.fullName},</p>
            <p>Congratulations! Your membership application has been approved.</p>
            
            <div class="approval-box">
              <h3>Membership Activation</h3>
              <p>Your ${data.membershipType} membership is now active and you can start enjoying all the benefits immediately.</p>
              <p><strong>Member ID:</strong> ${data.memberId}</p>
              <p><strong>Certificate Number:</strong> ${data.certificateNumber}</p>
            </div>

            <p>You can now:</p>
            <ul>
              <li>Access your member portal</li>
              <li>Download your membership certificate</li>
              <li>Register for upcoming events</li>
              <li>Access our digital library</li>
            </ul>
            
            <p>Thank you for joining our community!</p>
            
            <p>Best regards,<br>
            <strong>Sanatan Dharma Bikash Nepal Team</strong></p>
          </div>
          <div class="footer">
            <p>Contact us: info@sanatandharma.org | +977-1-4444444</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getMembershipApprovalText(data: any): string {
    return `
Membership Approved!

Dear ${data.fullName},

Congratulations! Your membership application has been approved.

Your ${data.membershipType} membership is now active and you can start enjoying all the benefits immediately.

Member ID: ${data.memberId}
Certificate Number: ${data.certificateNumber}

You can now:
- Access your member portal
- Download your membership certificate
- Register for upcoming events
- Access our digital library

Thank you for joining our community!

Best regards,
Sanatan Dharma Bikash Nepal Team

Contact us: info@sanatandharma.org | +977-1-4444444
    `
  }

  private getEventRegistrationHTML(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Event Registration Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .event-box { background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Registration Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.participantName},</p>
            <p>Your registration for the following event has been confirmed:</p>
            
            <div class="event-box">
              <h3>${data.eventTitle}</h3>
              <p><strong>Date:</strong> ${new Date(data.eventDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
              <p><strong>Venue:</strong> ${data.venue}</p>
              <p><strong>Registration ID:</strong> ${data.registrationId}</p>
              ${data.registrationFee > 0 ? `<p><strong>Registration Fee:</strong> ${data.currency} ${data.registrationFee}</p>` : ""}
            </div>

            <p>Please keep this confirmation email for your records. You may need to present it at the event venue.</p>
            
            ${data.specialRequests ? `<p><strong>Special Requests:</strong> ${data.specialRequests}</p>` : ""}
            
            <p>We look forward to seeing you at the event!</p>
            
            <p>Best regards,<br>
            <strong>Event Organizing Team</strong><br>
            Sanatan Dharma Bikash Nepal</p>
          </div>
          <div class="footer">
            <p>Contact us: ${data.contactEmail} | ${data.contactPhone}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getEventRegistrationText(data: any): string {
    return `
Event Registration Confirmed!

Dear ${data.participantName},

Your registration for the following event has been confirmed:

Event: ${data.eventTitle}
Date: ${new Date(data.eventDate).toLocaleDateString()}
Time: ${data.startTime} - ${data.endTime}
Venue: ${data.venue}
Registration ID: ${data.registrationId}
${data.registrationFee > 0 ? `Registration Fee: ${data.currency} ${data.registrationFee}` : ""}

Please keep this confirmation email for your records. You may need to present it at the event venue.

${data.specialRequests ? `Special Requests: ${data.specialRequests}` : ""}

We look forward to seeing you at the event!

Best regards,
Event Organizing Team
Sanatan Dharma Bikash Nepal

Contact us: ${data.contactEmail} | ${data.contactPhone}
    `
  }

  private getPaymentSuccessHTML(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Successful</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .payment-box { background: white; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
          .amount { font-size: 20px; font-weight: bold; color: #10b981; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Successful!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>Your payment has been processed successfully.</p>
            
            <div class="payment-box">
              <h3>Payment Details</h3>
              <p><strong>Amount:</strong> <span class="amount">${data.currency} ${data.amount}</span></p>
              <p><strong>Payment ID:</strong> ${data.paymentId}</p>
              <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
              <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
              <p><strong>Date:</strong> ${new Date(data.paymentDate).toLocaleDateString()}</p>
              <p><strong>Purpose:</strong> ${data.description}</p>
            </div>

            <p>A receipt has been generated and will be sent to you separately.</p>
            
            <p>Thank you for your payment!</p>
            
            <p>Best regards,<br>
            <strong>Sanatan Dharma Bikash Nepal Team</strong></p>
          </div>
          <div class="footer">
            <p>Contact us: info@sanatandharma.org | +977-1-4444444</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getPaymentSuccessText(data: any): string {
    return `
Payment Successful!

Dear ${data.customerName},

Your payment has been processed successfully.

Payment Details:
- Amount: ${data.currency} ${data.amount}
- Payment ID: ${data.paymentId}
- Transaction ID: ${data.transactionId}
- Payment Method: ${data.paymentMethod}
- Date: ${new Date(data.paymentDate).toLocaleDateString()}
- Purpose: ${data.description}

A receipt has been generated and will be sent to you separately.

Thank you for your payment!

Best regards,
Sanatan Dharma Bikash Nepal Team

Contact us: info@sanatandharma.org | +977-1-4444444
    `
  }

  private getContactFormHTML(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .contact-box { background: white; padding: 15px; border-left: 4px solid #6366f1; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="contact-box">
              <h3>Contact Details</h3>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
              <p><strong>Subject:</strong> ${data.subject}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="contact-box">
              <h3>Message</h3>
              <p>${data.message}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getContactFormText(data: any): string {
    return `
New Contact Form Submission

Contact Details:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || "Not provided"}
- Subject: ${data.subject}
- Submitted: ${new Date().toLocaleString()}

Message:
${data.message}
    `
  }
}

export const emailService = new EmailService()
