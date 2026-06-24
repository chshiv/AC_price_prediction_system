import { useState } from "react";
import { toast } from "react-toastify";

import {
  brands,
  acTypes,
  starRatings,
  tonnages,
  userRatings,
} from "../utils/constants";

import { validateForm } from "../utils/validators";
import logger from "../utils/logger";

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

    logger.debug("Form field changed", {
      field: e.target.name,
      value: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(form);

    // Show validation errors using toast
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => {
        toast.error(error);
      });

      logger.warn("Form validation failed", validationErrors);

      return;
    }

    const payload = {
      brand: form.brand,

      ac_type: form.ac_type,

      tonnage: Number(form.tonnage),

      star_rating: Number(form.star_rating),

      inverter: Number(form.inverter),

      wifi_enabled: Number(form.wifi_enabled),

      rating: Number(form.rating),

      bought_last_month: Number(form.bought_last_month),

      smart:
        Number(form.inverter) === 1 && Number(form.wifi_enabled) === 1 ? 1 : 0,

      energy_efficient:
        Number(form.star_rating) === 1
          ? 0
          : Number(form.star_rating) < 5
          ? 1
          : 2,
    };

    logger.info("Form submitted", payload);

    toast.success("Prediction generated successfully");

    onPredict(payload);
  };

  return (
    <div className="form-card">
      <h2>AC Details</h2>

      <form onSubmit={submitHandler}>
        <label>Brand</label>

        <select name="brand" value={form.brand} onChange={handleChange}>
          <option value="">Select Brand</option>

          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <label>AC Type</label>

        <select name="ac_type" value={form.ac_type} onChange={handleChange}>
          <option value="">Select Type</option>

          {acTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label>Tonnage</label>

        <select name="tonnage" value={form.tonnage} onChange={handleChange}>
          <option value="">Select Tonnage</option>

          {tonnages.map((ton) => (
            <option key={ton} value={ton}>
              {ton} Ton
            </option>
          ))}
        </select>

        <label>Star Rating</label>

        <select
          name="star_rating"
          value={form.star_rating}
          onChange={handleChange}
        >
          <option value="">Select Star Rating</option>

          {starRatings.map((star) => (
            <option key={star} value={star}>
              {star} Star
            </option>
          ))}
        </select>

        <label>Inverter</label>

        <select name="inverter" value={form.inverter} onChange={handleChange}>
          <option value="1">Yes</option>

          <option value="0">No</option>
        </select>

        <label>Wifi Enabled</label>

        <select
          name="wifi_enabled"
          value={form.wifi_enabled}
          onChange={handleChange}
        >
          <option value="1">Yes</option>

          <option value="0">No</option>
        </select>

        <label>User Rating</label>

        <select name="rating" value={form.rating} onChange={handleChange}>
          <option value="">Select Rating</option>

          {userRatings.map((r) => (
            <option key={r} value={r}>
              {r} ⭐
            </option>
          ))}
        </select>

        <label>Bought Last Month</label>

        <input
          type="number"
          name="bought_last_month"
          placeholder="Example 500"
          max="10000"
          min="0"
          value={form.bought_last_month}
          onChange={handleChange}
        />

        <button type="submit">Predict Price</button>
      </form>
    </div>
  );
}

export default ACForm;