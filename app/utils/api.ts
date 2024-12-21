export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": process.env.COINGECKO_API_KEY ?? "",
  },
};
