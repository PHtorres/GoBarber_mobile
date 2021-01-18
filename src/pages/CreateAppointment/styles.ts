import styled from 'styled-components/native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import { Platform } from 'react-native';

const ios = Platform.OS === 'ios';

export const Container = styled.View`
  flex:1;
`;


export const Header = styled.View`
padding: 24px;
padding-top: ${ios?getStatusBarHeight() + 24:24}px;
background: #28262e;
flex-direction:row;
justify-content:space-between;
align-items:center;
`;

export const BackButton = styled.TouchableOpacity`

`;

export const HeaderTitle = styled.Text`
color: #F5EDE8;
font-family:'RobotoSlab-Medium';
font-size:20px;
margin-left: 16px;
`;



export const UserAvatar = styled.Image`
width: 56px;
height:56px;
border-radius:28px;
margin-left:auto;
`;