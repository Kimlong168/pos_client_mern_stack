export const emailTemplates = [
  {
    type: "Employee Work Assignment Confirmation",
    subject: "Confirmation of New Work Assignment",
    body: `
        <p>Dear [Employee's Name],</p>
        <p>I hope this email finds you well.</p>
        <p>This is to confirm that you have been assigned the responsibility of <strong>[Project/Task Name]</strong>, effective from <strong>[Start Date]</strong>. Please ensure all deliverables are completed by <strong>[End Date]</strong>. You will be working closely with <strong>[Team Members/Supervisor's Name]</strong> on this task.</p>
        <p>If you have any questions or need support, feel free to reach out.</p>
        <p>Best regards,<br>Tomato Team</p>
      `,
  },
  {
    type: "Supplier Order Confirmation Request",
    subject: "Request for Order Confirmation",
    body: `
        <p>Dear [Supplier's Name],</p>
        <p>I hope you are doing well.</p>
        <p>This is a follow-up regarding the recent order placed for <strong>[Product/Service Name]</strong>, reference number <strong>[Order Number]</strong>. We kindly request confirmation of the order details, including expected delivery dates and payment terms.</p>
        <p>Please ensure all documentation is provided, and let us know if there are any changes or issues.</p>
        <p>We appreciate your prompt response.</p>
        <p>Best regards,<br>Tomato Team</p>
      `,
  },
  {
    type: "Supplier Payment Reminder",
    subject: "Payment Reminder for Invoice #[Invoice Number]",
    body: `
        <p>Dear [Supplier's Name],</p>
        <p>I hope this email finds you well.</p>
        <p>This is a friendly reminder regarding the outstanding payment for invoice <strong>#[Invoice Number]</strong> dated <strong>[Invoice Date]</strong>, which was due on <strong>[Due Date]</strong>. Kindly process the payment at your earliest convenience.</p>
        <p>Please let us know if you need any further details or have any questions regarding the invoice.</p>
        <p>Thank you for your prompt attention to this matter.</p>
        <p>Best regards,<br>Tomato Team</p>
      `,
  },
];

export const telegramMessageTemplate = [
  {
    type: "Employee Work Assignment Confirmation",
    subject: "Confirmation of New Work Assignment",
    body: `Dear [Employee's Name],

I hope this message finds you well.

This is to confirm that you have been assigned the responsibility of [Project/Task Name], effective from [Start Date]. Please ensure all deliverables are completed by [End Date]. You will be working closely with [Team Members/Supervisor's Name] on this task.

If you have any questions or need support, feel free to reach out.

Best regards,
Tomato Team`,
  },
  {
    type: "Supplier Order Confirmation Request",
    subject: "Request for Order Confirmation",
    body: `Dear [Supplier's Name],

I hope you are doing well.

This is a follow-up regarding the recent order placed for [Product/Service Name], reference number [Order Number]. We kindly request confirmation of the order details, including expected delivery dates and payment terms.

Please ensure all documentation is provided, and let us know if there are any changes or issues.

We appreciate your prompt response.

Best regards,
Tomato Team`,
  },
  {
    type: "Supplier Payment Reminder",
    subject: "Payment Reminder for Invoice #[Invoice Number]",
    body: `Dear [Supplier's Name],

I hope this message finds you well.

This is a friendly reminder regarding the outstanding payment for invoice #[Invoice Number] dated [Invoice Date], which was due on [Due Date]. Kindly process the payment at your earliest convenience.

Please let us know if you need any further details or have any questions regarding the invoice.

Thank you for your prompt attention to this matter.

Best regards,
Tomato Team`,
  },
];
