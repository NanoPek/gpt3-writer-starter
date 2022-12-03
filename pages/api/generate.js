import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);


const generateAction = async (req, res) => {

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${req.body.userInput}`,
        temperature: 0.1,
        max_tokens: 250,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
