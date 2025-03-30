// services/SchedulerService.ts
import schedule from "node-schedule";
import { supabase } from "@/lib/supabase";
import { SmsService } from "./SmsService";

export class SchedulerService {
  private smsService: SmsService;

  constructor() {
    this.smsService = new SmsService();
  }

  async getFlaskPrediction(uid: string): Promise<string> {
    try {
      const response = await fetch(`${process.env.FLASK_API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      });

      if (!response.ok) {
        throw new Error(`Flask API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.formatPredictionMessage(data);
    } catch (error) {
      console.error(`Error getting prediction for uid ${uid}:`, error);
      throw error;
    }
  }

  private formatPredictionMessage(predictionData: any): string {
    // Format your prediction data into a readable message
    return `Your insights for today:\n${predictionData.summary}`;
  }

  async processUser(user: any) {
    try {
      // Get prediction from Flask
      const predictionMessage = await this.getFlaskPrediction(user.uid);

      // Send SMS
      const phoneNumber = user.phone_no;
      await this.smsService.sendSms(phoneNumber, predictionMessage);

      // Log successful processing
      await this.logProcessing(user.uid, true);
    } catch (error) {
      console.error(`Error processing user ${user.uid}:`, error);
      await this.logProcessing(user.uid, false, error);
    }
  }

  async logProcessing(uid: string, success: boolean, error?: any) {
    try {
      await supabase.from("processing_logs").insert({
        uid,
        success,
        error: error ? String(error) : null,
        processed_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("Error logging processing:", logError);
    }
  }

  async processAllUsers() {
    try {
      // Get all subscribed users
      const { data: users, error } = await supabase
        .from("user")
        .select("uid, phone_no")
        .eq("Subscribed", true);

      if (error) throw error;

      // Process each user
      await Promise.all(users.map((user) => this.processUser(user)));
    } catch (error) {
      console.error("Error processing users:", error);
    }
  }

  startScheduler() {
    // Schedule job to run at 7 AM every day
    schedule.scheduleJob("0 7 * * *", async () => {
      console.log("Starting daily processing at:", new Date());
      await this.processAllUsers();
    });

    console.log("Scheduler started");
  }
}
