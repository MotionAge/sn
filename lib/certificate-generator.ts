import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function generateCertificate({
  recipientName,
  certificateType,
  serialNumber,
  issueDate,
}: {
  recipientName: string
  certificateType: "membership" | "donation" | "event"
  serialNumber: string
  issueDate: Date
}) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()

  // Add a blank page
  const page = pdfDoc.addPage([595.28, 841.89]) // A4 size

  // Get the standard font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Set the font size
  const fontSize = 12
  const titleFontSize = 24
  const subtitleFontSize = 16

  // Get the width and height of the page
  const { width, height } = page.getSize()

  // Draw a border
  page.drawRectangle({
    x: 50,
    y: 50,
    width: width - 100,
    height: height - 100,
    borderColor: rgb(0.8, 0.4, 0),
    borderWidth: 2,
  })

  // Draw the organization name
  page.drawText("Sanatan Dharma Bigyan Samaj", {
    x: width / 2 - 150,
    y: height - 100,
    size: titleFontSize,
    font: helveticaBold,
    color: rgb(0.8, 0.4, 0),
  })

  // Draw the certificate type
  let certificateTitle = ""
  switch (certificateType) {
    case "membership":
      certificateTitle = "Certificate of Membership"
      break
    case "donation":
      certificateTitle = "Donation Receipt"
      break
    case "event":
      certificateTitle = "Certificate of Participation"
      break
  }

  page.drawText(certificateTitle, {
    x: width / 2 - 100,
    y: height - 150,
    size: subtitleFontSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })

  // Draw the recipient name
  page.drawText("This is to certify that", {
    x: width / 2 - 70,
    y: height - 250,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  })

  page.drawText(recipientName, {
    x: width / 2 - recipientName.length * 4,
    y: height - 280,
    size: subtitleFontSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })

  // Draw certificate text based on type
  let certificateText = ""
  switch (certificateType) {
    case "membership":
      certificateText = "is a registered member of Sanatan Dharma Bigyan Samaj."
      break
    case "donation":
      certificateText = "has made a generous donation to Sanatan Dharma Bigyan Samaj."
      break
    case "event":
      certificateText = "has participated in an event organized by Sanatan Dharma Bigyan Samaj."
      break
  }

  page.drawText(certificateText, {
    x: width / 2 - 180,
    y: height - 320,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  })

  // Draw the serial number
  page.drawText(`Serial Number: ${serialNumber}`, {
    x: width / 2 - 80,
    y: height - 380,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  })

  // Draw the issue date
  const formattedDate = issueDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  page.drawText(`Issue Date: ${formattedDate}`, {
    x: width / 2 - 70,
    y: height - 410,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  })

  // Draw signature line
  page.drawLine({
    start: { x: width / 2 - 100, y: 150 },
    end: { x: width / 2 + 100, y: 150 },
    thickness: 1,
    color: rgb(0, 0, 0),
  })

  page.drawText("Authorized Signature", {
    x: width / 2 - 60,
    y: 130,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  })

  // Draw organization seal placeholder
  page.drawCircle({
    x: width - 100,
    y: 150,
    size: 40,
    borderColor: rgb(0.8, 0.4, 0),
    borderWidth: 2,
  })

  page.drawText("Seal", {
    x: width - 110,
    y: 145,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0.8, 0.4, 0),
  })

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save()

  return pdfBytes
}
