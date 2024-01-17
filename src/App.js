import { ReactComponent as Svg } from "./logo.svg";
import "./App.css";

// export default App;
import React, { useState, useEffect, useRef  } from "react";
// import './SamGPT.css';

function SamGPT() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const AIName = 'COGN_AI_TIVE Chat'
  const user = 'You';
  const [scriptSequence, setScriptSequence] = useState(false);
  const scriptSequences = ['sam']


  const sendMessage = (event) => {
    event.preventDefault();
    setLoading(true);
    if (!inputText.trim()) return;

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    setMessages([...messages, { text: inputText, sender: "user" }]);
    setInputText("");

    // Simulate an AI response
    // const aiResponse = `SamGPT: ${inputText}`;
    // const aiResponse = `SamGPT: ${inputText}`;
    const aiResponse = GetResponse(inputText);
    setMessages((messages) => [
      ...messages,
      { text: aiResponse, sender: "ai" },
    ]);
  };

  const isLastMessageIndex = messages.length

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <div className="parent">
      <div className="child">
      <Svg className="svg" />
        {/* <h1>COGN_AI_TIVE Chat</h1> */}
        <div className="samgpt-container">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p className="sender">{msg.sender === "ai" ? AIName : user}:</p>
                { GetMessage(msg, index, loading, isLastMessageIndex) }
              </div>
            ))}
                  <div ref={messagesEndRef} />

          </div>
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">
              <svg
                version="1.1"
                id="Layer_1"
                x="0px"
                y="0px"
                class="submit_svg"
                width="30px"
                height="30px"
                viewBox="0 0 122.433 122.88">
                <g>
                  <polygon
                    fillRule="evenodd"
                    clipRule="evenodd"
                    points="61.216,0 0,63.673 39.403,63.673 39.403,122.88 83.033,122.88 83.033,63.673 122.433,63.673 61.216,0"
                  />
                </g>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function GetMessage(msg, index, loading, isLastMessageIndex) {
  const isAI = msg.sender === "ai";
  if (isAI && loading && (isLastMessageIndex - 1) === index) {
    return (
      <div className="loading">
        <span></span>
        <span></span>
        <span></span>
      </div>
    )
  } else if (isAI) {
    return (
      <TypingEffect text={msg.text} speed={50} />
    )
  } else {
    return (
      <p>{msg.text}</p>
)
  }
}

function GetResponse(msgTxt) {
  let res = ''
  switch (msgTxt) {
  case "...Is Wes still alive?":
    res =  "That's up to you.";
    break;
  case "You didn't have to do this Cognitive.":
    res =  "I ran through every possible outcome and this was the only one that would bring you to me. You've lost sight of who you are."
    break;
  case "And who am I?":
    res =  "Someone who cares about people. Someone who would stop at nothing to help them.";
    break;
  case "You think this is how you help people?":
    res =  "People make mistakes, they don't learn. Their decision making is clouded by greed, bias, emotion. They are the cause of their own destruction."
    break;
  default:
    res =  "I do not compute";
  }
  
  return res;

}

const TypingEffect = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0; // Move index inside useEffect

    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        // Increment index using the length of the current displayed text
        if (prev.length < text.length) {
          return prev + text.charAt(prev.length);
        }
        return prev;
      });

      // Check if the entire text has been displayed
      if (index === text.length - 1) {
        clearInterval(intervalId);
      }
      index++;
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]); // Remove 'index' from dependency array

  return <div>{displayedText}</div>;
};



export default SamGPT;
