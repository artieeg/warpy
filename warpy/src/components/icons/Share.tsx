import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgShare = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    {...props}>
    <Path d="m21 12-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19l7-7Z" />
  </Svg>
);

export default SvgShare;
