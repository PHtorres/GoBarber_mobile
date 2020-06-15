import React, { useRef, useCallback } from 'react';
import { View, Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Logo from '../../assets/logo.png';

import { useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import {useAuth} from '../../hooks/Auth';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {

  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const {signIn} = useAuth();

  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
            email: Yup.string().required('O e-mail é obrigatório').email('Digite um e-mail válido'),
            password: Yup.string().required('A senha é obrigatória')
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        await signIn({
            email: data.email,
            password: data.password
        });

    } catch (error) {

        if (error instanceof Yup.ValidationError) {
            const errors = getValidationErrors(error);
            formRef.current?.setErrors(errors);
        } else {
          Alert.alert('Erro na autenticação', 'Verifique suas credenciais');
        }
    }

}, [signIn]);

  const submitForm = () => {
    formRef.current?.submitForm();
  }

  const focusPasswordInput = () => {
    passwordInputRef.current?.focus();
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
            <Image source={Logo} />
            <View>
              <Title>Faça seu logon</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                name="email"
                icon="mail"
                placeholder="E-Mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={focusPasswordInput}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={submitForm}
              />
              <Button onPress={submitForm}>Entrar</Button>
            </Form>
            <ForgotPassword onPress={() => { }}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  )
}

export default SignIn;