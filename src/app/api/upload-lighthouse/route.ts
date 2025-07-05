import lighthouse from "@lighthouse-web3/sdk";
import fs from "fs";
import path from "path";
import os from "os";
import { NextRequest, NextResponse } from "next/server";

// Force Node.js runtime for native modules
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    let tempFilePath: string | null = null;

    try {
        const { base64Data } = await request.json();

        if (!base64Data) {
            return NextResponse.json(
                { error: "base64Data is required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "NEXT_PUBLIC_LIGHTHOUSE_API_KEY environment variable is required" },
                { status: 500 }
            );
        }

        // Convert base64 to buffer
        const imageBuffer = Buffer.from(base64Data, "base64");
        console.log("IMAGE BUFFER => ", imageBuffer);

        // Create temporary PNG file
        const tempDir = os.tmpdir();
        const fileName = `lighthouse-upload-${Date.now()}-${Math.random().toString(36).substring(2)}.png`;
        tempFilePath = path.join(tempDir, fileName);

        // Write buffer to temporary PNG file
        fs.writeFileSync(tempFilePath, imageBuffer);

        // Upload file to Lighthouse using lighthouse.upload
        const uploadResponse = await lighthouse.upload(tempFilePath, apiKey);

        console.log("UPLOAD RESPONSE => ", uploadResponse);

        if (!uploadResponse.data?.Hash) {
            return NextResponse.json(
                { error: "Failed to get IPFS hash from Lighthouse response" },
                { status: 500 }
            );
        }

        const ipfsUrl = `https://gateway.lighthouse.storage/ipfs/${uploadResponse.data.Hash}`;
        console.log(`Successfully uploaded image to Lighthouse: ${ipfsUrl}`);

        return NextResponse.json({ ipfsUrl });

    } catch (error) {
        console.error("Error uploading to Lighthouse:", error);
        return NextResponse.json(
            {
                error: `Failed to upload image to Lighthouse: ${error instanceof Error ? error.message : "Unknown error"
                    }`
            },
            { status: 500 }
        );
    } finally {
        // Clean up temporary file
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
                console.log(`Cleaned up temporary file: ${tempFilePath}`);
            } catch (cleanupError) {
                console.warn(`Failed to clean up temporary file: ${tempFilePath}`, cleanupError);
            }
        }
    }
} 
