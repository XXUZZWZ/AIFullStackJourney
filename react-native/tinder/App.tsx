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

import {
  Home,
  Matches
}from './screens';
// 浏览器访问栈
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
              tabBarOptions = {{
                showLabel: false,
                activeTintColor: '#123',
                inactiveTintColor: '#456',
                labelStyle: {
                  fontSize: 14,
                  textTransform: 'uppercase',
                  paddingTop: 10
                },
                style: {
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
             option = {{
              tabBarIcon:({focused}) =>(
                <TabBarIcon
                focused={focused}
                iconName="search"
                text = "Expore"
                />

              )
             }}
            />
                <Tab.Screen 
             name='MMMM'
             component={Home}
             option = {{
              tabBarIcon:({focused}) =>(
                <TabBarIcon
                focused={focused}
                iconName="search"
                text = "Expore"
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