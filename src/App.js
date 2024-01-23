import { ReactComponent as Svg } from "./logo.svg";
// import { ReactComponent as BrainPNG } from "./brain-blue.png";
import BrainPNG from "./brain-blue.png"; // Adjust the path to your image file

import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import csvFile from "./script2.csv";
import sidebarCsvFile from "./sidebar_script.csv";

function SamGPT() {
  const [script, setScript] = useState([]);
  const [sidebarScript, setsidebarScript] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(false);
  const messagesEndRef = useRef(null);
  const AIName = "Cognaitive";

  useEffect(() => {
    // Fetch the CSV file and parse it
    fetch(csvFile)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            // console.log('results', results.data)
            setScript(results.data);

            if (results.data) {
              const res = results.data[0];
              if (res.Person !== "COGNITIVE") {
                setUserName(res.Person);
              } else {
                setUserName(results.data[1].Person);
              }
            }
          },
        });
      });

    fetch(sidebarCsvFile)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: false,
          complete: (results) => {
            setsidebarScript(results.data);
          },
        });
      });
  }, []); // Empty dependency array ensures this effect ru
  useEffect(() => {
    console.log("script", script);
    script.forEach((row, index) => {
      if (row.Person === "COGNITIVE" && index === 0 && messages.length === 0) {
        setMessages([...messages, { text: row.Line, sender: "ai" }]);
      }
    });
  }, [script]); // Empty dependency array ensu(res) this effect ru

  const sendMessage = (event) => {
    const index = messages.length + 1;
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
    const res = script[index];
    console.log("index", index, res);

    // const aiResponse = GetResponse(inputText);
    if (res?.Line?.length > 0 && res.Person === "COGNITIVE") {
      setMessages((messages) => [
        ...messages,
        { text: res.Line, sender: "ai" },
      ]);
    }
  };

  const isLastMessageIndex = messages.length;

  useEffect(() => {
    console.log('scroll')
    if (messages.length > 2) {
      var chatContainer = document.querySelector(".messages");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <div className="header">
        <div className="header-one">
          <div className="circle2">
            <img src={BrainPNG} class="svg" alt="Description" />
          </div>
        </div>
        <div className="header-two">
          <h1>Cog beta V2.14</h1>
        </div>
      </div>
      <div className="parent">
        <Sidebar sidebarScript={sidebarScript}></Sidebar>
        <div className="child">
          {/* <h1>Cog beta V2.14</h1> */}
          <div className="samgpt-container">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <div>
                    {msg.sender === "ai" && (
                               <div className="circle2">
                               <img src={BrainPNG} class="svg" alt="Description" />
                             </div>
                      // <img src={BrainPNG} class="img-icon" alt="Description" />
                    )}
                  </div>
                  <div>
                    <p className="sender">
                      {msg.sender === "ai" ? AIName : userName}
                    </p>
                    {GetMessage(msg, index, loading, isLastMessageIndex)}
                  </div>
                  {msg.sender !== "ai" && (
                    <div>
                      <div class="circle">
                        <span>{userName[0]}</span>
                      </div>
                    </div>
                  )}
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
                  className="submit_svg"
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
    </>
  );
}

function GetMessage(msg, index, loading, isLastMessageIndex) {
  const isAI = msg.sender === "ai";
  if (isAI && loading && isLastMessageIndex - 1 === index) {
    return (
      <div className="loading">
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  } else if (isAI) {
    return <TypingEffect text={msg.text} speed={50} />;
  } else {
    return <p>{msg.text}</p>;
  }
}

const TypingEffect = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState("");

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

function Sidebar(props) {
  const { sidebarScript } = props;

  // console.log('sidebarScript', sidebarScript)
  return (
    <div className="sidebar">
      {/* <h1>Cognitive</h1> */}
      {/* <div className="circle2">
              <img src={BrainPNG} class="svg" alt="Description" />
            </div> */}
      <div className="sidebar-content">
        {sidebarScript &&
          sidebarScript.map((innerArray, index) => (
            <div key={index} div>
              {innerArray.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={
                    itemIndex === 0
                      ? "sidebar-item sidebar-item-header"
                      : "sidebar-item"
                  }>
                  {item}{" "}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}


function smoothScrollToBottom() {
  var chatContainer = document.querySelector(".messages");
  chatContainer.scrollTop = chatContainer.scrollHeight;
  var scrollHeight = chatContainer.scrollHeight;
  var currentPosition = chatContainer.scrollTop;
  var step = 5; // Adjust the scrolling speed as needed

  function scroll() {
      currentPosition += step;
      if (currentPosition >= scrollHeight) {
          chatContainer.scrollTop = scrollHeight;
      } else {
          chatContainer.scrollTop = currentPosition;
          requestAnimationFrame(scroll);
      }
  }

  scroll();
}