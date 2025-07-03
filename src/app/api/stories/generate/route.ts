import { NextRequest, NextResponse } from "next/server";
import {
    StoryCreate,
    StoryRead,
    Chapter,
    ChatMessage,
    ChatCompletionRequest,
    // Character,
} from "@/lib/types";
import { NearAIHelper } from "@/lib/near-ai";
import { createStoryPrompt, SYSTEM_PROMPT } from "@/constants/prompts";
import {
    STORY_CONFIG,
    FIELD_CONSTRAINTS,
    NEAR_AI_CONFIG,
} from "@/constants/constants";
// import { generateStoryImages, ChapterImage } from "@/lib/gemini";

function parseStoryIntoChapters(storyText: string): Chapter[] {
    const chapters: Chapter[] = [];

    // Split by chapter markers
    const chapterPattern =
        /Chapter (\d+):\s*([^\n]+)\n([\s\S]*?)(?=Chapter \d+:|$)/g;
    let match;

    while ((match = chapterPattern.exec(storyText)) !== null) {
        const chapterNum = parseInt(match[1]);
        const chapterTitle = match[2].trim();
        const chapterContent = match[3].trim();

        // Estimate reading time
        const wordCount = chapterContent.split(/\s+/).length;
        const readingTime = Math.max(
            STORY_CONFIG.DEFAULT_READING_TIME,
            Math.round((wordCount / STORY_CONFIG.WORDS_PER_MINUTE) * 60)
        );

        chapters.push({
            chapter_number: chapterNum,
            title: chapterTitle,
            content: chapterContent,
            reading_time_seconds: readingTime,
        });
    }

    // Log warning if we don't have exactly 15 chapters
    if (chapters.length !== STORY_CONFIG.CHAPTERS_COUNT) {
        console.warn(
            `Expected ${STORY_CONFIG.CHAPTERS_COUNT} chapters but got ${chapters.length}`
        );
    }

    return chapters;
}

