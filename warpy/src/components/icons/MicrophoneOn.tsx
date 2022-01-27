import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgMicrophoneOn = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={512}
    height={512}
    {...props}>
    <Path d="M10 12a1 1 0 0 1-1 1H4.069a7.993 7.993 0 0 0 15.862 0H15a1 1 0 0 1 0-2h5V9h-5a1 1 0 0 1 0-2h4.931A7.993 7.993 0 0 0 4.069 7H9a1 1 0 0 1 0 2H4v2h5a1 1 0 0 1 1 1Z" />
    <Path d="M23 12a1 1 0 0 0-1 1 9.01 9.01 0 0 1-9 9h-2a9.011 9.011 0 0 1-9-9 1 1 0 0 0-2 0 11.013 11.013 0 0 0 11 11h2a11.013 11.013 0 0 0 11-11 1 1 0 0 0-1-1Z" />
  </Svg>
);

export default SvgMicrophoneOn;
