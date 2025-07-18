import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent
} from '@react-native-community/datetimepicker';
import { Button } from '@rneui/themed/dist/Button';
import { principalColorVecino } from '@/constants/Colors';

type DatePickerInputProps = {
  date: Date | null;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  inputStyle?: object;
  textStyle?: object;
  buttonTitle?: string;
  mode?: string;
  buttonBackgroundColorByRol?: string;
};


function normalizeToMidnightLocal(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}


export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  date,
  onChange,
  maximumDate = new Date(),
  minimumDate,
  inputStyle,
  textStyle,
  buttonTitle = 'Seleccione fecha',
  mode = 'date',
  buttonBackgroundColorByRol = principalColorVecino
}) => {
  const [show, setShow] = useState(false);

  const handlePress = () => setShow(true);

  const handleChange = (
    event: DateTimePickerEvent,
    selected?: Date
  ) => {
    setShow(Platform.OS === 'ios');
    if (event.type === 'set' && selected) {
      let value = selected;
      if (mode === 'date') {
        value = normalizeToMidnightLocal(selected);
      }
      onChange(value);
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <TouchableOpacity
        style={[styles.inputBase, inputStyle]}
        activeOpacity={0.7}
        onPress={handlePress}
      >
        {(buttonTitle === "Seleccione fecha" || buttonTitle === "Fecha de Nacimiento") ?
          (<Text style={textStyle}>
            {buttonTitle}
          </Text>) :
          (<Text style={[textStyle, { color: "black" }]}>
            {buttonTitle}
          </Text>)
        }

      </TouchableOpacity>

      {show && Platform.OS !== "ios" && (
        <DateTimePicker
          value={date || new Date()}
          mode={mode as any}
          display={'spinner'}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleChange}
          locale="es-ES"
        />
      )
      }

      {show && Platform.OS === 'ios' &&
        (
          <Modal transparent animationType="fade" onRequestClose={() => setShow(false)}>
            <TouchableWithoutFeedback onPress={() => setShow(false)}>
              <View style={modalStyles.backdrop} />
            </TouchableWithoutFeedback>

            <View style={modalStyles.pickerBox}>
              <DateTimePicker
                value={date || new Date()}
                mode={mode as any}
                display="spinner"
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={handleChange}
                locale="es-ES"
                style={modalStyles.picker}

                textColor={Platform.OS === 'ios' ? 'black' : undefined}
                themeVariant="light"
              />
              <Button
                title="Aceptar"
                onPress={() => setShow(false)}
                buttonStyle={{ borderRadius: 8, backgroundColor: buttonBackgroundColorByRol }}
                titleStyle={{ color: "white" }}
                containerStyle={{ width: "60%", marginVertical: 15 }}
              />
            </View>
          </Modal>
        )}

    </View >
  );
};

const styles = StyleSheet.create({
  inputBase: {
    width: "100%",
    borderWidth: 1,
    borderColor: '#F0F1F3',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  pickerBox: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  picker: {
    width: '100%',            // o 300
    height: 200,              // ajusta según necesites
  },
});
