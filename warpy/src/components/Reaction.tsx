import React from 'react';
import {SvgProps} from 'react-native-svg';
import Sparkles from '../reactions/2728.svg';
import Poop from '../reactions/1f4a9.svg';
import Wave from '../reactions/1f44b.svg';
import ThumbsUp from '../reactions/1f44d.svg';
import ThumbsDown from '../reactions/1f44e.svg';
import Clap from '../reactions/1f44f.svg';
import Alien from '../reactions/1f47e.svg';
import Surprised from '../reactions/1f62e.svg';
import Eyes from '../reactions/1f440.svg';
import Skull from '../reactions/1f480.svg';
import Heart from '../reactions/1f499.svg';
import Smile from '../reactions/1f600.svg';
import Laugh from '../reactions/1f606.svg';
import Neutral from '../reactions/1f610.svg';
import Angry from '../reactions/1f620.svg';
import Sleepy from '../reactions/1f634.svg';
import MonkeyHide from '../reactions/1f648.svg';
import Clown from '../reactions/1f921.svg';
import Flex from '../reactions/1f4aa.svg';
import Fire from '../reactions/1f525.svg';

const reactions = {
  '2728': (props: SvgProps) => <Sparkles {...props} />,
  '1f4a9': (props: SvgProps) => <Poop {...props} />,
  '1f44b': (props: SvgProps) => <Wave {...props} />,
  '1f44d': (props: SvgProps) => <ThumbsUp {...props} />,
  '1f44e': (props: SvgProps) => <ThumbsDown {...props} />,
  '1f44f': (props: SvgProps) => <Clap {...props} />,
  '1f47e': (props: SvgProps) => <Alien {...props} />,
  '1f62e': (props: SvgProps) => <Surprised {...props} />,
  '1f440': (props: SvgProps) => <Eyes {...props} />,
  '1f480': (props: SvgProps) => <Skull {...props} />,
  '1f499': (props: SvgProps) => <Heart {...props} />,
  '1f600': (props: SvgProps) => <Smile {...props} />,
  '1f606': (props: SvgProps) => <Laugh {...props} />,
  '1f610': (props: SvgProps) => <Neutral {...props} />,
  '1f620': (props: SvgProps) => <Angry {...props} />,
  '1f634': (props: SvgProps) => <Sleepy {...props} />,
  '1f648': (props: SvgProps) => <MonkeyHide {...props} />,
  '1f921': (props: SvgProps) => <Clown {...props} />,
  '1f4aa': (props: SvgProps) => <Flex {...props} />,
  '1f525': (props: SvgProps) => <Fire {...props} />,
};

export const reactionCodes = Object.keys(reactions);

export interface IReactionProps {
  code: string;
  size?: number;
}

export const Reaction = (props: IReactionProps) => {
  const {code, size} = props;
  const ReactionComponent = (reactions as any)[code];

  return ReactionComponent({height: size || 30, width: size || 30});
};
