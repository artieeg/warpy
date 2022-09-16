import React, { createRef } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, ButtonWithBackdrop } from "@warpy/components";
import { NextPageContext } from "next";
import { runNATSRequest } from "../../modules/comms";
import GooglePlay from "../../public/icons/google-play.svg";
import AppStore from "../../public/icons/app-store.svg";
import { AppInvite } from "@warpy/lib";

type InviteProps = {
  invite: AppInvite;
};

export default function Invite({ invite }: InviteProps) {
  const ref = createRef<ScrollView>();

  return (
    <View style={{ height: "100%" }}>
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{ height: "200vh" }}
        style={styles.body}
        ref={ref}
      >
        <View style={{ flex: 1 }}>
          <Text size="large" style={styles.header}>
            /welcome
          </Text>
          {invite?.user && (
            <Text size="small">
              <Text size="small" color="yellow">
                @{invite.user.username}
              </Text>{" "}
              invited you to join{" "}
              <Text size="small" color="yellow">
                thing
              </Text>
              , the new social live streaming app! Press on the code to copy!
            </Text>
          )}
          <View style={styles.info}>
            <Text size="large" color="yellow">
              {invite.code}
            </Text>
            <Text size="small" color="info" style={styles.center}>
              sign up with this code{"\n"}to get 3000 coins
            </Text>
          </View>
          <View style={styles.buttons}>
            <ButtonWithBackdrop color="#71F1F9" style={styles.appStoreButton}>
              <GooglePlay height={30} width={30} />
            </ButtonWithBackdrop>
            <View style={{ width: 20 }} />
            <ButtonWithBackdrop color="#ffffff" style={styles.appStoreButton}>
              <AppStore height={35} width={35} />
            </ButtonWithBackdrop>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#000",
    paddingHorizontal: 30,
  },
  autoscroll: {
    alignSelf: "center",
    alignItems: "center",
  },
  appStoreButton: {
    flex: 1,
  },
  header: {
    marginTop: 20,
    marginBottom: 50,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    marginBottom: 30,
  },
});

export async function getServerSideProps(context: NextPageContext) {
  const { invite } = await runNATSRequest("app-invite.get.by-id", {
    id: context.query.id,
  });

  console.log({ invite, id: context.query.id });

  return {
    props: {
      invite,
      title: `@${invite.user.username} invites you to join warpy!`,
      description: "join the new live social experience",
    },
  };
}
