import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);


const generateAction = async (req, res) => {
    const basePromptPrefix = `A user wants to ask a question / create a prompt for GPT-3. \n
    The user types the beginning of the prompt.\n
    You must complete it by giving ONLY THE END of the prompt. \n
    Punctuation is only needed at the end of the sentence. \n
    If the beginning og the sentence is short, the end must be short too. \n
    The prompt is not necessarily a question and AI-related . \n
    YOU MUST ONLY COMPLETE THE END OF THE PROMPT.\n
    End the prompt with a punctuation.\n
    Do not repeat the beginning of the prompt. \n
    The beginning of the sentence is : `;
    // Run first prompt
    const userInputWithouLastSpace = req.body.userInput.replace(/\s+$/, '');
    console.log(`API: ${basePromptPrefix}${userInputWithouLastSpace}`);

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${userInputWithouLastSpace}`,
        temperature: 0,
        max_tokens: 256,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
