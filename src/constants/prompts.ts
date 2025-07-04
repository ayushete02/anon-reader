//prompts.ts
import { Chapter, Character, StoryCreate, StoryRead } from "@/lib/types";
import { STORY_CONFIG } from "./constants";

export const SYSTEM_PROMPT = `You are a master novel writer. Create engaging, well-structured stories that captivate readers. Follow the user's requirements exactly, especially regarding chapter count and structure.`;

export const COMIC_STRIP_SYSTEM_PROMPT = `You are a professional comic book writer. Create simple, clear comic strips with:
- Easy-to-read dialogue in simple English
- Short sentences (maximum 8 words per speech bubble)
- Clear visual descriptions
- Consistent character appearance across all chapters
- Maximum 3 panels per comic strip for better readability

Keep dialogue simple and natural. Avoid complex words or long sentences.`;

export function createPosterImagePrompt(
  storyData: StoryCreate | StoryRead
): string {
  // Handle both StoryCreate and generated story formats
  const title = storyData.title;
  const description = storyData.description;
  const categories = Array.isArray(storyData.categories)
    ? storyData.categories.join(", ")
    : "";
  const type = storyData.type;

  // Build character descriptions for the poster
  const characters = storyData.characters || [];
  const characterDescriptions = characters
    .map(
      (char: StoryCreate["characters"][0] | StoryRead["characters"][0]) =>
        `${char.name} (${char.type || "character"}): ${char.description}`
    )
    .join(", ");

  return `Create a professional movie poster style image for a ${type} story with the following details:

**Story Title:** ${title}
**Description:** ${description}
**Genre/Categories:** ${categories}
**Main Characters:** ${characterDescriptions}

**Design Requirements:**
- Movie poster style layout with dramatic composition
- Professional, high-quality artwork
- Include key characters prominently in the poster
- Reflect the story's genre and mood through color scheme and atmosphere
- Dynamic and engaging visual that would attract readers
- No text or title overlay needed - just the visual artwork
- Cinematic quality with proper lighting and composition
- Show the main characters in a way that hints at the story's plot
- 'Comic book art style with vibrant colors'

Create a compelling poster image that captures the essence of this story and would make people want to read it.`;
}

export function createStoryPrompt(storyData: StoryCreate): string {
  // Build character descriptions
  const characterDescriptions = storyData.characters
    .map((char) => `- ${char.name} (${char.type}): ${char.description}`)
    .join("\n");

  // Build categories list
  const categoriesStr = storyData.categories.join(", ");

  return `
Create a complete short story with the following specifications:

**Story Details:**
- Title: ${storyData.title}
- Description: ${storyData.description}
- Type: ${storyData.type}
- Plot: ${storyData.plot}
- Categories/Themes: ${categoriesStr}
- Chapter Length: Atleast ${STORY_CONFIG.WORDS_PER_CHAPTER} words per chapter

**Characters:**
${characterDescriptions}

**Requirements:**
- Each chapter should have a clear title
- The story should be engaging and follow the plot and themes provided
- Include all the characters mentioned in meaningful ways
- Make sure the story flows naturally from chapter to chapter

**Format your response as follows:**
Chapter 1: [Chapter Title]
[Chapter content here]

Chapter 2: [Chapter Title]
[Chapter content here]

...and so on for all chapters.

Please generate the complete story now include proper dialogue between the characters.
`;
}

export function createComicStripPrompt(
  chapter: Chapter,
  characters: Character[]
): string {
  // Create detailed character appearance guide for consistency
  const characterAppearanceGuide = characters
    .map((char) => {
      return `${char.name}: ${char.description}
- ALWAYS draw ${char.name} with the same face, hair, and clothes
- Keep ${char.name}'s appearance identical in every comic strip`;
    })
    .join("\n\n");

  // Create a short summary of the chapter (max 50 words)
  const chapterSummary =
    chapter.content.length > 200
      ? chapter.content.substring(0, 200) + "..."
      : chapter.content;

  return `
Create a simple comic strip for Chapter ${chapter.chapter_number}: "${
    chapter.title
  }"

**What happens in this chapter:**
${chapterSummary}

**CHARACTER APPEARANCE GUIDE (MUST FOLLOW EXACTLY):**
${characterAppearanceGuide}

**RULES:**
- The chapter title "${
    chapter.title
  }" MUST be displayed prominently at the top of the comic page
- Only 2 panels (Panel 1 and Panel 2)
- Simple English dialogue only
- Maximum 8 words per speech bubble
- Short, clear sentences
- Keep character looks exactly the same as described
- Make text easy to read

**Format your response exactly like this:**

Comic Strip ${chapter.chapter_number}: ${chapter.title}

Title: ${chapter.title} (MUST appear at the top of the comic page)

Panel 1: [Simple description of what we see - who is where, what they're doing]

Panel 2: [Simple description of what happens next]

Dialogue:
${
  characters.length > 0 ? characters[0].name : "Character"
}: "[Short, simple dialogue]"
${characters.length > 1 ? characters[1].name : "Character"}: "[Short response]"

**Remember:** 
- Chapter title "${chapter.title}" MUST be at the top of the comic page
- Keep ALL dialogue under 8 words
- Use simple, everyday English
- Make characters look the same every time
- Only 2 panels for clear reading

Create the comic strip now:
`;
}

export function createImagePrompt(
  chapter: Chapter,
  characters: Character[],
  comicStrip: string
): string {
  // Create detailed character appearance guide for visual consistency
  const characterVisualGuide = characters
    .map((char) => {
      return `${char.name}: ${char.description}
- CRITICAL: Keep ${char.name}'s face, hair, and outfit identical in every image
- Reference this exact description for ${char.name} in every comic strip`;
    })
    .join("\n\n");

  // Create the main prompt using the comic strip
  const prompt = `Create a professional vertical comic page with EXACTLY 2 panels based on this comic strip:

${comicStrip}

**CRITICAL CHARACTER CONSISTENCY RULES:**
${characterVisualGuide}

**STYLE REQUIREMENTS:**
- Comic book art style with clean, bold lines
- Vertical layout with 2 large panels only
- Bright, vibrant colors
- Professional comic book quality
- Large, easy-to-read text in speech bubbles
- Simple, clear font (like Arial or Helvetica)
- White speech bubbles with black text
- Character faces must match descriptions exactly

**TEXT READABILITY:**
- Make all text LARGE and BOLD
- Use simple, clear fonts
- White speech bubbles with thick black borders
- Keep text away from busy backgrounds
- Make sure all words are easy to read

**PANEL LAYOUT:**
- Panel 1: Top half of the image
- Panel 2: Bottom half of the image
- Clear borders between panels
- Each panel should be large enough for easy reading

**CONSISTENCY REMINDER:**
- Every character must look identical to their description
- Same face, same hair, same clothes every time
- This is comic strip number ${chapter.chapter_number} - keep characters consistent with previous strips

Create a single vertical comic page with 2 panels, clear text, and consistent character designs.`;

  return prompt;
}
