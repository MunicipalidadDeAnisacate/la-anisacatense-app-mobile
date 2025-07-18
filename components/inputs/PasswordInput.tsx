import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps, ViewStyle, TextStyle, Platform } from 'react-native';
import { Icon } from '@rneui/themed';

type PasswordInputProps = TextInputProps & {
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconStyle?: ViewStyle;
  placeholder?: string;
  eyeColor?: string;
  backgroundEyeColor?: string;
  maxLength?: number;
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
  containerStyle,
  inputStyle,
  iconStyle,
  placeholder,
  eyeColor="black",
  backgroundEyeColor="#FFF",
  maxLength,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TextInput
        {...rest}
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={!visible}
        autoCapitalize="none"
        maxLength={maxLength ? maxLength : undefined}
      />
      <TouchableOpacity
        style={[styles.iconContainer, iconStyle]}
        onPress={() => setVisible(!visible)}
        activeOpacity={0.7}
      >
        <Icon
          name={visible ? 'visibility' : 'visibility-off'}
          type="material"
          size={24}
          color={eyeColor}
          style={{backgroundColor: backgroundEyeColor, padding: 1.5, borderRadius:15}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    width: '100%',
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    top: Platform.OS === 'ios' ? 12 : 8,
  },
});
