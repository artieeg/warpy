import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TextButton } from "@warpy/components";
import {
  FacebookShareButton,
  RedditShareButton,
  TwitterShareButton,
} from "react-share";
import { Facebook, Reddit, Twitter } from "../icons";

const gifs = [
  "https://c.tenor.com/AmtGg5GiqIAAAAAC/shaquille-o-neal-excited.gif",
  "https://c.tenor.com/_KEXdS8RXYoAAAAC/kermit-freaking-out.gif",
  "https://c.tenor.com/rlE_CTcXPQkAAAAC/happy-dancing.gif",
  "https://c.tenor.com/_NMzaxfKAJYAAAAC/excited-dog.gif",
  "https://c.tenor.com/jYsU_wcUdvoAAAAC/cat-car.gif",
  "https://c.tenor.com/Nh7N6tq8SnYAAAAd/friends-rachel-green.gif",
  "https://c.tenor.com/BNg5I6x4wUsAAAAC/im-so-excited-freaking-cant-wait.gif",
];

const acks = ["CEO of cool", "a real one", "epic human"];

export default function Join() {
  const [name, setName] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const ack = useMemo(() => acks[Math.floor(Math.random() * acks.length)], []);

  const [isFinished, setFinished] = useState(false);
  const [isMoving, setMoving] = useState(false);

  const [isNameValid, setNameValid] = useState<boolean>();
  const [isPhoneInputFocused, setPhoneInputFocused] = useState(false);

  const validationTimeout = useRef<any>();

  const [gifIdx, setGifIdx] = useState(Math.floor(Math.random() * gifs.length));

  useEffect(() => {
    if (!isFinished) return;

    setTimeout(() => {
      setMoving(true);
    }, 100);
  }, [isFinished]);

  const onConfirm = useCallback(() => {
    setFinished(true);
  }, []);

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
    <div className="px-3 bg-black flex-col flex-1">
      <div
        className={`absolute left-0 top-0 bottom-0 right-0 transition-opacity duration-600 ${
          isFinished ? "opacity-1" : "hidden opacity-0"
        }`}
      >
        <img
          src={gifs[gifIdx % gifs.length]}
          className={`absolute left-0 right-0 top-0 w-full h-auto 
transition-opacity duration-1000 max-h-2/5 delay-[5000ms] ${
            isMoving ? "opacity-1" : "opacity-0"
          }
          `}
        />

        <div className="items-center absolute left-0 top-0 bottom-0 right-0  flex flex-col justify-center flex-1">
          <span className="text-white text-xxs">
            ✍️ <span className="text-yellow">{name}</span>
            <>, {ack} </>
            ✍️
          </span>
          <span
            className={`text-boulder text-xxs mt-2 transition-opacity duration-1000 delay-[5000ms] ${
              isMoving ? "opacity-1" : "opacity-0"
            }`}
          >
            cya in april 🤩🤩🤩
          </span>

          <div
            style={{ left: isMoving ? "100vw" : 0 }}
            className={`absolute top-0 h-full w-full bg-black transition-left delay-250 duration-[5000ms]`}
          />
        </div>

        <div
          className={`absolute space-y-2 items-center flex flex-col bottom-6 left-3 right-3 transition-opacity duration-1000 delay-[5300ms] ${
            isMoving ? "opacity-1" : "opacity-0"
          }`}
        >
          <span className={`text-white text-xxs`}>share with friends 🤙</span>
          <div className="flex row space-x-3">
            <TwitterShareButton url="google.com" title="check this">
              <Twitter className="w-6 h-6" fill="#ffffff" />
            </TwitterShareButton>

            <FacebookShareButton url="google.com" title="check this">
              <Facebook className="w-6 h-6" fill="#ffffff" />
            </FacebookShareButton>

            <RedditShareButton url="google.com" title="check this">
              <Reddit className="w-6 h-6" fill="#ffffff" />
            </RedditShareButton>
          </div>
        </div>
      </div>

      <div
        className={`space-y-4  transition-opacity duration-600 ${
          isFinished ? "opacity-0" : "opacity-1"
        }`}
      >
        <div className="rounded-full absolute -top-4 right-4 w-8 h-8 bg-gradient-to-r from-red to-orange" />
        <div className="rounded-full absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-300" />

        <div>
          <div className="font-extrabold text-lg text-yellow">
            get on board 🚀
          </div>
        </div>

        <div className="w-full">
          <input
            autoFocus
            placeholder="username"
            className="mb-1 appearance-none outline-none w-full text-white bg-transparent placeholder-boulder"
            onChange={(e) => setName(e.target.value)}
          />
          <div
            className={`text-boulder text-xxs transition-opacity duration-1000 transition-mt ${
              isPhoneInputFocused && "-mt-8 opacity-0"
            }`}
          >
            pick a username that makes
            <br />
            you go 👍👍
          </div>
        </div>

        <div
          className={`w-full transition-opacity duration-600 ${
            isNameValid === true ? "opacity-1" : "opacity-0"
          }`}
        >
          <input
            onFocus={() => setPhoneInputFocused(true)}
            onBlur={() => setPhoneInputFocused(false)}
            placeholder="phone number"
            className="mb-1 appearance-none outline-none w-full text-white bg-transparent placeholder-boulder"
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="text-boulder text-xxs">
            we will text you a download link
            <br />
            right after we lauch 😎
          </div>
        </div>

        <div
          className={`w-full transition-opacity duration-600 ${
            phone?.length > 5 === true ? "opacity-1" : "opacity-0"
          }`}
        >
          <TextButton title="finish" onPress={onConfirm} />
        </div>
      </div>
    </div>
  );
}