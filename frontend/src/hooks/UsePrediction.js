import { useState } from "react";
import { predictACPrice } from "../services/predictionService";
import logger from "../utils/logger";

export default function usePrediction() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async (data) => {
    try {
      setLoading(true);
      logger.info("Prediction started", data);

      const result = await predictACPrice(data);
      setPrediction(result);
      logger.info("Prediction successful", result);
    } catch (error) {
      logger.error("Prediction failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { prediction, loading, predict };
}