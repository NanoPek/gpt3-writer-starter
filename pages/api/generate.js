import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: "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"
});

const openai = new OpenAIApi(configuration);


const generateAction = async (req, res) => {
    const basePromptPrefix = `Rewrite the following text as a cringe discord message, with SOMETIMES bold and italic words and emojis between each word : `;
    // Run first prompt
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}`,
        temperature: 0.7,
        max_tokens: 250,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
