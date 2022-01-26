import React, { useEffect, useRef, useState } from "react";
import { TextButton } from "@warpy/components";
import tinycolor from "tinycolor2";
import { useRouter } from "next/dist/client/router";

const content = [
  "unusual conversations 👀",
  "new friendships 😊",
  "miraclous moments ✨",
  "fun memories 😂",
  "insightful ideas 💡",
  "unexpected encounters 🤝",
];

const interests = [
  "talent shows 🤪",
  "adventures 🚣",
  "debates 🏅",
  "pets 🐕",
  "random 🎲",
];

export default function Index() {
  const fadingText = useRef<HTMLDivElement>();

  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  const flick = React.useCallback(() => {
    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setVisible(true);
        setCurrent((prev) => prev + 1);

        flick();
      }, 1000);
    }, 1500);
  }, []);

  useEffect(() => {
    flick();
  }, []);

  const renderInterests = React.useCallback(() => {
    return interests.map((interest, idx) => (
      <span
        style={{
          color: tinycolor("#BDF971")
            .spin((idx + 1) * (255 / interests.length + 30))
            .toHexString(),
        }}
        className="font-bold text-base text-blue mx-3"
      >
        {interest}
      </span>
    ));
  }, []);

  return (
    <div className="px-3 space-y-4 bg-black flex-col flex-1">
      <div className="rounded-full absolute -top-4 right-4 w-8 h-8 bg-gradient-to-r from-red to-orange" />
      <div className="rounded-full absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-300" />

      <div>
        <div className="font-extrabold text-lg text-yellow">warpy</div>
        <div className="font-extrabold text-xxs text-boulder">
          live social voice & video
        </div>
      </div>

      <div>
        <div className="font-bold text-xs text-green">
          <span className="text-yellow">warpy </span>
          {/*
          <>warpy </>
  */}
          is here to create
          <div
            ref={fadingText}
            className={`text-orange transition-opacity duration-1000 ${
              visible ? "opacity-1" : "opacity-0"
            }`}
          >
            {content[current % content.length]}
          </div>
          <div>between people interested in...</div>
        </div>
      </div>

      <div className="-mx-3 relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap ">
          {renderInterests()}
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
          {renderInterests()}
        </div>
      </div>

      <div>
        <div className="font-bold text-xs text-green">
          reserve a username now and get in first when we launch!
        </div>
      </div>

      <TextButton
        onPress={() => router.push("/join")}
        title="reserve a username"
      />
    </div>
  );
}
