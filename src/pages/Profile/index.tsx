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

import api from '../../services/api';

import {
    Container,
    Title,
    UserAvatarButton,
    UserAvatar,
    BackButton
} from './styles';
import { useAuth } from '../../hooks/Auth';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const Profile: React.FC = () => {

    const { user } = useAuth();
    const formRef = useRef<FormHandles>(null);
    const navigation = useNavigation();

    const handleSignUp = useCallback(async (data: SignUpFormData) => {

        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('O nome é obrigatório'),
                email: Yup.string().required('O e-mail é obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'Digite pelo menos 6 caracteres')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await api.post('users', data);

            Alert.alert('Cadastro realizado com sucesso!', 'Você já pode fazer login no GoBarner');

            navigation.goBack();

        } catch (error) {

            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
                return;
            }

            Alert.alert('Erro no cadastro', 'Tente novamente mais tarde');

        }

    }, [navigation]);

    const submitForm = () => {
        formRef.current?.submitForm();
    }

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, []);

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
                            <Icon name="chevron-left" size={24} color="#999591"/>
                        </BackButton>
                        <UserAvatarButton onPress={() => { }}>
                            <UserAvatar source={{ uri: user.avatar_url }} />
                        </UserAvatarButton>
                        <View>
                            <Title>Meu Perfil</Title>
                        </View>
                        <Form ref={formRef} onSubmit={handleSignUp}>
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