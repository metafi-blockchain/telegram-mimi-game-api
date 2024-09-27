import moment from 'moment'

export const POINT_CONFIG = {
    AGE_POINT: 3, // one day -> 3 points
    TELEGRAM_VERIFIED: 300, // telegram premium + 300 points
    XVERIFIED: 1000, // x premium blue + 1000 points
    FOLLOWER_POINT: 1 / 2, //1 followers -> 0.5 points
    REFER_RATE: 10 / 100, // 10% F1
    JOINED_POINT: 200,
    CREATE_ACCOUNT_POINT: 500
  }
  
export const SKIP_TIME_BIRDS = 0.25

export const TELEGRAM_AGE = [
    {
      year: moment('01-01-2014', 'DD-MM-YYYY').valueOf(),
      start: 0,
    },
    {
      year: moment('01-01-2015', 'DD-MM-YYYY').valueOf(),
      start: 30000000,
    },
    {
      year: moment('01-01-2016', 'DD-MM-YYYY').valueOf(),
      start: 70000000,
    },
    {
      year: moment('01-01-2017', 'DD-MM-YYYY').valueOf(),
      start: 120000000,
    },
    {
      year: moment('01-01-2018', 'DD-MM-YYYY').valueOf(),
      start: 500000000,
    },
    {
      year: moment('01-01-2019', 'DD-MM-YYYY').valueOf(),
      start: 900000000,
    },
    {
      year: moment('01-01-2020', 'DD-MM-YYYY').valueOf(),
      start: 1500000000,
    },
    {
      year: moment('01-01-2021', 'DD-MM-YYYY').valueOf(),
      start: 2700000000,
    },
    {
      year: moment('01-01-2022', 'DD-MM-YYYY').valueOf(),
      start: 3800000000,
    },
    {
      year: moment('01-01-2023', 'DD-MM-YYYY').valueOf(),
      start: 5000000000,
    },
    {
      year: moment('01-01-2024', 'DD-MM-YYYY').valueOf(),
      start: 7000000000,
    },
    {
      year: moment('01-01-2025', 'DD-MM-YYYY').valueOf(),
      start: 9000000000,
    },
  ]