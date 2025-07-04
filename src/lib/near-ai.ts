import { ChatCompletionRequest } from './types';
import { NEAR_AI_CONFIG } from '@/constants/constants';

interface RequestBody {
    model: string;
    provider: string;
    max_tokens: number;
    temperature: number;
    stream: boolean;
    messages: Array<{
        role: string;
        content: string;
    }>;
}

interface ImageGenerationRequest {
    prompt: string;
    model: string;
    provider: string;
    init_image?: string;
    image_strength?: number;
    control_image?: string;
    control_net_name?: string;
    conditioning_scale?: number;
    cfg_scale?: number;
    sampler?: string;
    steps?: number;
    seed?: number;
}

interface ImageGenerationResponse {
    data: Array<{
        b64_json: string;
    }>;
}

export class NearAIHelper {
    private static buildRequestBody(request: ChatCompletionRequest): RequestBody {
        const messages = request.messages.map(message => ({
            role: message.role,
            content: message.content
        }));

        return {
            model: NEAR_AI_CONFIG.MODEL,
            provider: NEAR_AI_CONFIG.PROVIDER,
            max_tokens: NEAR_AI_CONFIG.MAX_TOKENS,
            temperature: NEAR_AI_CONFIG.TEMPERATURE,
            stream: NEAR_AI_CONFIG.STREAM,
            messages,
        };
    }

    private static buildImageRequestBody(prompt: string): ImageGenerationRequest {
        return {
            prompt,
            model: NEAR_AI_CONFIG.IMAGE_MODEL,
            provider: NEAR_AI_CONFIG.PROVIDER,
        };
    }

    static async generateImage(prompt: string): Promise<string> {
        console.log(`near::generate_image::Generating image with prompt: ${prompt.substring(0, 100)}...`);

        const requestBody = this.buildImageRequestBody(prompt);

        try {
            const response = await fetch(NEAR_AI_CONFIG.IMAGE_API_URL, {
                method: 'POST',
                headers: NEAR_AI_CONFIG.AUTH_HEADER,
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(NEAR_AI_CONFIG.TIMEOUT),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`near::generate_image::NearAI API error: ${response.status} - ${errorText}`);
                throw new Error(`Error from NearAI Image API: ${errorText}`);
            }

            const result: ImageGenerationResponse = await response.json();

            if (!result.data || result.data.length === 0) {
                throw new Error('No images generated from Near AI');
            }

            const base64Image = result.data[0].b64_json;
            if (!base64Image) {
                throw new Error('Generated image does not contain base64 data');
            }

            console.log('near::generate_image::Successfully generated image');
            return base64Image;
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'TimeoutError') {
                    console.error('near::generate_image::Request timeout');
                    throw new Error("Request to NearAI Image API timed out");
                }

                if (error.message.includes('fetch')) {
                    console.error(`near::generate_image::Network error: ${error.message}`);
                    throw new Error("Failed to connect to NearAI Image API");
                }

                console.error(`near::generate_image::Error: ${error.message}`);
                throw error;
            }

            console.error(`near::generate_image::Unexpected error: ${error}`);
            throw new Error("Failed to generate image from Near AI");
        }
    }

    static async *generateCompletionStream(
        request: ChatCompletionRequest
    ): AsyncGenerator<string, void, unknown> {
        console.log(
            `near::generate_completion_stream::Generating streaming content with ${request.messages.length} messages`
        );

        const requestBody = this.buildRequestBody(request);

        try {
            const response = await fetch(NEAR_AI_CONFIG.API_URL, {
                method: 'POST',
                headers: NEAR_AI_CONFIG.AUTH_HEADER,
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(NEAR_AI_CONFIG.TIMEOUT),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    `near::generate_completion_stream::NearAI API error: ${response.status} - ${errorText}`
                );
                throw new Error(`Error from NearAI API: ${errorText}`);
            }

            if (!response.body) {
                throw new Error('No response body received');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            try {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.trim()) {
                            console.debug(
                                `near::generate_completion_stream::Received line: ${line}`
                            );

                            try {
                                let data: { choices?: Array<{ delta?: { content?: string } }> };

                                // Handle Server-Sent Events format
                                if (line.startsWith('data: ')) {
                                    const dataStr = line.slice(6);
                                    if (dataStr.trim() === '[DONE]') {
                                        return;
                                    }
                                    data = JSON.parse(dataStr);
                                } else {
                                    // Handle plain JSON lines
                                    data = JSON.parse(line);
                                }

                                // Extract streaming content from delta
                                if (
                                    data.choices &&
                                    data.choices.length > 0 &&
                                    data.choices[0].delta &&
                                    data.choices[0].delta.content
                                ) {
                                    const content = data.choices[0].delta.content;
                                    if (content !== null && content !== '') {
                                        yield content;
                                    }
                                }
                            } catch (jsonParseError) {
                                console.warn(
                                    `near::generate_completion_stream::Failed to parse line: ${line} - Error: ${jsonParseError}`
                                );
                                continue;
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'TimeoutError') {
                    console.error('near::generate_completion_stream::Request timeout');
                    throw new Error("Request to NearAI API timed out");
                }

                if (error.message.includes('fetch')) {
                    console.error(`near::generate_completion_stream::Network error: ${error.message}`);
                    throw new Error("Failed to connect to NearAI API");
                }

                console.error(`near::generate_completion_stream::Error: ${error.message}`);
                throw error;
            }

            console.error(`near::generate_completion_stream::Unexpected error: ${error}`);
            throw new Error("Failed to generate response from Near AI");
        }
    }
}
