import { useState } from "react";
import { brands, acTypes, starRatings } from "../constants/AcOptions";

function ACForm({ onPredict }) {
  const [form, setForm] = useState({
    brand: "",
    ac_type: "",
    tonnage: "",
    star_rating: "",
    inverter: 1,
    wifi_enabled: 1,
    rating: "",
    bought_last_month: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    onPredict({
      brand: form.brand,
      ac_type: form.ac_type,
      tonnage: Number(form.tonnage),
      star_rating: Number(form.star_rating),
      inverter: Number(form.inverter),
      wifi_enabled: Number(form.wifi_enabled),
      rating: Number(form.rating),
      bought_last_month: Number(form.bought_last_month),
      // Derived features computed on frontend
      smart: Number(form.inverter) === 1 && Number(form.wifi_enabled) === 1 ? 1 : 0,
      energy_efficient: Number(form.star_rating) === 1 ? 0 : Number(form.star_rating) < 5 ? 1 : 2,
    });
  };

  return (
    <div className="form-card">
      <h2>AC Details</h2>
      <form onSubmit={submitHandler}>
        <label>Brand</label>
        <select name="brand" onChange={handleChange}>
          <option>Select Brand</option>
          {brands.map((brand) => (
            <option key={brand}>{brand}</option>
          ))}
        </select>

        <label>AC Type</label>
        <select name="ac_type" onChange={handleChange}>
          <option>Select Type</option>
          {acTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        <label>Tonnage</label>
        <input
          type="number"
          step="0.1"
          name="tonnage"
          placeholder="Example 1.5"
          onChange={handleChange}
        />

        <label>Star Rating</label>
        <select name="star_rating" onChange={handleChange}>
          <option>Select Star Rating</option>
          {starRatings.map((star) => (
            <option key={star} value={star}>
              {star} Star
            </option>
          ))}
        </select>

        <label>Inverter</label>
        <select name="inverter" onChange={handleChange}>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>

        <label>Wifi Enabled</label>
        <select name="wifi_enabled" onChange={handleChange}>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>

        <label>User Rating</label>
        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Example 4.3"
          onChange={handleChange}
        />

        <label>Bought Last Month</label>
        <input
          type="number"
          name="bought_last_month"
          placeholder="Example 500"
          onChange={handleChange}
        />

        <button type="submit">Predict Price</button>
      </form>
    </div>
  );
}

export default ACForm;