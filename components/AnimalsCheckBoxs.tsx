import { CheckBox } from "@rneui/themed/dist/CheckBox";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type AnimalsCheckBoxProps = {
    onAnimalSelect: (animalId: number) => void;
    error?: string;
};

const  AnimalsCheckBox: React.FC<AnimalsCheckBoxProps> = ({ onAnimalSelect }) => {
    const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);

    const handleCheckboxChange = (animalId: number) => {
        setSelectedAnimalId(animalId);
        onAnimalSelect(animalId);
    };

    return (
        <View>
            <View style={{
                width: "85%",
                alignSelf: 'center',
                paddingVertical: 20,
                paddingHorizontal: 10,
                backgroundColor: "#fff",
                borderRadius: 12,
                elevation: 3
            }}>
                <CheckBox
                    title="Perro"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={selectedAnimalId === 1}
                    onPress={() => handleCheckboxChange(1)}
                    textStyle={styles.checkboxText}
                />
                <CheckBox
                    title="Caballo"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={selectedAnimalId === 2}
                    onPress={() => handleCheckboxChange(2)}
                    textStyle={styles.checkboxText}
                />
                <CheckBox
                    title="Cerdo"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={selectedAnimalId === 4}
                    onPress={() => handleCheckboxChange(4)}
                    textStyle={styles.checkboxText}
                />
                <CheckBox
                    title="Otro, mencionar en observación"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={selectedAnimalId === 3}
                    onPress={() => handleCheckboxChange(3)}
                    textStyle={styles.checkboxText}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#1E73BE",
        marginBottom: 10,
    },
    // checkboxContainer: {
    //     marginBottom: 20,
    //     width: "100%",
    // },
    checkboxText: {
        fontSize: 16,
        color: "#4A4A4A",
    },
    input: {
        maxWidth: "90%",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#FFFFFF",
        color: "#1F2937",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
})

export default AnimalsCheckBox;