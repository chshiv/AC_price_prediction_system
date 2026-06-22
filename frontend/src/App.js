import ACForm from "./components/ACForm";
import PredictionResult from "./components/PredictionResult";
import usePrediction from "./hooks/usePrediction";
import "./App.css";

function App() {
  const { prediction, predict } = usePrediction();

  return (
    <div className="container">
      <h1>AC Price Predictor</h1>
      <ACForm onPredict={predict} />
      <PredictionResult data={prediction} />
    </div>
  );
}

export default App;