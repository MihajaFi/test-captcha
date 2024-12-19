"use client"
import { useActionState } from "react";
import CaptchaComponent from "./components/CaptchaComponent";

export default function Home() {
  return (
    <div>

      <h1>Welcome to the Captcha Example</h1>

      <CaptchaComponent />

    </div>
  );
}
