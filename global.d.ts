import 'react-native';

declare module 'react-native' {
  interface TextProps {
    allowFontScaling?: boolean;
  }
  interface TextInputProps {
    allowFontScaling?: boolean;
  }
}
