import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "data", "subscribers.json");

interface Subscriber {
  email: string;
  created_at: string;
}

function readDb(): Subscriber[] {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeDb(subscribers: Subscriber[]) {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(subscribers, null, 2));
}

export function addSubscriber(email: string): { success: boolean; error?: string } {
  const subscribers = readDb();
  const normalised = email.trim().toLowerCase();
  
  if (subscribers.some(s => s.email === normalised)) {
    return { success: false, error: "Already subscribed." };
  }
  
  subscribers.push({
    email: normalised,
    created_at: new Date().toISOString(),
  });
  
  writeDb(subscribers);
  return { success: true };
}

export function getSubscriberCount(): number {
  return readDb().length;
}

export function getAllSubscribers(): Subscriber[] {
  return readDb().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
