import { StreamingTextResponse, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey;
  if (!apiKey) throw new Error('Missing OpenAI API key');
  const openai = createOpenAI({
    apiKey: apiKey,
  });

  return defineEventHandler(async (event: any) => {
    // Extract the `prompt` from the body of the request
    const { messages } = await readBody(event);

    const result = await streamText({
      model: openai('gpt-4o'),
      messages,
    });
    return new StreamingTextResponse(result.toAIStream());
  });
});
