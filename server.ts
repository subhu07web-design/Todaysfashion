import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for sending order emails
  app.post("/api/orders", async (req, res) => {
    const { firstName, lastName, email, phone, address, city, pinCode, items, total } = req.body;

    // Configure nodemailer with Gmail
    // Note: The user MUST provide GMAIL_USER and GMAIL_PASS (App Password) in environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price.toLocaleString()}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Today's Fashion Order" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_RECIPIENT || 'daskajaldas780@gmail.com', // User's email as recipient
      subject: `New Order Received - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #059669; text-transform: uppercase; letter-spacing: 2px;">New Order Details</h2>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          
          <h3 style="color: #374151;">Customer Information</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Address:</strong> ${address}, ${city} - ${pinCode}</p>
          
          <h3 style="color: #374151; margin-top: 30px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Item</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Qty</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 20px 10px 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 20px 10px 10px; font-weight: bold; color: #059669; font-size: 1.2em;">₹${total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 40px; padding: 20px; background-color: #f0fdf4; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #166534; font-weight: bold;">Today's Fashion - North Lakhimpur</p>
          </div>
        </div>
      `,
    };

    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        throw new Error("GMAIL_USER or GMAIL_PASS not configured in environment variables.");
      }

      // 0. Send to Google Apps Script
      try {
        const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwtWH7IJ_tCj5w4wyez5rj3xuw8NxHlMOaSODJR8x_LSd4nb5FcSRtWVkNFWaZfXjZhwg/exec';
        
        // Prepare data for Google Sheets as requested
        const sheetData = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone || '',
          product: items.map((item: any) => `${item.name} (x${item.quantity})`).join(', '),
          quantity: items.reduce((acc: number, item: any) => acc + item.quantity, 0),
          price: total,
          address: address,
          city: city,
          pin: pinCode,
          timestamp: new Date().toLocaleString()
        };

        await fetch(googleScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetData),
        });
        console.log('Data sent to Google Apps Script successfully');
      } catch (googleError) {
        console.error('Error sending to Google Apps Script:', googleError);
        // We don't fail the whole request if Google Script fails
      }

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Order email sent successfully" });
    } catch (error: any) {
      console.error("Error sending order email:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to send order email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
