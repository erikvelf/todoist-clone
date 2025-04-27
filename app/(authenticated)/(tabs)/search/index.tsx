import { ReactElement } from "react";
import { View, Text, ScrollView } from "react-native";

const createNumberedText = () => {
  const arr: number[] = [];
  for (let i = 1; i <= 60; i++) {
    arr.push(i);
  }

  const numberedText: Array<ReactElement> = arr.map((num) => {
    return <Text key={num}>Text number {num}</Text>;
  });
  return numberedText;
};

const Page = () => {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View>
        <Text>Search</Text>
        {createNumberedText()}
      </View>
    </ScrollView>
  );
};

export default Page;
