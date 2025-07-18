import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform
} from "react-native";
import FilterBar from "./FilterBar"; // Ajusta la ruta según tu estructura
import { getColorByAuthDataRol } from "@/constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';


type FiltersDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  filters: any[]; // Puedes tiparlo mejor según tu FilterConfig
  onClose: () => void;
  rol: string;
};

const FiltersDialog: React.FC<FiltersDialogProps> = ({
  visible,
  onDismiss,
  filters,
  onClose,
  rol
}) => {

  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Filtros</Text>
          <View style={styles.scrollArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <FilterBar filters={filters} />
            </ScrollView>
            {Platform.OS !== 'ios' &&
             <LinearGradient
              colors={['transparent', '#F8FAFC']}
              style={styles.scrollGradient}
            />}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, {backgroundColor: getColorByAuthDataRol(rol)}]} onPress={onClose}>
              <Text style={styles.buttonLabel}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialog: {
    width: "95%",
    maxHeight: "80%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  scrollArea: {
    marginVertical: 10,
    maxHeight: "80%",
    overflow: "hidden",
  },
  scrollGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  actions: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default FiltersDialog;
