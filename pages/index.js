import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import {useEffect, useState} from "react";

const Home = () => {
    const [userInput, setUserInput] = useState('');

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };
  const [apiOutputGenerate, setApiOutputGenerate] = useState('')
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async (prompt) => {
    setIsGenerating(true);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: prompt }),
    });

    const data = await response.json();
    const { output } = data;

    setApiOutputGenerate(`${output.text}`);
    setIsGenerating(false);
  }

  const callCompleteEndpoint = async () => {
    setIsGenerating(true);

    const response = await fetch('/api/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (userInput.length > 0) {
        callCompleteEndpoint();
        setUserInput(userInput.replace(/\s+$/, ''));

      }
    }, 1000)

    setApiOutput('');

    return () => clearTimeout(delayDebounceFn)
  }, [userInput])

  function checkTabPress(e) {

    if (e.keyCode === 13 && apiOutput.length > 0) {
        setUserInput(userInput + apiOutput);
    }
  }





  function resizeInput() {
      this.style.width = this.value.length + 1 + "ch";
  }

  useEffect(() => {
    var input = document.querySelector('input'); // get the input element
    input.addEventListener('input', resizeInput); // bind the "resizeInput" callback on "input" event
    document.addEventListener('keyup', function (e) {
      checkTabPress(e);
    }, false);
  }, []);



    return (
    <div className="root">
      <Head>
        <title>GPT-3 Copilot </title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>GPT-3 Copilot </h1>
          </div>
          <div className="header-subtitle">
            <h2>An AI to help you ask properly questions to an IA (meta) !!!</h2>
          </div>
        </div>
        <div className={"prompt-box"}>
          <input
            className={"prompt-input"}
              placeholder="Start typing here..."
              value={userInput}
              onChange={onUserChangedText}/>
          { apiOutput &&
            <span className="input-label">{apiOutput}</span>
          }
        </div>
        <div className="prompt-buttons">
          <a
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={() => callGenerateEndpoint(userInput)}
          >
            <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p className={"button-text"}>Generate</p>}
            </div>
          </a>
          <a
              className={isGenerating ? 'generate-button2 loading' : 'generate-button2'}
              onClick={() => callGenerateEndpoint(userInput + apiOutput)}
          >
            <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p className={"button-text"}>Generate with suggestion !</p>}
            </div>
          </a>
        </div>
        {apiOutputGenerate && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
                <div className="output-content">
                  <p>{apiOutputGenerate}</p>
                </div>
              </div>
            </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
