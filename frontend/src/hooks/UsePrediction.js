import {useState} from "react";

import {predictACPrice} from "../services/PredictionService";

export default function usePrediction(){

const [prediction,setPrediction]=useState(null);

const [loading,setLoading]=useState(false);

const predict=async(data)=>{
try{

setLoading(true);
const result = await predictACPrice(data);
setPrediction(result);

}
catch(error){
console.log(error);
}

finally{
setLoading(false);
}

};


return {prediction, loading, predict};
}