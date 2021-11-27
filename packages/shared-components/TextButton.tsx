import React from "react";
import {
  ButtonWithBackdrop,
  ButtonWithBackdropProps,
} from "./ButtonWithBackdrop";
import { Text } from "./Text";

interface ITextButtonProps extends Omit<ButtonWithBackdropProps, "children"> {
  title: string;
}

export const TextButton = (props: ITextButtonProps) => {
  const { disabled } = props;

  return (
    <ButtonWithBackdrop {...props}>
      <Text size="small" color={disabled ? "white" : "dark"} weight="bold">
        {props.title}
      </Text>
    </ButtonWithBackdrop>
  );
};
