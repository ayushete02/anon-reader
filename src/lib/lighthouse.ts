import lighthouse from "@lighthouse-web3/sdk";

/**
 * Uploads base64 image data to Lighthouse storage and returns the IPFS link
 */
export async function uploadToLighthouse(base64Data: string): Promise<string> {
  try {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Upload buffer directly to Lighthouse
    const uploadResponse = await lighthouse.uploadBuffer(
      imageBuffer,
      process.env.LIGHTHOUSE_API_KEY!
    );

    if (!uploadResponse.data?.Hash) {
      throw new Error("Failed to get IPFS hash from Lighthouse response");
    }

    // Return the IPFS gateway URL with filename
    const ipfsHash = uploadResponse.data.Hash;
    return `https://gateway.lighthouse.storage/ipfs/${ipfsHash}`;
  } catch (error) {
    console.error("Error uploading to Lighthouse:", error);
    throw new Error(
      `Failed to upload image to Lighthouse: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Frontend-compatible function to upload base64 image data to Lighthouse
 * Uses NEXT_PUBLIC_LIGHTHOUSE_API_KEY for client-side uploads
 */
export async function uploadBase64ToLighthouse(
  base64Data: string
): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
    if (!apiKey) {
      throw new Error(
        "NEXT_PUBLIC_LIGHTHOUSE_API_KEY environment variable is required"
      );
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Upload buffer directly to Lighthouse
    const uploadResponse = await lighthouse.uploadBuffer(imageBuffer, apiKey);

    if (!uploadResponse.data?.Hash) {
      throw new Error("Failed to get IPFS hash from Lighthouse response");
    }

    const ipfsUrl = `https://gateway.lighthouse.storage/ipfs/${uploadResponse.data.Hash}`;
    console.log(`Successfully uploaded image to Lighthouse: ${ipfsUrl}`);

    return ipfsUrl;
  } catch (error) {
    console.error("Error uploading to Lighthouse:", error);
    throw new Error(
      `Failed to upload image to Lighthouse: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Upload multiple base64 images to Lighthouse in parallel
 */
export async function uploadMultipleBase64ToLighthouse(
  images: { base64: string; chapterNumber: number; title: string }[]
): Promise<{ chapterNumber: number; title: string; imageUrl: string }[]> {
  try {
    const uploadPromises = images.map(async (item) => {
      const imageUrl = await uploadBase64ToLighthouse(item.base64);
      return {
        chapterNumber: item.chapterNumber,
        title: item.title,
        imageUrl: imageUrl,
      };
    });

    const results = await Promise.all(uploadPromises);
    console.log(`Successfully uploaded ${results.length} images to Lighthouse`);

    return results;
  } catch (error) {
    console.error("Error uploading multiple images to Lighthouse:", error);
    throw error;
  }
}
