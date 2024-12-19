"use client"
import { useEffect, useRef } from 'react';

const CaptchaComponent = () => {
  const captchaContainerRef = useRef(null);

  useEffect(() => {

    if (!window.AwsWafCaptcha) {
      const script = document.createElement('script');
      script.src = 'https://b82b1763d1c3.eu-west-3.captcha-sdk.awswaf.com/b82b1763d1c3/jsapi.js';
      script.async = true;
      script.onload = () => {
    
        window.WAF_API_KEY = process.env.NEXT_PUBLIC_WAF_API_KEY;
        showMyCaptcha();
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      window.WAF_API_KEY = process.env.NEXT_PUBLIC_WAF_API_KEY;
      showMyCaptcha();
    }
  }, []);

  const showMyCaptcha = () => {
    if (captchaContainerRef.current && window.AwsWafCaptcha) {
      window.AwsWafCaptcha.renderCaptcha(captchaContainerRef.current, {
        apiKey: window.WAF_API_KEY,
        onSuccess: captchaExampleSuccessFunction,
        onError: captchaExampleErrorFunction,
      });
    }
  };

  const captchaExampleSuccessFunction = (wafToken) => {
    console.log('Captcha success:', wafToken);
  };

  const captchaExampleErrorFunction = (error) => {
    // Handle error
    console.error('Captcha error:', error);
  };

  return (
    <div>
      <div ref={captchaContainerRef}>
        {/* The contents of this container will be replaced by the captcha widget */}
      </div>
      <button onClick={showMyCaptcha}>Show Captcha</button>
    </div>
  );
};

export default CaptchaComponent;