export interface TwilioSendResult {
  success: boolean;
  status?: number;
  message: string;
  sid?: string;
  details?: any;
}

/**
 * Sends OTP through the SkillSwap server.
 *
 * Twilio credentials stay on the server and are never exposed
 * to the browser.
 */
export async function sendTwilioOtp(
  phoneNumber: string
): Promise<TwilioSendResult> {
  const cleanNumber = phoneNumber.trim();

  let formattedNumber = cleanNumber;

  if (!formattedNumber.startsWith("+")) {
    formattedNumber =
      formattedNumber.length === 10
        ? `+91${formattedNumber}`
        : `+${formattedNumber}`;
  }

  try {
    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: formattedNumber,
      }),
    });

    const data = await response.json();

    if (response.status === 201 && data.success) {
      return {
        success: true,
        status: 201,
        message: "OTP SMS sent successfully via Twilio!",
        sid: data.sid,
        details: data,
      };
    }

    return {
      success: false,
      status: response.status,
      message:
        data.warning ||
        data.error ||
        "Unable to send OTP through Twilio.",
      details: data,
    };
  } catch (error: any) {
    console.error("OTP request failed:", error);

    return {
      success: false,
      status: 500,
      message: "Unable to connect to the SkillSwap server.",
      details: error,
    };
  }
}