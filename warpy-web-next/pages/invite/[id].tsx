import React, { createRef } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Text, ButtonWithBackdrop } from "@warpy/components";
import { NextPageContext } from "next";
import { runNATSRequest } from "../../modules/comms";
import GooglePlay from "../../public/icons/google-play.svg";
import AppStore from "../../public/icons/app-store.svg";
import ChevronDown from "../../public/icons/chevron-down.svg";
import Heart from "../../public/icons/heart.svg";

type InviteProps = {
  invite: any;
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
          <Pressable
            onPress={() => {
              ref.current?.scrollToEnd();
            }}
            style={[
              styles.autoscroll,
              {
                paddingBottom: 60,
              },
            ]}
          >
            <Text size="small" color="info">
              message from the dev
            </Text>
            <ChevronDown fill="#7B7B7B" width={30} height={30} />
          </Pressable>
        </View>

        <div className="notch-padding" style={{ flex: 1 }}>
          <Pressable
            onPress={() => {
              ref.current?.scrollTo({ y: 0 });
            }}
            style={[styles.autoscroll, { paddingTop: 60, paddingBottom: 60 }]}
          >
            <View style={{ transform: [{ rotate: "180deg" }] }}>
              <ChevronDown fill="#7B7B7B" width={30} height={30} />
            </View>
            <Text size="small" color="info">
              back to the invite
            </Text>
          </Pressable>
          <Text style={{ marginBottom: 20 }} size="large">
            hi
            <br />
            <br />
          </Text>

          <Text size="small">
            i’ve put a ton of love in this app over the past few months, adding
            a ton of cool features and having even more in the pipeline <br />
            <br />
            keeping things free with no ads as well <br />
            <br />
            come join to get the vibe going!
          </Text>

          <View
            style={{
              marginTop: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart width={40} height={40} fill="#BDF971" />
          </View>
        </div>
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
  console.log("ip", context.req.socket.address);

  const { invite } = await runNATSRequest("app-invite.get.by-id", {
    id: context.query.id,
  });

  return {
    props: { invite },
  };
}
