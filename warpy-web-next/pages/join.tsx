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
import { validate } from "email-validator";

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
  const [email, setEmail] = useState<string>();
  const ack = useMemo(() => acks[Math.floor(Math.random() * acks.length)], []);

  const [isFinished, setFinished] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isMoving, setMoving] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [isNameValid, setNameValid] = useState<boolean>();
  const [isPhoneInputFocused, setEmailInputFocused] = useState(false);

  useEffect(() => {
    setEmailError("");
  }, [email]);

  const validationTimeout = useRef<any>();

  //TODO use memo
  const [gifIdx] = useState(Math.floor(Math.random() * gifs.length));

  useEffect(() => {
    if (!isFinished) return;

    setTimeout(() => {
      setMoving(true);
    }, 100);
  }, [isFinished]);

  const onConfirm = useCallback(async () => {
    if (!email || !name) {
      return;
    }

    if (!validate(email)) {
      setEmailError("this email doesn't look right 🤷");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/waitlist/user`,
        {
          //mode: "no-cors",
          method: "POST",
          headers: [["content-type", "application/json"]],
          body: JSON.stringify({
            email,
            username: name,
          }),
        }
      );

      const json = await response.json();
      const field = json?.field;

      if (field) {
        console.log(field);
        if (field === "username") {
          setNameError("this username seems to be taken :(");
        } else if (field === "email") {
          setEmailError("this email has been used already :(");
        }
      } else {
        setFinished(true);
      }
    } catch (e) {
      console.log(e);
      if (e.response.field) {
        if (e.response.field === "name") {
          setNameError("this username seems to be taken :(");
        } else if (e.response.field === "email") {
          setEmailError("this email has been used already :(");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [email, name]);

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
            } ${nameError ? "text-red" : "text-boulder"}`}
          >
            {nameError && nameError}

            {!nameError && (
              <>
                pick a username that makes
                <br />
                you go 👍👍
              </>
            )}
          </div>
        </div>

        <div
          className={`w-full transition-opacity duration-600 ${
            isNameValid === true ? "opacity-1" : "opacity-0"
          }`}
        >
          <input
            type="email"
            onFocus={() => setEmailInputFocused(true)}
            onBlur={() => setEmailInputFocused(false)}
            placeholder="email"
            className="mb-1 appearance-none outline-none w-full text-white bg-transparent placeholder-boulder"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div
            className={`text-boulder text-xxs ${
              emailError ? "text-red" : "text-boulder"
            }`}
          >
            {emailError && emailError}

            {!emailError && (
              <>
                we will send you a download link
                <br />
                right after we lauch 😎
              </>
            )}
          </div>
        </div>

        <div
          className={`w-full transition-opacity duration-600 ${
            email?.length > 5 === true ? "opacity-1" : "opacity-0"
          }`}
        >
          <TextButton
            loading={isLoading}
            disabled={email?.length <= 5}
            title="finish"
            onPress={onConfirm}
          />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  console.log("new visit /join", new Date());

  return {};
}
