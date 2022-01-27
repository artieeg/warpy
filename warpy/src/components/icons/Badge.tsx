import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgBadge = (props: SvgProps) => (
  <Svg
    height={512}
    viewBox="0 0 24 24"
    width={512}
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 1"
    {...props}>
    <Path d="M12 16a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8zm0 2a9.938 9.938 0 0 1-6-2.019V21.5a2.5 2.5 0 0 0 4.062 1.952l1.626-1.3a.5.5 0 0 1 .624 0l1.626 1.3A2.5 2.5 0 0 0 18 21.5v-5.519A9.94 9.94 0 0 1 12 18z" />
  </Svg>
);

export default SvgBadge;
