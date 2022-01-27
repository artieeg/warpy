import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SvgFlag = (props: SvgProps) => (
  <Svg
    height={512}
    viewBox="0 0 24 24"
    width={512}
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 1"
    {...props}>
    <Path d="M1 24a1 1 0 0 1-1-1V4a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H2v10a1 1 0 0 1-1 1zM20 4h-3v5a6.006 6.006 0 0 1-6 6h-.444A3.987 3.987 0 0 0 14 17h6a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4z" />
  </Svg>
);

export default SvgFlag;
