import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgUserRemove = (props: SvgProps) => (
  <Svg
    height={512}
    viewBox="0 0 24 24"
    width={512}
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 1"
    {...props}>
    <Path d="M9 12a6 6 0 1 0-6-6 6.006 6.006 0 0 0 6 6zM9 2a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm9 21a1 1 0 0 1-2 0 7 7 0 0 0-14 0 1 1 0 0 1-2 0 9 9 0 0 1 18 0zm5.707-8.707a1 1 0 1 1-1.414 1.414L20.5 13.914l-1.793 1.793a1 1 0 0 1-1.414-1.414l1.793-1.793-1.793-1.793a1 1 0 0 1 1.414-1.414l1.793 1.793 1.793-1.793a1 1 0 0 1 1.414 1.414L21.914 12.5z" />
  </Svg>
);

export default SvgUserRemove;
