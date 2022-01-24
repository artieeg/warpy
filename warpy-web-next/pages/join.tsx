import React, { useEffect, useRef, useState } from "react";
import { TextButton } from "@warpy/components";
import tinycolor from "tinycolor2";

export default function Join() {
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
          placeholder="username"
          className="mb-1 text-white bg-transparent placeholder-boulder bg-red-500"
        />
        <div className="text-boulder text-xxs">
          pick a username that makes
          <br />
          you go 👍👍
        </div>
      </div>
    </div>
  );
}
