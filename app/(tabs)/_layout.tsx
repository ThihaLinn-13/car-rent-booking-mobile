import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'green',

        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />

            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    headerShown: false,

                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="map-marker" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,

                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="user-circle-o" color={color} />,
                }}
            />

        </Tabs>
    );
}
