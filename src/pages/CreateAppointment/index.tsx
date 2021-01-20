import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker, { AndroidEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../hooks/Auth';
import {
    Container,
    Header,
    BackButton,
    HeaderTitle,
    UserAvatar,
    Content,
    ProvidersListContainer,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    Title,
    OpenDatePickerButton,
    OpenDatePickerButtonText,
    Schedule,
    Section,
    SectionContent,
    SectionTitile,
    Hour,
    HourText,
    CreateAppointmentButton,
    CreateAppointmentButtonText
}
    from './styles';
import { Alert, Platform } from 'react-native';

interface RouteParams {
    providerId: string;
}

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

interface AvailabilityItem {
    hour: number;
    available: boolean;
}

const CreateAppointment: React.FC = () => {

    const { user } = useAuth();
    const route = useRoute();
    const { providerId } = route.params as RouteParams;
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState(providerId);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState<number>(0);
    const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

    const { goBack, navigate } = useNavigation();

    const navigateBack = useCallback(() => {
        goBack();
    }, []);

    useEffect(() => {
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    const handleSelectProvider = useCallback((providerIdToSelect: string) => {
        setSelectedProvider(providerIdToSelect);
    }, []);

    const handleToggleDatePicker = useCallback(() => {
        setShowDatePicker(!showDatePicker);
    }, [showDatePicker]);

    const handleDateChanged = useCallback((event: any, date: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (date) {
            setSelectedDate(date);
        }

    }, []);


    useEffect(() => {
        api.get(`providers/${selectedProvider}/day-availability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            }
        }).then(response => {
            setAvailability(response.data);
        })
    }, [selectedDate, selectedProvider]);

    const morningAvailability = useMemo(() => {
        return availability.filter(item => item.hour < 12).map(({ hour, available }) => {
            return {
                hour,
                available,
                hourFormatted: format(new Date().setHours(hour), 'HH:00')
            }
        });
    }, [availability]);

    const afternoonAvailability = useMemo(() => {
        return availability.filter(item => item.hour >= 12).map(({ hour, available }) => {
            return {
                hour,
                available,
                hourFormatted: format(new Date().setHours(hour), 'HH:00')
            }
        });
    }, [availability]);

    const handleSelectHour = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, []);


    const handleCreateAppointment = useCallback(async () => {
        try {
            const date = new Date(selectedDate);
            date.setHours(selectedHour);
            date.setMinutes(0);
            await api.post('appointments', {
                provider_id: selectedProvider,
                date
            });

            navigate('AppointmentCreated', { date: date.getTime() });

        } catch (err) {
            Alert.alert('Ops...', 'Erro ao tentar criar agendamento');
        }
    }, [selectedDate, selectedHour, selectedProvider, navigate]);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>
                <HeaderTitle>Cabeleireiros</HeaderTitle>
                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>
            <Content>
                <ProvidersListContainer>
                    <ProvidersList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={providers}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <ProviderContainer
                                onPress={() => handleSelectProvider(item.id)}
                                selected={selectedProvider === item.id}>
                                <ProviderAvatar source={{ uri: item.avatar_url }} />
                                <ProviderName selected={selectedProvider === item.id}>
                                    {item.name}
                                </ProviderName>
                            </ProviderContainer>
                        )}
                    />
                </ProvidersListContainer>
                <Calendar>
                    <Title>Escolha a data</Title>
                    <OpenDatePickerButton onPress={handleToggleDatePicker}>
                        <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
                    </OpenDatePickerButton>
                    {showDatePicker &&
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            onChange={handleDateChanged}
                            display="calendar" />}
                </Calendar>

                <Schedule>
                    <Title>Escolha o horário</Title>
                    <Section>
                        <SectionTitile>Manhã</SectionTitile>
                        <SectionContent>
                            {morningAvailability.map(item => (
                                <Hour
                                    available={item.available}
                                    key={item.hour}
                                    onPress={() => handleSelectHour(item.hour)}
                                    enabled={item.available}
                                    selected={item.hour === selectedHour}>
                                    <HourText selected={item.hour === selectedHour}>
                                        {item.hourFormatted}
                                    </HourText>
                                </Hour>
                            ))}
                        </SectionContent>
                    </Section>
                    <Section>
                        <SectionTitile>Tarde</SectionTitile>
                        <SectionContent>
                            {afternoonAvailability.map(item => (
                                <Hour
                                    available={item.available}
                                    key={item.hour}
                                    onPress={() => handleSelectHour(item.hour)}
                                    enabled={item.available}
                                    selected={item.hour === selectedHour}>
                                    <HourText selected={item.hour === selectedHour}>
                                        {item.hourFormatted}
                                    </HourText>
                                </Hour>
                            ))}
                        </SectionContent>
                    </Section>
                </Schedule>
                <CreateAppointmentButton onPress={handleCreateAppointment}>
                    <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
                </CreateAppointmentButton>
            </Content>
        </Container>
    )
}

export default CreateAppointment;