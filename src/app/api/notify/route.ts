import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name, queueName, position } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'QueueEase <notifications@resend.dev>', // Use a verified domain in production
      to: [email],
      subject: `Your turn is coming up at ${queueName}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">QueueUpdate: ${queueName}</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>We're just letting you know that your turn is coming up soon!</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Your Token Number</p>
            <h1 style="margin: 5px 0; font-size: 48px; color: #1f2937;">#${position}</h1>
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #2563eb;">You are almost next!</p>
          </div>
          <p>Please head back to the counter now to ensure you don't miss your turn.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">Powered by QueueEase</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
