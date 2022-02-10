import React from "react";
import { ActivityIndicator } from "react-native";
import {
  ButtonWithBackdrop,
  ButtonWithBackdropProps,
} from "./ButtonWithBackdrop";
import { Text } from "./Text";

interface ITextButtonProps extends Omit<ButtonWithBackdropProps, "children"> {
  loading?: boolean;
  title: string;
}

const getTextColor = (disabled: boolean, textonly: boolean) => {
  if (textonly) {
    if (disabled) {
      return "info";
    } else {
      return "yellow";
    }
  } else {
    if (disabled) {
      return "white";
    } else {
      return "dark";
    }
  }
};

export const TextButton = (props: ITextButtonProps) => {
  const { disabled, loading, textonly } = props;

  return (
    <ButtonWithBackdrop {...props}>
      {loading && <ActivityIndicator size="small" color="#000000" />}

      {!loading && (
        <Text
          size="small"
          color={getTextColor(!!disabled, !!textonly)}
          weight="bold"
        >
          {props.title}
        </Text>
      )}
    </ButtonWithBackdrop>
  );
};
