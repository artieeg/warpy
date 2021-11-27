import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedbackProps,
  TouchableWithoutFeedback,
} from "react-native";
import tinycolor from "tinycolor2";

export interface ButtonWithBackdropProps extends TouchableWithoutFeedbackProps {
  color?: string;
  children: any;
}

const DEFAULT_COLOR = "#F9F871";
const DISABLED_COLOR = "#373131";
const DISABLED_BACKDROP_COLOR =
  "#" + tinycolor(DISABLED_COLOR).darken(5).toHex();

export const ButtonWithBackdrop = (props: ButtonWithBackdropProps) => {
  const { disabled, color } = props;

  const [buttonStyle, backdropStyle] = useMemo(
    () =>
      disabled
        ? [
            {
              backgroundColor: DISABLED_COLOR,
            },
            {
              backgroundColor: DISABLED_BACKDROP_COLOR,
            },
          ]
        : [
            {
              backgroundColor: color || DEFAULT_COLOR,
            },
            {
              backgroundColor:
                "#" +
                tinycolor(color || DEFAULT_COLOR)
                  .darken(35)
                  .toHex(),
            },
          ],
    [disabled, color]
  );

  console.log({ backdropStyle, buttonStyle });

  return (
    <View style={props.style}>
      <TouchableWithoutFeedback {...props} style={{}}>
        <>
          <View style={[{ height: 50 }]}>
            <View style={[styles.backdrop, backdropStyle]} />
            <View style={[styles.wrapper, buttonStyle]}>{props.children}</View>
          </View>
        </>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    //backgroundColor: '#F9F871',
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#373131",
  },
  backdrop: {
    borderRadius: 25,
    transform: [{ translateY: 5 }, { scale: 0.97 }],
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backdropDisabledColor: {
    backgroundColor: "#171111",
  },
  backdropActiveColor: {
    backgroundColor: "#ADAD4F",
  },
});
