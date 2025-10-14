import React from 'react';
import {
  NavigationContainer
} from '@react-navigation/native';
import {
  createStackNavigator
} from '@react-navigation/stack';
import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import {
  Home,
  Matches,
  Profile
}from './screens';
import TabBarIcon from './components/TabBarIcon';
//  和 浏览器访问栈类似的东西
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); // 底部tab导航

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Tab" 
          options={{headerShown: false, animationEnabled: false}}
        >
        {
          () => (
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: '#fff',
                  borderTopWidth: 0,
                  marginBottom: 0,
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: {height:0, width:0}
                }
              }}
            >
            <Tab.Screen
             name='Explore'
             component={Home}
             options={{
              tabBarIcon:({focused}) =>(
                <TabBarIcon
                focused={focused}
                iconName="search"
                text="Explore"
                />
              )
             }}
            />
            <Tab.Screen
             name='Matches'
             component={Matches}
             options={{
              tabBarIcon:({focused}) =>(
                <TabBarIcon
                focused={focused}
                iconName="heart"
                text="Matches"
                />
              )
             }}
            />
            <Tab.Screen
             name='Profile'
             component={Profile}
             options={{
              tabBarIcon:({focused}) =>(
                <TabBarIcon
                focused={focused}
                iconName="person"
                text="Profile"
                />
              )
             }}
            />
            </Tab.Navigator>
          )
        }
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}