function generateStoryData(
    storyData: StoryCreate,
    chapters: Chapter[],
    generatedStory: string
): StoryRead {
    const now = new Date().toISOString();
    const storyId = `story_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

    return {
        id: storyId,
        title: storyData.title,
        description: storyData.description,
        type: storyData.type,
        plot: storyData.plot,
        categories: storyData.categories,
        created_at: now,
        updated_at: now,
        generated_story: generatedStory,
        characters: storyData.characters.map((char, index) => ({
            id: `char_${storyId}_${index}`,
            name: char.name,
            type: char.type,
            description: char.description,
            image_url: char.image_url,
        })),
        chapters: chapters.map((chapter, index) => ({
            id: `chapter_${storyId}_${index}`,
            title: chapter.title,
            content: chapter.content,
            chapter_number: chapter.chapter_number,
            reading_time_seconds: chapter.reading_time_seconds,
        })),
    };
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export async function GET() {
    return NextResponse.json({
        message: "Stories generate API is running",
        methods: ["POST"],
        timestamp: new Date().toISOString(),
    });
}

export async function POST(request: NextRequest) {
    console.log("POST /api/stories/generate called");
    console.log("Request method:", request.method);
    console.log("Request URL:", request.url);

    try {
        let storyData: StoryCreate;

        try {
            storyData = await request.json();
        } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
            return NextResponse.json(
                { error: "Invalid JSON in request body" },
                { status: 400 }
            );
        }

        console.log("Story data received:", {
            title: storyData.title,
            type: storyData.type,
            charactersCount: storyData.characters?.length,
        });

        // Check if NearAI configuration is available
        if (!NEAR_AI_CONFIG.API_URL || !NEAR_AI_CONFIG.AUTH_HEADER) {
            console.error("Missing NearAI configuration");
            return NextResponse.json(
                { error: "API configuration error" },
                { status: 500 }
            );
        }

        // Validate required fields
        if (!storyData.title || !storyData.description || !storyData.plot) {
            return NextResponse.json(
                { error: "Missing required fields: title, description, plot" },
                { status: 400 }
            );
        }

        // Validate field length constraints
        if (storyData.title.length > FIELD_CONSTRAINTS.STORY_TITLE_MAX) {
            return NextResponse.json(
                {
                    error: `Title must be ${FIELD_CONSTRAINTS.STORY_TITLE_MAX} characters or less`,
                },
                { status: 400 }
            );
        }

        if (
            storyData.description.length > FIELD_CONSTRAINTS.STORY_DESCRIPTION_MAX
        ) {
            return NextResponse.json(
                {
                    error: `Description must be ${FIELD_CONSTRAINTS.STORY_DESCRIPTION_MAX} characters or less`,
                },
                { status: 400 }
            );
        }

        if (storyData.plot.length > FIELD_CONSTRAINTS.STORY_PLOT_MAX) {
            return NextResponse.json(
                {
                    error: `Plot must be ${FIELD_CONSTRAINTS.STORY_PLOT_MAX} characters or less`,
                },
                { status: 400 }
            );
        }

        // Create the story prompt
        const prompt = createStoryPrompt(storyData);

        // Prepare Near AI request
        const chatRequest: ChatCompletionRequest = {
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                } as ChatMessage,
                {
                    role: "user",
                    content: prompt,
                } as ChatMessage,
            ],
        };

        try {
            console.log(`Generating story: ${storyData.title}`);

            // Generate story using Near AI
            let generatedContent = "";
            for await (const chunk of NearAIHelper.generateCompletionStream(
                chatRequest
            )) {
                generatedContent += chunk;
            }

            if (!generatedContent.trim()) {
                return NextResponse.json(
                    { error: "Failed to generate story content from Near AI" },
                    { status: 500 }
                );
            }

            // Parse the generated story into chapters
            const chapters = parseStoryIntoChapters(generatedContent);

            if (chapters.length === 0) {
                return NextResponse.json(
                    { error: "Failed to parse generated story into chapters" },
                    { status: 500 }
                );
            }

            // Handle image generation for image type stories
            // if (storyData.type === "image") {
            //     try {
            //         console.log("Generating images for story chapters...");

            //         // Convert characters to the right format for image generation
            //         const charactersForImageGen: Character[] = storyData.characters.map(
            //             (char, index) => ({
            //                 id: `char_temp_${index}`,
            //                 name: char.name,
            //                 description: char.description,
            //                 type: char.type,
            //                 imageUrl: char.image_url || undefined,
            //                 isGenerated: false,
            //             })
            //         );

            //         // Generate images for all chapters and upload directly to Lighthouse storage using buffer upload
            //         const chapterImages: ChapterImage[] = await generateStoryImages(
            //             chapters,
            //             charactersForImageGen
            //         );

            //         console.log(
            //             `Successfully generated and uploaded ${chapterImages.length} chapter images to Lighthouse`
            //         );

            //         // Create a story response with image URLs included in chapters
            //         const storyResponse = generateStoryData(
            //             storyData,
            //             chapters,
            //             generatedContent
            //         );

            //         // Add image URLs to the corresponding chapters
            //         storyResponse.chapters = storyResponse.chapters.map((chapter) => {
            //             const chapterImage = chapterImages.find(
            //                 (img) => img.chapterNumber === chapter.chapter_number
            //             );
            //             return {
            //                 ...chapter,
            //                 image_url: chapterImage?.image || undefined,
            //             };
            //         });

            //         console.log(
            //             `Successfully generated story with ${chapters.length} chapters and ${chapterImages.length} images`
            //         );

            //         // Return the same format as text stories but with images included
            //         return NextResponse.json(storyResponse, { status: 201 });
            //     } catch (imageError) {
            //         console.error("Image generation and upload error:", imageError);
            //         const errorMessage =
            //             imageError instanceof Error
            //                 ? imageError.message
            //                 : "Failed to generate and upload chapter images";
            //         return NextResponse.json({ error: errorMessage }, { status: 500 });
            //     }
            // }

            // For text type stories, return the standard format
            const storyResponse = generateStoryData(
                storyData,
                chapters,
                generatedContent
            );

            console.log(
                `Successfully generated story with ${chapters.length} chapters`
            );

            return NextResponse.json(storyResponse, { status: 201 });
        } catch (nearAIError) {
            console.error("Near AI error:", nearAIError);
            const errorMessage =
                nearAIError instanceof Error
                    ? nearAIError.message
                    : "Failed to generate response from Near AI";
            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }
    } catch (error) {
        console.error("Unexpected error in story generation:", error);
        return NextResponse.json(
            { error: "Failed to generate story" },
            { status: 500 }
        );
    }
}
