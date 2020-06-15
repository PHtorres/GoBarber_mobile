import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../hooks/Auth';

const Routes: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingView/>
    }

    return user ? <AppRoutes /> : <AuthRoutes />
}

const LoadingView: React.FC = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#999" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default Routes;