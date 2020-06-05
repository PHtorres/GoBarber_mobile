import React from 'react';
import { View, Image } from 'react-native';
import { Container, Title } from './styles';

import Logo from '../../assets/logo.png';

const SignIn: React.FC = () => {
  return (
      <Container>
          <Image source={Logo}/>
          <Title>Faça seu logon</Title>
      </Container>
  )
}

export default SignIn;