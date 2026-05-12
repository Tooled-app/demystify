import { getAllSubscribers, getSubscriberCount } from "../../../../lib/subscribers";

const ADMIN_TOKEN = process.env.ADMIN_API_KEY || "dev-admin-key";

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization");
  const token = auth?.replace("Bearer ", "");
  
  if (token !== ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const subscribers = getAllSubscribers();
    const count = getSubscriberCount();
    
    return new Response(JSON.stringify({ count, subscribers }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin subscribers error:", error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
