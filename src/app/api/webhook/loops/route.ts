import { NextResponse } from "next/server";
import { webhookStorage } from "../../../utils/storage";

export async function POST(request: Request) {
  // const webhookSecret = process.env.WEBHOOK_SECRET;
  // const secretHeader = request.headers.get("X-Webhook-Secret");

  // if (secretHeader !== webhookSecret) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const payload = await request.json();

  // Transform the payload for Loops
  const loopsPayload = {
    email: payload.record.email,
    userId: payload.record.id,
    userType: payload.record.user_type,
  };

  // Store the webhook data
  webhookStorage.addEntry({
    timestamp: new Date().toISOString(),
    payload,
    transformed: loopsPayload,
  });

  // Forward to Loops based on operation type
  // const loopsResponse = await forwardToLoops(payload.type, loopsPayload);
  return NextResponse.json({ success: true });
  // , loopsResponse });
}

export async function GET() {
  return NextResponse.json({ history: webhookStorage.getHistory() });
}

// async function forwardToLoops(operation: string, payload: unknown) {
//   const loopsApiKey = process.env.LOOPS_API_KEY;
//   const endpoints = {
//     INSERT: {
//       url: "https://app.loops.so/api/v1/contacts/create",
//       method: "POST",
//     },
//     UPDATE: {
//       url: "https://app.loops.so/api/v1/contacts/update",
//       method: "PUT",
//     },
//   };

//   const config = endpoints[operation as keyof typeof endpoints];
//   if (!config) {
//     throw new Error(`Unsupported operation: ${operation}`);
//   }

//   const response = await fetch(config.url, {
//     method: config.method,
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${loopsApiKey}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   return response.json();
// }
