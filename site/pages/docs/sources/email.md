---
layout: layouts/docs.liquid
title: Email Source
description: Receive and track inbound emails in Outrun via MX records or Gmail forwarding. Store emails as activities with full metadata.
metaTitle: Email Integration - Outrun Source Documentation
metaDescription: Complete guide to integrating inbound email with Outrun. Setup methods, field mappings, webhook configuration, and best practices.
permalink: /docs/sources/email/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Sources
    url: /docs/sources/
  - title: Email
    url: /docs/sources/email/
---

# Email Source

Receive inbound emails in Outrun and store them as activities. The email source supports two setup methods: organization-wide MX record routing and per-user Gmail forwarding.

<div class="bg-pink-500 bg-opacity-10 border border-pink-500  p-6 my-6">
  <h3 class="text-pink-400 text-lg font-semibold mb-3">📧 Inbound Only</h3>
  <p class="text-gray-300">This is a receive-only source. Emails are stored as activities for tracking and analysis. Sending or replying to emails is not supported.</p>
</div>

## Supported Objects

Email maps to a single standardized object type:

### 📋 Activities (from Emails)
- **Source Object**: `emails`
- **Primary ID**: Message ID
- **Key Fields**: Subject, sender, recipients, body, attachments metadata

## Setup Methods

### Method 1: MX Record (Organization-wide)

Route all inbound email for a domain through Outrun by pointing your DNS MX records at your source-specific subdomain.

**Best for**: Capturing all inbound email across your entire organization.

**Setup**:
1. Create an Email source in Outrun
2. Add an MX record in your domain's DNS:
   - **Type**: MX
   - **Priority**: 10
   - **Target**: `{sourceId}.customer.getoutrun.com`

### Method 2: Gmail Forwarding (Single User)

Forward emails from an individual Gmail account to Outrun.

**Best for**: Tracking a specific mailbox without changing DNS.

**Setup**:
1. Create an Email source in Outrun
2. In Gmail, go to **Settings > Forwarding and POP/IMAP**
3. Click **Add a forwarding address**
4. Enter: `{sourceId}@customer.getoutrun.com`
5. Confirm the forwarding via the verification email
6. Select **Forward a copy of incoming mail to** and choose the address

## Field Mappings

### Activities (Emails)

| Outrun Field | Email Field | Type | Description |
|--------------|------------|------|-------------|
| `type` | (literal `message`) | String | Activity type, always "message" |
| `content` | `StrippedTextReply` | String | Reply-only text content |
| `metadata.subject` | `Subject` | String | Email subject line |
| `metadata.from` | `From` | String | Sender email address |
| `metadata.fromName` | `FromName` | String | Sender display name |
| `metadata.to` | `To` | String | Recipient address |
| `metadata.cc` | `Cc` | String | CC recipients |
| `metadata.htmlBody` | `HtmlBody` | String | Full HTML body |
| `metadata.textBody` | `TextBody` | String | Full plain text body |
| `metadata.replyTo` | `ReplyTo` | String | Reply-to address |
| `metadata.date` | `Date` | String | Email timestamp |
| `metadata.messageId` | `MessageID` | String | Unique message identifier |
| `metadata.attachments` | `Attachments` | Array | Attachment metadata (name, type, size) |

### Attachment Handling

Attachment file content (base64 data) is **not stored**. Only metadata is retained:

| Field | Description |
|-------|-------------|
| `Name` | Attachment filename |
| `ContentType` | MIME type (e.g., `application/pdf`) |
| `ContentLength` | File size in bytes |

## Sync Behavior

### Real-time Processing
- **Delivery**: Emails arrive via webhook in real time (no polling)
- **Processing**: Each email is immediately written to the `stream_data` table
- **Consolidation**: The listener service picks up new records and consolidates them into activities

### Data Pipeline

1. Resend receives the inbound email
2. Resend POSTs the webhook event to `/api/v1/webhook/email`
3. The stream service extracts the source ID from the recipient address
4. Raw email data (minus attachment content) is stored in the `stream_data` table
5. The listener triggers `consolidateRecord` which normalizes the data
6. The `consolidateActivities` job creates the activity record

## Deduplication

Emails are deduplicated using the `MessageID` field as the external ID. If the same email is delivered twice (e.g., via both MX and forwarding), only one activity is created.

## System Nuances

### Email-Specific Considerations

1. **Source ID in Address**: Each email source gets a unique address using the source's ID
2. **Multiple Sources**: A workspace can have multiple email sources, each with its own address
3. **No Authentication Required**: Email sources don't use OAuth tokens -- they receive data via webhooks
4. **Attachment Limits**: Attachment content is stripped to avoid storage bloat; only metadata is kept
5. **HTML Sanitization**: HTML body content is stored as-is; sanitize before rendering in UI

### Address Formats

| Method | Address Format |
|--------|---------------|
| MX Record | `*@{sourceId}.customer.getoutrun.com` |
| Gmail Forwarding | `{sourceId}@customer.getoutrun.com` |

## Best Practices

### Setup Recommendations

1. **Choose the right method**: Use MX records for organization-wide capture, Gmail forwarding for individual mailboxes
2. **Test first**: Send a test email after setup to verify the pipeline works end-to-end
3. **DNS propagation**: MX record changes can take up to 48 hours to propagate
4. **Gmail verification**: Gmail requires you to confirm the forwarding address via a verification email

### Monitoring

1. **Stream history**: Check the `stream_history` table for delivery records
2. **Webhook logs**: Monitor the stream service logs for any delivery errors
3. **Activity count**: Verify activities are being created in the workspace

## Troubleshooting

### Common Issues

**Emails not arriving**
- Verify DNS MX records are correctly configured and propagated
- Check that the Resend inbound webhook URL is accessible
- Confirm the stream route exists in the `stream_routes` table

**Source not found errors**
- Verify the source ID in the recipient address matches an active source
- Check that the `streamRoutes` document has the correct `sourceId` and `workspaceId`

**Missing email content**
- Text body may be empty for new (non-reply) emails -- check `TextBody` or `HtmlBody` in metadata
- Attachment content is intentionally stripped; only metadata is stored

### Support Resources

- **Resend Inbound Documentation**: [resend.com/docs/dashboard/webhooks/introduction](https://resend.com/docs/dashboard/webhooks/introduction)
- **Outrun Support**: [support@getoutrun.com](mailto:support@getoutrun.com)

---

*Ready to set up email tracking? Navigate to Sources > Add Source > Email in your workspace to get started.*
