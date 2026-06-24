import ACForm from "./components/ACForm";
import PredictionResult from "./components/PredictionResult";
import usePrediction from "./hooks/usePrediction";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { prediction, predict } = usePrediction();

  return (
    <div className="container">
      <h1>AC Price Predictor</h1>
      <ACForm onPredict={predict} />
      <PredictionResult data={prediction} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default App;