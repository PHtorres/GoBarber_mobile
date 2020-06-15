import React from 'react';
import { View, Text, Button } from 'react-native';

import { useAuth } from '../../hooks/Auth';

const Dashboard: React.FC = () => {

    const { signOut } = useAuth();

    return (
        <View>
            <Text>
                Dashboard
            </Text>
            <Button title="Sair" onPress={signOut}/>
        </View>
    )
}

export default Dashboard;