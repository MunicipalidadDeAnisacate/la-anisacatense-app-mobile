import { getColorByAuthDataRol } from "@/constants/Colors";
import { Button } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";


interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  rol: string;
}


const SearchInput: React.FC<SearchInputProps> = ({ placeholder = "Buscar...", onSearch, rol }) => {
  const [query, setQuery] = useState("");


  const handlePress = () => {
    onSearch(query);
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Buscar" onPress={handlePress} buttonStyle={[styles.button, { backgroundColor: getColorByAuthDataRol(rol) }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 7,
  },
});

export default SearchInput;
