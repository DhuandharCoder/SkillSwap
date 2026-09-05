import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

// Twilio credentials specified by prompt
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_API_KEY_SID = process.env.TWILIO_API_KEY_SID;
const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET;
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "SkillSwap", campus: "MITS Gwalior" });
});

// Proxy route for Twilio SMS (solves browser CORS restrictions)
app.post("/api/send-otp", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    let targetNumber = (phoneNumber || "9244082841").trim();
    if (!targetNumber.startsWith("+")) {
      // Default to India country code +91 for 10-digit Indian numbers
      if (targetNumber.length === 10) {
        targetNumber = `+91${targetNumber}`;
      } else {
        targetNumber = `+${targetNumber}`;
      }
    }

    const authString = Buffer.from(`${TWILIO_API_KEY_SID}:${TWILIO_API_KEY_SECRET}`).toString("base64");
    
    const params = new URLSearchParams();
    params.append("To", targetNumber);
    params.append("From", TWILIO_FROM_NUMBER);
    params.append("Body", "Your OTP for SkillSwap is 234689");

    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await twilioResponse.json();

    if (twilioResponse.status === 201) {
      return res.status(201).json({
        success: true,
        message: "SMS OTP successfully dispatched via Twilio",
        sid: data.sid,
        target: targetNumber,
      });
    } else {
      console.warn("Twilio API response warning:", data);
      return res.status(twilioResponse.status).json({
        success: false,
        warning: data.message || "Twilio response status not 201",
        data,
      });
    }
  } catch (error: any) {
    console.error("Error dispatching OTP via Twilio:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillSwap server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
