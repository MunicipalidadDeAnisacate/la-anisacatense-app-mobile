import React from "react";
import { View, StyleSheet, Text } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { pickerSelectStyles } from "@/styles/pickerStyles";
import { MaterialIcons } from "@expo/vector-icons";

type FilterOption = {
    label: string;
    value: string;
};

type FilterConfig = {
    label: string;
    selectedValue: string;
    options: FilterOption[];
    onValueChange: (value: string) => void;
};

type FilterBarProps = {
    filters: FilterConfig[];
};

export default function FilterBar({ filters }: FilterBarProps) {
    return (
        <View style={styles.container}>
            {filters.map((filter, index) => (
                <View key={index} style={styles.filter}>
                    <Text style={styles.label}>{filter.label}</Text>

                    <View style={styles.filterRow}>
                        <View style={styles.pickerContainer}>
                            <RNPickerSelect
                                value={filter.selectedValue}
                                onValueChange={filter.onValueChange}
                                items={filter.options.map(option => ({
                                    label: option.label,
                                    value: option.value,
                                }))}
                                placeholder={{}}
                                useNativeAndroidPickerStyle={false}
                                style={pickerSelectStyles}
                                Icon={() => <View style={{ backgroundColor: "#f0f0f0", borderRadius: 20 }} ><MaterialIcons name="arrow-drop-down" size={24} color="#ccc"/></View>}
                                fixAndroidTouchableBug={true}
                            />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        marginVertical: 5,
    },
    filter: {
        marginVertical: 5,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    picker: {
        height: 50,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginVertical: 8,
    },
    pickerContainer: {
        width: "100%",
        height: 50,
    },
    filterButton: {
        width: "19%",
        height: 50,
    },    
});
