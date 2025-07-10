# rsvpy: Event Management Application

Check it out at <a href="https://rsvpy.lol">https://rsvpy.lol</a>

## What problem does it solve?

I noticed that lots of casual groups/societies used WhatsApp to organise their events. The typical format would involve the organiser sending a message with the event details, followed by an empty numbered list. Those who want to join would then copy the most recent list, and add their name to it. The same process would be used to verify that attendees have paid their share of the event cost. This is very inefficient. <b>rsvpy</b> seeks to streamline this entire process on a singular, easy-to-use platform.

## Features

### Organisers

- Create new events
- Re-run old events
- Invite attendees (by sharing an invite link, or sending an email)
- Track who has and hasn't paid
- Request payment from all unpaid attendees

### Attendees

- Join events
- Keep updates on event changes
- Be reminded of upcoming events
- Mark payments by cash/bank transfer
- Be notified of newly freed-up spots.

NOTE: currently, attendees can only mark whether they have paid or not. Payments are not managed through rsvpy (e.g. with Stripe) so that unnecessary additional fees are avoided. Stripe, for example, takes a percentage + a fixed cent amount, which undesirably adds to the cost of organising/joining events.

## Technologies/Libraries used

Next.js, Tailwind, NextAuth, AWS S3 Storage, Postgres Prisma, Resend, React Hook Form
