import logger from "../utils/logger";
import { useEffect } from "react";

function PredictionResult({ data }) {
  useEffect(() => {
    if (data) {
      logger.info("Prediction result rendered", data);
    }
  }, [data]);

  if (!data) return null;

  return (
    <div className="result-card">
      <h2>Prediction Result</h2>

      <div className="result-item">
        <span>Original Price</span>

        <strong>₹{data.original_price}</strong>
      </div>

      <div className="result-item">
        <span>Discount</span>

        <strong>{data.discount}%</strong>
      </div>

      <div className="result-item">
        <span>Final Price</span>

        <strong>₹{data.price_after_discount}</strong>
      </div>
    </div>
  );
}

export default PredictionResult;
