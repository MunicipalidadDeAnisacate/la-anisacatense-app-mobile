import { getColorByAuthDataRol } from "@/constants/Colors";
import { Button } from "@rneui/themed/dist/Button";
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rol: string;
};

export default function Pagination({ currentPage, totalPages, onPageChange, rol }: PaginationProps) {

  return (
    <View style={styles.paginationContainer}>
      <Button
        title="Anterior"
        disabled={currentPage === 0}
        onPress={() => onPageChange(currentPage - 1)}
        buttonStyle={[styles.button, { backgroundColor: getColorByAuthDataRol(rol) }]}
        containerStyle={styles.buttonWrapper}
      />
      <Text style={styles.pageInfo}>
        Pág. {currentPage + 1} de {totalPages}
      </Text>
      <Button
        title="Siguiente"
        disabled={currentPage + 1 === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        buttonStyle={[styles.button, { backgroundColor: getColorByAuthDataRol(rol) }]}
        containerStyle={styles.buttonWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    position: 'absolute',
    bottom: 0,
    left: Platform.OS === "ios" ? 10 : 5,   // espacio a la izquierda
    right: Platform.OS === "ios" ? 10 : 5,  // espacio a la derecha
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: Platform.OS === "ios" ? 6 : 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonWrapper: {
    marginVertical: 5
  },
  button: {
    borderRadius: 8,
    paddingVertical: 5,
  },
});
