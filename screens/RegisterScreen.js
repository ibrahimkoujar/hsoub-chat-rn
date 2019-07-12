import React, { Component } from 'react';
import { Image, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Input, Item, Button, Text, Toast, View, Icon  } from 'native-base';
import {Auth, Axios, Strings, Urls} from "../config";
import styles from "./styles/auth";
import companyLogo from "../assets/images/logo.png";

export default class Login extends Component {

    state= {
        name: "",
        username: "",
        password: "",
        isLoading: false,
    };

    onNameChange = name => this.setState({ name });

    onUsernameChange = username => this.setState({ username });

    onPasswordChange = password => this.setState({ password });

    backToLogin = () => this.props.navigation.goBack(null);

    validate() {
        Keyboard.dismiss();
        if (!this.state.name) {
            Toast.show({text: Strings.NAME_REQUIRED, type: 'danger' });
            return false;
        }
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

    register = async () => {
        if (!this.validate()) return;
        let data = {
            name: this.state.name, username: this.state.username, password: this.state.password
        };
        try {
            const response = await Axios.post(Urls.REGISTER, data);
            this.setState({ name: "", email: "", password: "" });
            Auth.setUser(response.data);
            this.props.navigation.navigate('Home');
        } catch (e) {
            alert(e.toString());
            Toast.show({text: e.response.data.message, type: 'danger' });
        }
    };

    render() {
        return (
            <Container>
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <Content>
                        <View style={styles.logoContainer}>
                            <Image style={styles.logo} source={companyLogo} resizeMode="contain"/>
                        </View>
                        <View style={styles.form}>
                            <Text style={styles.title}>{Strings.TITLE_CREATE_NEW_ACCOUNT}</Text>
                            <Item rounded style={styles.inputItem}>
                                <Input
                                    style={styles.input}
                                    placeholder={Strings.NAME_PLACEHOLDER}
                                    onChangeText={this.onNameChange}
                                />
                                <Icon name='person' style={styles.icon}/>
                            </Item>
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
                            <Button rounded info block style={styles.button} onPress={this.register}>
                                <Text>{Strings.SEND}</Text>
                            </Button>
                            <Button rounded bordered dark block style={styles.button} onPress={this.backToLogin}>
                                <Text>{Strings.BACK_TO_LOGIN}</Text>
                            </Button>
                        </View>
                    </Content>
                </KeyboardAvoidingView>
            </Container>
        )
    }
}


