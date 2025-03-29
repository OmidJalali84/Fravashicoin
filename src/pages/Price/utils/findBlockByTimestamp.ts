import axios from "axios";

export async function getBlockNumberByTimestamp(timestamp: number) {
  // Replace with your Polygonscan API key
  const apiKey = "DKHUZYKEVA3TFXJJYJWISBYQGW99DH2DD8";
  const url = `https://api.polygonscan.com/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "1") {
      return parseInt(response.data.result);
    } else {
      throw new Error(
        "Error retrieving block number: " + response.data.message
      );
    }
  } catch (err) {
    console.error("Error in getBlockNumberByTimestamp:", err);
    throw err;
  }
}
