/**
 * Client-side function to upload base64 image data to Lighthouse via API route
 * No longer requires localStorage since upload happens server-side
 */
export async function uploadBase64ToLighthouse(
  base64Data: string
): Promise<string> {
  try {
    console.log("Uploading image to Lighthouse via API route...");

    const response = await fetch('/api/upload-lighthouse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Data }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const { ipfsUrl } = await response.json();
    console.log(`Successfully uploaded image to Lighthouse: ${ipfsUrl}`);

    return ipfsUrl;
  } catch (error) {
    console.error("Error uploading to Lighthouse:", error);
    throw new Error(
      `Failed to upload image to Lighthouse: ${error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Upload multiple base64 images to Lighthouse in parallel via API route
 */
export async function uploadMultipleBase64ToLighthouse(
  images: { base64: string; chapterNumber: number; title: string }[]
): Promise<{ chapterNumber: number; title: string; imageUrl: string }[]> {
  try {
    console.log(`Starting upload of ${images.length} images to Lighthouse via API`);

    const uploadPromises = images.map(async (item) => {
      console.log(`Uploading chapter ${item.chapterNumber}: ${item.title}`);
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
