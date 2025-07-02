import { Chapter, Character, StoryCreate } from '@/lib/types';
import { STORY_CONFIG } from './constants';

export const SYSTEM_PROMPT = `You are a master storyteller. Create engaging, well-structured stories that captivate readers. Follow the user's requirements exactly, especially regarding chapter count and structure.`;

export function createStoryPrompt(storyData: StoryCreate): string {
    // Build character descriptions
    const characterDescriptions = storyData.characters.map(char =>
        `- ${char.name} (${char.type}): ${char.description}`
    ).join('\n');

    // Build categories list
    const categoriesStr = storyData.categories.join(', ');

    return `
Create a complete short story with the following specifications:

**Story Details:**
- Title: ${storyData.title}
- Description: ${storyData.description}
- Type: ${storyData.type}
- Plot: ${storyData.plot}
- Categories/Themes: ${categoriesStr}

**Characters:**
${characterDescriptions}

**Requirements:**
- The story MUST be divided into exactly ${STORY_CONFIG.CHAPTERS_COUNT} chapters
- Each chapter should be approximately 30 seconds of reading time (roughly 150-200 words)
- Each chapter should have a clear title
- The story should be engaging and follow the plot and themes provided
- Include all the characters mentioned in meaningful ways
- Make sure the story flows naturally from chapter to chapter

**Format your response as follows:**
Chapter 1: [Chapter Title]
[Chapter content here]

Chapter 2: [Chapter Title]
[Chapter content here]

...and so on for all ${STORY_CONFIG.CHAPTERS_COUNT} chapters.

Please generate the complete story now.
`;
}

export function createImagePrompt(chapter: Chapter, characters: Character[]): string {
    // Create character descriptions for consistency
    const characterDescriptions = characters.map(char => {
        return `${char.name} (${char.type}): ${char.description}`;
    }).join('. ');

    // Create the main prompt
    const prompt = `Create a comic book style illustration for: "${chapter.title}". 

Scene description: ${chapter.content}

Characters in this story: ${characterDescriptions}

Style: Comic book art, vibrant colors, detailed illustration, professional comic book quality, consistent character design. Make sure the characters match their descriptions if they appear in this scene.`;

    return prompt;
}
