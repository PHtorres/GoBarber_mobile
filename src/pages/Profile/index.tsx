import React, { useCallback, useRef } from 'react';
import { View, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import api from '../../services/api';

import {
    Container,
    Title,
    UserAvatarButton,
    UserAvatar,
    BackButton
} from './styles';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {

    const { user, updateUser } = useAuth();
    const formRef = useRef<FormHandles>(null);
    const navigation = useNavigation();

    const handleUpdateProfile = useCallback(async (data: ProfileFormData) => {

        try {

            formRef.current?.setErrors({});

            const formData = Object.assign({
                name: data.name,
                email: data.email
            }, data.old_password ? {
                old_password: data.old_password,
                password: data.password,
                password_confirmation: data.password_confirmation
            } : {});

            const response = await api.put('profile', formData);

            updateUser(response.data);

            Alert.alert('Perfil atualizado com sucesso!', '');

            navigation.goBack();

        } catch (error) {

            Alert.alert('Erro na atualização do perfil', 'Tente novamente mais tarde');

        }

    }, [navigation]);

    const submitForm = () => {
        formRef.current?.submitForm();
    }

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, []);

    const handleUpdateAvatar = useCallback(async () => {

        launchCamera({
            mediaType: 'photo',
        }, response => {
            if (response.didCancel) {
                return;
            }

            if (response.errorCode) {
                Alert.alert('Erro ao pegar imagem', response.errorMessage);
                return;
            }

            uploadAvatarImage(response.uri || '');
        });

    }, [updateUser, user]);

    const uploadAvatarImage = async (uriImage:string) =>{
        const data = new FormData();
        data.append('avatar', {
            type: 'image/jpeg',
            name: `${user.id}.jpg`,
            uri: uriImage
        });

        debugger
        const apiresponse = await api.patch('users/avatar', data);
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    style={{ flex: 1 }}
                    alwaysBounceVertical
                >
                    <Container>
                        <BackButton onPress={handleGoBack}>
                            <Icon name="chevron-left" size={24} color="#999591" />
                        </BackButton>
                        <UserAvatarButton onPress={handleUpdateAvatar}>
                            <UserAvatar source={{ uri: user.avatar_url }} />
                        </UserAvatarButton>
                        <View>
                            <Title>Meu Perfil</Title>
                        </View>
                        <Form
                            initialData={{ name: user.name, email: user.email }}
                            ref={formRef}
                            onSubmit={handleUpdateProfile}>
                            <Input
                                autoCapitalize="words"
                                name="name"
                                icon="user"
                                placeholder="Nome"
                            />
                            <Input
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                name="email"
                                icon="mail"
                                placeholder="E-Mail"
                            />
                            <Input
                                secureTextEntry
                                textContentType="newPassword"
                                name="old_password"
                                icon="lock"
                                placeholder="Senha atual"
                                returnKeyType="send"
                                onSubmitEditing={submitForm}
                            />
                            <Input
                                secureTextEntry
                                textContentType="newPassword"
                                name="password"
                                icon="lock"
                                placeholder="Nova Senha"
                                returnKeyType="send"
                                onSubmitEditing={submitForm}
                            />
                            <Input
                                secureTextEntry
                                textContentType="newPassword"
                                name="password_confirmation"
                                icon="lock"
                                placeholder="Confirmar Senha"
                                returnKeyType="send"
                                onSubmitEditing={submitForm}
                            />
                            <Button onPress={submitForm}>Confirmar mudanças</Button>
                        </Form>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

export default Profile;