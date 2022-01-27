import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgSend = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    {...props}>
    <Path d="m2 21 21-9L2 3v7l15 2-15 2v7Z" />
  </Svg>
);

export default SvgSend;
