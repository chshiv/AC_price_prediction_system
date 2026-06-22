export const API_URL = "http://localhost:8000/predict";

export const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  };
  
export const CURRENT_LEVEL = import.meta.env.MODE === "production" ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;

export const acTypes = ["Split", "Window"];

export const brands = ['Daikin', 'Cruise', 'Whirlpool', 'LG', 'Godrej', 'Blue', 'Samsung', 'Voltas', 'IFB', 'Sharp', 'Panasonic', 'Hisense', 'Carrier', 'Midea', 'Hitachi', 'LLYOD', 'Haier', 'Livpure', 'Havells', 'Lloyd', 'V-Guard', 'Havells-Lloyd', 'ONIDA', 'Acerpure', 'BPL', 'O', 'RR', 'Bhaburly', 'BAIWU', 'Forestchill', 'Portable', 'CLUB', 'EF', 'Crompton', 'Kenstar', 'LBG', 'Robustt', 'HOOMEE', 'Window', 'Universal', 'The', 'KHC', 'AMAZOR®', 'getlstub', 'Axmon®', 'AC', 'SELENO', 'Yellow', 'Breeze', 'CASA-NEST', 'Ivation', 'Home', 'Mr.', 'Buildskill', 'MetDeals', 'M&M', 'Kuber'];

export const starRatings = [1,2,3,4,5];

export const energyLevels = [
    {
        label:"Poor",
        value:0
    },
    {
        label:"Good",
        value:1
    },
    {
        label:"Excellent",
        value:2
    }
];

export const tonnages = [0.75, 0.8, 1.0, 1.2, 1.5, 1.6, 1.8, 2.0, 2.5, 3.0];

export const userRatings = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];