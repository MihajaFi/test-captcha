"use client"
import { useEffect } from 'react';

const CaptchaComponent = ({ onSuccess, onError }) => {
  useEffect(() => {
    const loadCaptchaScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://b82b1763d1c3.eu-west-3.captcha-sdk.awswaf.com/b82b1763d1c3/jsapi.js";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      });
    };

    loadCaptchaScript()
      .then(() => {
        const container = document.getElementById('my-captcha-container');
        if (window.AwsWafCaptcha) {
          window.AwsWafCaptcha.renderCaptcha(container, {
            apiKey: process.env.NEXT_PUBLIC_WAF_API_KEY,
            onSuccess: onSuccess,
            onError: onError,
          });
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement du script CAPTCHA :", error);
      });
  }, [onSuccess, onError]);

  return (
    <div>
      <div className="overlay"></div>
      <div id="my-captcha-container" style={{ display: 'block' }}></div>
      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        #my-captcha-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          background-color: white;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default CaptchaComponent;
