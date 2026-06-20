const API_URL="/api/predict";

export const predictACPrice = async(payload)=>{
    const response = await fetch(
        API_URL,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(payload)
        }
    );
    if(!response.ok){
        throw new Error(
            "Prediction failed"
        );

    }
    return response.json();

};