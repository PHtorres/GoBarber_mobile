import React, { useCallback, useEffect, useState } from 'react';
import {
    Container,
    Header,
    HeaderTitle,
    UserName,
    ProfileButton,
    UserAvatar,
    ProvidersList,
    ProviderListTitle,
    ProviderContainer,
    ProviderAvatar,
    ProviderInfo,
    ProviderName,
    ProviderMeta,
    ProviderMetaText
} from './styles';

import { useAuth } from '../../hooks/Auth';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import FeatherIcons from 'react-native-vector-icons/Feather';

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

const Dashboard: React.FC = () => {

    const [providers, setProviders] = useState<Provider[]>([]);
    const { signOut, user } = useAuth();
    const { navigate } = useNavigation();


    useEffect(() => {
        api.get<Provider[]>('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    const navigateToProfile = useCallback(() => {
        navigate('Profile');
        signOut();
    }, [navigate, signOut]);

    const navigateToCreateAppointment = useCallback((providerId:string) => {
        navigate('CreateAppointment', {providerId});
    }, [navigate]);

    return (
        <Container>
            <Header>
                <HeaderTitle>
                    Bem-vindo, {'\n'}
                    <UserName>{user.name}</UserName>
                </HeaderTitle>
                <ProfileButton onPress={navigateToProfile}>
                    <UserAvatar source={{ uri: user.avatar_url }} />
                </ProfileButton>
            </Header>
            <ProvidersList
                data={providers}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                    <ProviderListTitle>Nenhum cabeleireiro encontrado.</ProviderListTitle>
                }
                ListHeaderComponent={
                    <ProviderListTitle>Cabeleireiros</ProviderListTitle>
                }
                renderItem={({ item }) => (
                    <ProviderContainer onPress={()=> navigateToCreateAppointment(item.id)}>
                        <ProviderAvatar source={{ uri: item.avatar_url }} />
                        <ProviderInfo>
                            <ProviderName>{item.name}</ProviderName>
                            <ProviderMeta>
                                <FeatherIcons name="calendar" size={14} color="#ff9000" />
                                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
                            </ProviderMeta>
                            <ProviderMeta>
                                <FeatherIcons name="clock" size={14} color="#ff9000" />
                                <ProviderMetaText>8h às 18h</ProviderMetaText>
                            </ProviderMeta>
                        </ProviderInfo>
                    </ProviderContainer>
                )}
            />
        </Container>
    )
}

export default Dashboard;