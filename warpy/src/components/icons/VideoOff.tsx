import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgVideoOff = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    {...props}>
    <Path d="M3.27 2 2 3.27 4.73 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12c.2 0 .39-.08.54-.18L19.73 21 21 19.73M21 6.5l-4 4V7a1 1 0 0 0-1-1H9.82L21 17.18V6.5Z" />
  </Svg>
);

export default SvgVideoOff;
