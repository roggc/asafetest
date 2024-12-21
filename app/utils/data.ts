export async function fetchCryptoData(cryptoId: string) {
  try {
    const response = await fetch(`/api/fetchCryptoData?cryptoId=${cryptoId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch crypto data");
    }
    const data = await response.json();
    return data.prices.map(([timestamp, price]: [number, number]) => ({
      date: new Date(timestamp),
      price: price,
    }));
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    throw error;
  }
}

export async function fetchCryptoList(page = 1, perPage = 50) {
  try {
    const response = await fetch(
      `/api/fetchCryptoList?page=${page}&perPage=${perPage}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch crypto list");
    }
    const data = await response.json();
    // console.log(data);
    return data.map((crypto: any) => ({
      id: crypto.id,
      name: crypto.name,
    }));
  } catch (error) {
    console.error("Error fetching crypto list:", error);
    throw error;
  }
}
