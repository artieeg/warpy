import React, { useEffect, useRef, useState } from "react";
import { TextButton } from "@warpy/components";
import tinycolor from "tinycolor2";

export default function Join() {
  const [name, setName] = useState<string>();
  const [isNameValid, setNameValid] = useState<boolean>();

  const validationTimeout = useRef<any>();

  useEffect(() => {
    clearTimeout(validationTimeout.current);

    if (name?.length > 0) {
      validationTimeout.current = setTimeout(() => {
        setNameValid(true);
      }, 1000);
    } else {
      setNameValid(false);
    }
  }, [name]);

  return (
    <div className="px-3 space-y-4 bg-black flex-col flex-1">
      <div className="rounded-full absolute -top-4 right-4 w-8 h-8 bg-gradient-to-r from-red to-orange" />
      <div className="rounded-full absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-300" />

      <div>
        <div className="font-extrabold text-lg text-yellow">
          get on board 🚀
        </div>
      </div>

      <div>
        <input
          autoFocus
          placeholder="username"
          className="mb-1 text-white bg-transparent placeholder-boulder bg-red-500"
          onChange={(e) => setName(e.target.value)}
        />
        <div className="text-boulder text-xxs">
          pick a username that makes
          <br />
          you go 👍👍
        </div>
      </div>

      <div
        className={`transition-opacity duration-600 ${
          isNameValid === true ? "opacity-1" : "opacity-0"
        }`}
      >
        <input
          type="tel"
          placeholder="phone number"
          className="mb-1 text-white bg-transparent placeholder-boulder bg-red-500"
        />
        <div className="text-boulder text-xxs">
          we will text you a download link
          <br />
          right after we lauch 😎
        </div>
      </div>
    </div>
  );
}
