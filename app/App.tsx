import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { RootStackParamList } from './src/navigation';
import { DeviceScreen } from './src/screens/DeviceScreen';
import { DevicesScreen } from './src/screens/DevicesScreen';
import { useDevices } from './src/store/devices';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen
          name="Devices"
          component={DevicesScreen}
          options={{ title: 'Dispositivos' }}
        />
        <Stack.Screen
          name="Device"
          component={DeviceScreen}
          options={({ route }) => ({
            title: useDevices.getState().devices[route.params.deviceId]?.name ?? 'Dispositivo',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
