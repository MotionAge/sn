import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { createClient } from "./supabase"
import { put } from "@vercel/blob"

interface CertificateData {
  recipientName: string
  certificateType: "membership" | "donation" | "event_participation" | "achievement"
  serialNumber: string
  issueDate: Date
  membershipType?: string
  donationAmount?: number
  eventName?: string
  achievementTitle?: string
  validUntil?: Date
}

interface ReceiptData {
  receiptNumber: string
  donorName: string
  amount: number
  currency: string
  donationDate: Date
  paymentMethod: string
  purpose?: string
  transactionId?: string
}

class PDFGenerator {
  private supabase = createClient()

  async generateCertificate(data: CertificateData): Promise<{ pdfUrl: string; pdfBytes: Uint8Array }> {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([841.89, 595.28]) // A4 landscape

    // Embed fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

    const { width, height } = page.getSize()

    // Colors
    const orangeColor = rgb(0.97, 0.45, 0.09) // #f97316
    const darkGray = rgb(0.2, 0.2, 0.2)
    const lightGray = rgb(0.5, 0.5, 0.5)

    // Draw decorative border
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: orangeColor,
      borderWidth: 3,
    })

    page.drawRectangle({
      x: 40,
      y: 40,
      width: width - 80,
      height: height - 80,
      borderColor: orangeColor,
      borderWidth: 1,
    })

    // Header
    page.drawText("SANATAN DHARMA BIKASH NEPAL", {
      x: width / 2 - 180,
      y: height - 80,
      size: 24,
      font: helveticaBold,
      color: orangeColor,
    })

    page.drawText("सनातन धर्म बिकास नेपाल", {
      x: width / 2 - 120,
      y: height - 110,
      size: 16,
      font: helveticaFont,
      color: darkGray,
    })

    // Certificate title
    let certificateTitle = ""
    let certificateSubtitle = ""

    switch (data.certificateType) {
      case "membership":
        certificateTitle = "CERTIFICATE OF MEMBERSHIP"
        certificateSubtitle = "सदस्यता प्रमाणपत्र"
        break
      case "donation":
        certificateTitle = "DONATION RECEIPT"
        certificateSubtitle = "दान रसिद"
        break
      case "event_participation":
        certificateTitle = "CERTIFICATE OF PARTICIPATION"
        certificateSubtitle = "सहभागिता प्रमाणपत्र"
        break
      case "achievement":
        certificateTitle = "CERTIFICATE OF ACHIEVEMENT"
        certificateSubtitle = "उपलब्धि प्रमाणपत्र"
        break
    }

    page.drawText(certificateTitle, {
      x: width / 2 - certificateTitle.length * 6,
      y: height - 160,
      size: 20,
      font: timesRomanBold,
      color: darkGray,
    })

    page.drawText(certificateSubtitle, {
      x: width / 2 - certificateSubtitle.length * 4,
      y: height - 185,
      size: 14,
      font: helveticaFont,
      color: lightGray,
    })

    // Main content
    const mainY = height - 250

    page.drawText("This is to certify that", {
      x: width / 2 - 80,
      y: mainY,
      size: 14,
      font: timesRoman,
      color: darkGray,
    })

    // Recipient name (larger and bold)
    page.drawText(data.recipientName, {
      x: width / 2 - data.recipientName.length * 8,
      y: mainY - 40,
      size: 24,
      font: timesRomanBold,
      color: orangeColor,
    })

    // Certificate-specific content
    let contentText = ""
    switch (data.certificateType) {
      case "membership":
        contentText = `is a registered ${data.membershipType} member of Sanatan Dharma Bikash Nepal`
        break
      case "donation":
        contentText = `has made a generous donation of ${data.donationAmount} NPR to support our mission`
        break
      case "event_participation":
        contentText = `has successfully participated in "${data.eventName}"`
        break
      case "achievement":
        contentText = `has achieved "${data.achievementTitle}"`
        break
    }

    page.drawText(contentText, {
      x: width / 2 - contentText.length * 3,
      y: mainY - 80,
      size: 12,
      font: timesRoman,
      color: darkGray,
    })

    // Additional content for membership
    if (data.certificateType === "membership") {
      page.drawText("and is entitled to all the rights and privileges thereof.", {
        x: width / 2 - 140,
        y: mainY - 100,
        size: 12,
        font: timesRoman,
        color: darkGray,
      })
    }

    // Certificate details
    const detailsY = mainY - 150

    page.drawText(`Certificate No: ${data.serialNumber}`, {
      x: 80,
      y: detailsY,
      size: 10,
      font: helveticaFont,
      color: lightGray,
    })

    page.drawText(
      `Issue Date: ${data.issueDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      {
        x: 80,
        y: detailsY - 20,
        size: 10,
        font: helveticaFont,
        color: lightGray,
      },
    )

    if (data.validUntil) {
      page.drawText(
        `Valid Until: ${data.validUntil.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        {
          x: 80,
          y: detailsY - 40,
          size: 10,
          font: helveticaFont,
          color: lightGray,
        },
      )
    }

    // Signature section
    const signatureY = 120

    // Signature line
    page.drawLine({
      start: { x: width - 250, y: signatureY },
      end: { x: width - 100, y: signatureY },
      thickness: 1,
      color: darkGray,
    })

    page.drawText("Authorized Signature", {
      x: width - 220,
      y: signatureY - 20,
      size: 10,
      font: helveticaFont,
      color: lightGray,
    })

    // Organization seal (placeholder circle)
    page.drawCircle({
      x: 120,
      y: signatureY + 20,
      size: 30,
      borderColor: orangeColor,
      borderWidth: 2,
    })

    page.drawText("OFFICIAL", {
      x: 105,
      y: signatureY + 25,
      size: 8,
      font: helveticaBold,
      color: orangeColor,
    })

    page.drawText("SEAL", {
      x: 110,
      y: signatureY + 15,
      size: 8,
      font: helveticaBold,
      color: orangeColor,
    })

    // Footer
    page.drawText("This certificate is digitally generated and verified.", {
      x: width / 2 - 120,
      y: 60,
      size: 8,
      font: helveticaFont,
      color: lightGray,
    })

    page.drawText("For verification, visit: https://sanatandharma.org/verify", {
      x: width / 2 - 130,
      y: 50,
      size: 8,
      font: helveticaFont,
      color: lightGray,
    })

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save()

    // Upload to blob storage
    const fileName = `certificates/${data.certificateType}-${data.serialNumber}.pdf`
    const blob = await put(fileName, Buffer.from(pdfBytes), {
      access: "public",
      contentType: "application/pdf",
    })

    return {
      pdfUrl: blob.url,
      pdfBytes,
    }
  }

  async generateDonationReceipt(data: ReceiptData): Promise<{ pdfUrl: string; pdfBytes: Uint8Array }> {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 portrait

    // Embed fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const { width, height } = page.getSize()

    // Colors
    const orangeColor = rgb(0.97, 0.45, 0.09)
    const darkGray = rgb(0.2, 0.2, 0.2)
    const lightGray = rgb(0.5, 0.5, 0.5)

    // Header
    page.drawRectangle({
      x: 0,
      y: height - 120,
      width: width,
      height: 120,
      color: rgb(0.98, 0.98, 0.98),
    })

    page.drawText("DONATION RECEIPT", {
      x: 50,
      y: height - 60,
      size: 24,
      font: helveticaBold,
      color: orangeColor,
    })

    page.drawText("SANATAN DHARMA BIKASH NEPAL", {
      x: 50,
      y: height - 85,
      size: 14,
      font: helveticaBold,
      color: darkGray,
    })

    page.drawText("सनातन धर्म बिकास नेपाल", {
      x: 50,
      y: height - 105,
      size: 12,
      font: helveticaFont,
      color: lightGray,
    })

    // Receipt number (top right)
    page.drawText(`Receipt #: ${data.receiptNumber}`, {
      x: width - 200,
      y: height - 60,
      size: 12,
      font: helveticaBold,
      color: darkGray,
    })

    page.drawText(`Date: ${data.donationDate.toLocaleDateString()}`, {
      x: width - 200,
      y: height - 80,
      size: 10,
      font: helveticaFont,
      color: lightGray,
    })

    // Donor information
    let currentY = height - 180

    page.drawText("DONOR INFORMATION", {
      x: 50,
      y: currentY,
      size: 14,
      font: helveticaBold,
      color: darkGray,
    })

    currentY -= 30

    page.drawText(`Name: ${data.donorName}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: helveticaFont,
      color: darkGray,
    })

    currentY -= 20

    page.drawText(`Date of Donation: ${data.donationDate.toLocaleDateString()}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: helveticaFont,
      color: darkGray,
    })

    // Donation details
    currentY -= 60

    page.drawText("DONATION DETAILS", {
      x: 50,
      y: currentY,
      size: 14,
      font: helveticaBold,
      color: darkGray,
    })

    currentY -= 30

    // Amount box
    page.drawRectangle({
      x: 50,
      y: currentY - 40,
      width: width - 100,
      height: 60,
      borderColor: orangeColor,
      borderWidth: 2,
    })

    page.drawText("AMOUNT DONATED", {
      x: 70,
      y: currentY - 10,
      size: 10,
      font: helveticaFont,
      color: lightGray,
    })

    page.drawText(`${data.currency} ${data.amount.toLocaleString()}`, {
      x: 70,
      y: currentY - 30,
      size: 20,
      font: helveticaBold,
      color: orangeColor,
    })

    currentY -= 80

    if (data.purpose) {
      page.drawText(`Purpose: ${data.purpose}`, {
        x: 50,
        y: currentY,
        size: 12,
        font: helveticaFont,
        color: darkGray,
      })
      currentY -= 20
    }

    page.drawText(`Payment Method: ${data.paymentMethod}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: helveticaFont,
      color: darkGray,
    })

    if (data.transactionId) {
      currentY -= 20
      page.drawText(`Transaction ID: ${data.transactionId}`, {
        x: 50,
        y: currentY,
        size: 12,
        font: helveticaFont,
        color: darkGray,
      })
    }

    // Tax information
    currentY -= 60

    page.drawText("TAX INFORMATION", {
      x: 50,
      y: currentY,
      size: 14,
      font: helveticaBold,
      color: darkGray,
    })

    currentY -= 30

    page.drawText("This donation is eligible for tax deduction under applicable laws.", {
      x: 50,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: darkGray,
    })

    currentY -= 15

    page.drawText("Please consult your tax advisor for specific deduction amounts.", {
      x: 50,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: lightGray,
    })

    // Organization information
    currentY -= 60

    page.drawText("ORGANIZATION INFORMATION", {
      x: 50,
      y: currentY,
      size: 14,
      font: helveticaBold,
      color: darkGray,
    })

    currentY -= 30

    page.drawText("Sanatan Dharma Bikash Nepal", {
      x: 50,
      y: currentY,
      size: 12,
      font: helveticaBold,
      color: darkGray,
    })

    currentY -= 20

    page.drawText("Address: Kathmandu, Nepal", {
      x: 50,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: darkGray,
    })

    currentY -= 15

    page.drawText("Phone: +977-1-4444444", {
      x: 50,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: darkGray,
    })

    currentY -= 15

    page.drawText("Email: info@sanatandharma.org", {
      x: 50,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: darkGray,
    })

    // Footer
    page.drawText("Thank you for your generous support!", {
      x: width / 2 - 100,
      y: 100,
      size: 12,
      font: helveticaBold,
      color: orangeColor,
    })

    page.drawText("This receipt is digitally generated and does not require a signature.", {
      x: width / 2 - 150,
      y: 80,
      size: 8,
      font: helveticaFont,
      color: lightGray,
    })

    page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
      x: width / 2 - 80,
      y: 60,
      size: 8,
      font: helveticaFont,
      color: lightGray,
    })

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save()

    // Upload to blob storage
    const fileName = `receipts/donation-${data.receiptNumber}.pdf`
    const blob = await put(fileName, Buffer.from(pdfBytes), {
      access: "public",
      contentType: "application/pdf",
    })

    return {
      pdfUrl: blob.url,
      pdfBytes,
    }
  }

  async generateMembershipReceipt(memberData: any): Promise<{ pdfUrl: string; pdfBytes: Uint8Array }> {
    const receiptData: ReceiptData = {
      receiptNumber: `MEM-${memberData.member_id}`,
      donorName: memberData.full_name,
      amount: memberData.payment_amount,
      currency: "NPR",
      donationDate: new Date(memberData.join_date),
      paymentMethod: memberData.payment_method,
      purpose: `${memberData.membership_type} Membership Fee`,
      transactionId: memberData.transaction_id,
    }

    return this.generateDonationReceipt(receiptData)
  }

  async generateEventReceipt(registrationData: any, eventData: any): Promise<{ pdfUrl: string; pdfBytes: Uint8Array }> {
    const receiptData: ReceiptData = {
      receiptNumber: `EVT-${registrationData.registration_id}`,
      donorName: registrationData.participant_name,
      amount: registrationData.registration_fee,
      currency: "NPR",
      donationDate: new Date(registrationData.registration_date),
      paymentMethod: registrationData.payment_method,
      purpose: `Event Registration - ${eventData.title}`,
      transactionId: registrationData.transaction_id,
    }

    return this.generateDonationReceipt(receiptData)
  }
}

export const pdfGenerator = new PDFGenerator()
