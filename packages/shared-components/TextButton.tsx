import React from "react";
import {
  ButtonWithBackdrop,
  ButtonWithBackdropProps,
} from "./ButtonWithBackdrop";
import { Text } from "./Text";

interface ITextButtonProps extends Omit<ButtonWithBackdropProps, "children"> {
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
  const { disabled, textonly } = props;

  return (
    <ButtonWithBackdrop {...props}>
      <Text
        size="small"
        color={getTextColor(!!disabled, !!textonly)}
        weight="bold"
      >
        {props.title}
      </Text>
    </ButtonWithBackdrop>
  );
};
