"use client";
import Form from "./components/Form";
import { useState } from "react";
import CaptchaComponent from "./components/CaptchaComponent";

export default function Home() {
  const [number, setNumber] = useState('');
  const [output, setOutput] = useState([]);
  const [isCaptchaVisible, setCaptchaVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(1);

  const handleFormSubmit = (N) => {
    setOutput([]);
    setCaptchaVisible(false);
    setCurrentRequest(1);
    const fetchSequence = async () => {
      if (currentRequest > N) return;

      try {
        const response = await fetch("https://api.prod.jcloudify.com/whoami");
        if (response.status === 405) {
          throw new Error("CaptchaRequired");
        } else if (!response.ok) {
          throw new Error("Forbidden");
        }
        const data = await response.text();
        setOutput((prevOutput) => [...prevOutput, `${currentRequest}. ${data}`]);
        setCurrentRequest((prevRequest) => prevRequest + 1);
        setTimeout(fetchSequence, 1000);
      } catch (error) {
        if (error.message === "CaptchaRequired") {
          handleCaptcha().then(() => {
            setTimeout(fetchSequence, 1000);
          });
        } else if (error.message === "Forbidden") {
          setOutput((prevOutput) => [
            ...prevOutput,
            `${currentRequest}. Forbidden`,
          ]);
          setCurrentRequest((prevRequest) => prevRequest + 1);
          setTimeout(fetchSequence, 1000);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };
    fetchSequence();
  };

  const handleCaptcha = () => {
    return new Promise((resolve) => {
      setCaptchaVisible(true);
      window.captchaResolved = resolve;
    });
  };

  const captchaSuccess = () => {
    const container = document.getElementById("my-captcha-container");
    if (container) container.style.display = 'none';
    if (window.captchaResolved) window.captchaResolved();
  };

  const captchaError = (error) => {
    console.error("CAPTCHA error:", error);
  };

  return (
    <div>
      <h1>Générateur de Séquence</h1>
      <Form onSubmit={handleFormSubmit} />
      <div id="output">
        {output.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      {isCaptchaVisible && (
        <CaptchaComponent onSuccess={captchaSuccess} onError={captchaError} />
      )}
    </div>
  );
}
