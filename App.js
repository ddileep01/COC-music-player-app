import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

const App = ()=>{
  const [count, setCount] = useState(0);
  return(
    <View style={[styles.center, {top:50}]}>
      <Text>
        You clicked {count} times
      </Text>
      <Button onPress={()=>setCount(count+1)} title="Click me"/>
    </View>
  )
}

export default App;
const styles = StyleSheet.create({
  center:{
    alignItems:'center'
  }
});