import {API_URL} from "../utils/constants.js"
import logger from "../utils/logger";


export const predictACPrice = async (payload) => {
  logger.info("Sending prediction request", payload);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      logger.error("Prediction request failed", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error("Prediction failed");
    }

    const result = await response.json();
    logger.info("Prediction response received", result);
    return result;

  } catch (error) {
    logger.error("API call error", error.message);
    throw error;
  }
};