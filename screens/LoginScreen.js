import React, { Component } from 'react';
import { Image, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Input, Item, Button, Text, Toast, View, Icon  } from 'native-base';
import { Strings, Axios, Auth, Urls } from "../config";
import styles from "./styles/auth";
import companyLogo from "../assets/images/logo.png";
import { Loader } from '../components';

export default class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            isLoading: true,
        };
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const authenticated = await Auth.auth();
        if(authenticated){
            this.props.navigation.navigate('Home');
        } else {
            this.setState({ isLoading: false });
        }
    };
    
    onUsernameChange = username => this.setState({ username });

    onPasswordChange = password => this.setState({ password });

    navToRegister = () => {
        const {navigate} = this.props.navigation;
        navigate('Register');
    };

    validate() {
        Keyboard.dismiss();
        if (!this.state.username) {
            Toast.show({text: Strings.USERNAME_REQUIRED, type: 'danger' });
            return false;
        }
        if (!this.state.password) {
            Toast.show({text: Strings.PASSWORD_REQUIRED, type: 'danger' });
            return false;
        }
        return true;
    }

    login = async () => {
        if (!this.validate()) return;
         let data = {
            username: this.state.username, password: this.state.password
        };
        try {
            const response = await Axios.post(Urls.AUTH, data);
            this.setState({ email: "", password: "", isLoading: false });
            Auth.setUser(response.data);
            this.props.navigation.navigate('Home');
        } catch (e) {
            Toast.show({text: e.response.data.message, type: 'danger' });
        }
    };

    render() {
        return (
            <Container>
                <Loader title={Strings.PLEASE_WAIT} loading={this.state.isLoading} />
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <Content>
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={companyLogo} resizeMode="contain"/>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.title}>{Strings.LOGIN}</Text>
                        <Item rounded style={styles.inputItem}>
                            <Input
                                style={styles.input}
                                placeholder={Strings.USERNAME_PLACEHOLDER}
                                onChangeText={this.onUsernameChange}
                            />
                            <Icon name='person' style={styles.icon}/>
                        </Item>
                        <Item rounded style={styles.inputItem}>
                            <Input
                                style={styles.input}
                                placeholder={Strings.PASSWORD_PLACEHOLDER}
                                secureTextEntry={true}
                                onChangeText={this.onPasswordChange}
                            />
                            <Icon name='lock' style={styles.icon}/>
                        </Item>
                        <Button rounded info block style={styles.button} onPress={this.login}>
                            <Text>{Strings.LOGIN}</Text>
                        </Button>
                        <Button rounded bordered dark block style={styles.button} onPress={this.navToRegister}>
                            <Text>{Strings.CREATE_NEW_ACCOUNT}</Text>
                        </Button>
                    </View>
                </Content>
                </KeyboardAvoidingView>
            </Container>
        )
    }
}


