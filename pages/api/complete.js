import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const generateAction = async (req, res) => {
    const basePromptPrefix = `A user wants to create a prompt for GPT-3. \n
    The user types the beginning of the prompt.\n
    Complete it by giving ONLY THE END of the prompt. \n \n
    `;
    // Run first prompt
    const userInputWithouLastSpace = req.body.userInput.replace(/\s+$/, '');
    console.log(`API: ${basePromptPrefix}${userInputWithouLastSpace}`);

    console.log(req.body.temperature);

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${userInputWithouLastSpace}`,
        temperature: parseInt(req.body.temperature),
        max_tokens: 256,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
