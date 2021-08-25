import {useWindowDimensions} from 'react-native';

export const usePreviewDimensions = () => {
  const screenWidth = useWindowDimensions().width;
  const previewWidth = screenWidth / 2 - 20;
  const previewHeight = previewWidth * 1.8;

  return {previewWidth, previewHeight};
};
