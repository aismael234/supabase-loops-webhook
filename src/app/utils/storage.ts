export interface WebhookEntry {
  timestamp: string;
  payload: any;
  transformed: {
    email: string;
    userId: string;
  };
}

class WebhookStorage {
  private history: WebhookEntry[] = [];
  private readonly MAX_HISTORY = 10;

  addEntry(entry: WebhookEntry): void {
    this.history.unshift(entry);
    this.history = this.history.slice(0, this.MAX_HISTORY);
  }

  getHistory(): WebhookEntry[] {
    return this.history;
  }
}

// Create a singleton instance
export const webhookStorage = new WebhookStorage(); 