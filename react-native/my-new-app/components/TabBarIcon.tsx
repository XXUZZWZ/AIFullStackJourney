import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TabBarIconProps {
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  text: string;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ focused, iconName, text }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons
        name={iconName}
        size={24}
        color={focused ? '#123' : '#456'}
      />
      <Text
        style={{
          fontSize: 12,
          color: focused ? '#123' : '#456',
          marginTop: 4
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default TabBarIcon;