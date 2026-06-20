function PredictionResult({ data }) {
    if (!data) return null;
  
    return (
      <div>
        <h2>Prediction</h2>
        <p>Original Price: ₹{data.original_price}</p>
        <p>Discount: {data.discount}%</p>
      </div>
    );
  }
  
  export default PredictionResult;