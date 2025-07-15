# ConvertKit Integration Guide for KEEP Invitations

## Overview
This guide explains how to integrate ConvertKit with the KEEP invitation system to automatically send invitation emails.

## Setup Steps

### 1. Create Custom Fields in ConvertKit
In your ConvertKit account, create these custom fields:
- `invite_link` - The unique signup URL
- `user_role` - The role (attorney/paralegal/admin)
- `expires_at` - When the invitation expires

### 2. Create an Email Template
Create a new email template in ConvertKit with:

```html
Subject: You're invited to join KEEP Protocol

Hi {{ subscriber.first_name | default: "there" }},

You've been invited to join KEEP Protocol as a {{ subscriber.user_role }}.

Click the link below to create your account:
{{ subscriber.invite_link }}

This invitation expires on {{ subscriber.expires_at }}.

Best regards,
The KEEP Team
```

### 3. Set Up Automation
Create an automation that:
1. Triggers when a subscriber is tagged with "KEEP_Invitation"
2. Sends the invitation email
3. Waits 3 days, then sends a reminder if not accepted
4. Removes the tag after 7 days

### 4. Manual Process (Current)
Until API integration is built:

1. Click "Invite New User" in the admin panel
2. Enter the email and select role
3. Copy the invitation link from the toast notification
4. In ConvertKit:
   - Add a new subscriber with the email
   - Set custom field `invite_link` to the copied URL
   - Set custom field `user_role` to the selected role
   - Tag with "KEEP_Invitation"

### 5. Future API Integration
To automate this process, you could:

```javascript
// Example ConvertKit API integration
async function sendInviteViaConvertKit(email, inviteLink, role) {
  const response = await fetch('https://api.convertkit.com/v3/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: process.env.CONVERTKIT_API_KEY,
      email: email,
      fields: {
        invite_link: inviteLink,
        user_role: role,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      },
      tags: ['KEEP_Invitation']
    })
  });
  
  return response.json();
}
```

## Benefits of Using ConvertKit
- Leverages your existing email infrastructure
- Professional email delivery with tracking
- Automated follow-ups and reminders
- Easy to manage invitation campaigns
- Built-in unsubscribe handling

## Security Considerations
- Invitation links contain secure tokens
- Links expire after 7 days
- Each link can only be used once
- Tokens are cryptographically secure

## Testing
1. Create a test invitation
2. Add to ConvertKit with test email
3. Verify email delivery
4. Test the signup flow
5. Confirm account creation