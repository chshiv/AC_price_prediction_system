import { brands, acTypes, tonnages, starRatings, userRatings } from "./constants";

const SPECIAL_CHARS = /[^a-zA-Z0-9\s\-]/;

export const validateForm = (form) => {
  const errors = {};

  // brand — must be non-empty string, no special chars, from allowed list
  if (!form.brand || typeof form.brand !== "string" || form.brand.trim() === "") {
    errors.brand = "Please select a brand";
  } else if (SPECIAL_CHARS.test(form.brand)) {
    errors.brand = "Brand contains invalid characters";
  } else if (!brands.includes(form.brand)) {
    errors.brand = "Selected brand is not valid";
  }

  // ac_type — must be non-empty, from allowed list
  if (!form.ac_type || form.ac_type.trim() === "") {
    errors.ac_type = "Please select an AC type";
  } else if (!acTypes.includes(form.ac_type)) {
    errors.ac_type = "Selected AC type is not valid";
  }

  // tonnage — must be non-empty, from allowed list
  if (!form.tonnage || form.tonnage === "") {
    errors.tonnage = "Please select tonnage";
  } else if (!tonnages.includes(Number(form.tonnage))) {
    errors.tonnage = "Selected tonnage is not valid";
  }

  // star_rating — must be non-empty, from allowed list
  if (!form.star_rating || form.star_rating === "") {
    errors.star_rating = "Please select a star rating";
  } else if (!starRatings.includes(Number(form.star_rating))) {
    errors.star_rating = "Selected star rating is not valid";
  }

  // inverter — must be 0 or 1
  if (!["0", "1", 0, 1].includes(form.inverter)) {
    errors.inverter = "Please select inverter type";
  }

  // wifi_enabled — must be 0 or 1
  if (!["0", "1", 0, 1].includes(form.wifi_enabled)) {
    errors.wifi_enabled = "Please select wifi option";
  }

  // rating — must be non-empty, from allowed list
  if (!form.rating || form.rating === "") {
    errors.rating = "Please select a user rating";
  } else if (!userRatings.includes(Number(form.rating))) {
    errors.rating = "Selected rating is not valid";
  }

  // bought_last_month — must be non-empty, number, 0–10000
  if (form.bought_last_month === "" || form.bought_last_month === null) {
    errors.bought_last_month = "Please enter bought last month";
  } else if (isNaN(Number(form.bought_last_month))) {
    errors.bought_last_month = "Must be a number";
  } else if (Number(form.bought_last_month) < 0) {
    errors.bought_last_month = "Cannot be negative";
  } else if (Number(form.bought_last_month) > 10000) {
    errors.bought_last_month = "Cannot exceed 10,000";
  }

  return errors;
};