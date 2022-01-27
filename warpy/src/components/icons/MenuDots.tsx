import * as React from 'react';
import Svg, {SvgProps, Circle} from 'react-native-svg';

const SvgMenuDots = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={512}
    height={512}
    {...props}>
    <Circle cx={2} cy={12} r={2} />
    <Circle cx={12} cy={12} r={2} />
    <Circle cx={22} cy={12} r={2} />
  </Svg>
);

export default SvgMenuDots;
