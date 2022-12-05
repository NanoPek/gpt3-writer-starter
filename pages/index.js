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
  const [temperature, setTemperature] = useState("0.2")

  const callGenerateEndpoint = async (prompt) => {
    setIsGenerating(true);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: prompt.replace(/(\r\n|\n|\r)/gm, "") }),
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
      body: JSON.stringify({ userInput, temperature }),
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

      }
    }, 1000)

    setApiOutput('');

    return () => clearTimeout(delayDebounceFn)
  }, [userInput, temperature])

  useEffect(() => {
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
      tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
      this.style.height = 0;
      this.style.height = (this.scrollHeight) + "px";
    }
  }, [userInput]);

  function handleChange(event) {
    setTemperature(event.target.value);
  }





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
            <h2>An AI which helps you create good prompts for an IA (meta) !!!</h2>
          </div>
        </div>
        <div className={"prompt-box"}>
          <textarea
            className={"prompt-input"}
              placeholder="Start typing here..."
              value={userInput}
              onChange={onUserChangedText}/>
          { apiOutput &&
              <div className={"suggestion-div"}>
                <span className="input-label">{apiOutput}</span>
                <button className="generate-button" onClick={() => {
                  setUserInput(userInput + apiOutput.replace(/(\r\n|\n|\r)/gm, ""))
                }}>Add</button>
              </div>

          }
        </div>
        <div className="prompt-buttons">
          <div className={"slider-div"}>
            <span className={"span-slider"}>Suggestion's temperature</span>
            <input type="range" min="0" max="1" step={"0.1"} className="slider" value={temperature} onChange={(event => handleChange(event))}/>
          </div>
          <a
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={() => callGenerateEndpoint(userInput)}
          >
            <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p className={"button-text"}>Generate</p>}
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
