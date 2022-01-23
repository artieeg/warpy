import React from "react";
import { TextButton } from "@warpy/components";

export default function Index() {
  return (
    <div className="p-3 space-y-6 bg-black flex-col flex-1">
      <div>
        <div className="font-extrabold text-lg text-yellow">warpy</div>
        <div className="font-extrabold text-xxs text-boulder">
          live social voice & video
        </div>
      </div>

      <div>
        <div className="font-bold text-xs text-green">
          <span className="text-yellow">warpy’s</span> goal is to create
          <div className="text-blue">some thing</div>
          <div>between people interested in...</div>
        </div>
      </div>

      <TextButton title="reserve a username" />
    </div>
  );
}
