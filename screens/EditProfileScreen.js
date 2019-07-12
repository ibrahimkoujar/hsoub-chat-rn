import React, { Component } from 'react';

import { Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Container, Content, Input, Item, Button, Text, Toast, View, Form, Label } from 'native-base';
import {Strings, Axios, Auth, Urls} from "../config";
import { Header, Avatar } from "../components";
import styles from "./styles/editProfile";
import { withChatContext } from "../context/ChatProvider";
import * as ImagePicker from 'expo-image-picker';

class EditProfileScreen extends Component {

    constructor(props) {
        super(props);
        const { navigation } = props;
        let user = navigation.getParam('profile', {});
        this.state = {
            name: user.name,
            about: user.about,
            avatar: user.avatar
        };
    }

    componentDidMount() {
        this.handleChoosePhoto();
    }

    handleChoosePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });
        if (!result.cancelled) {
            this.setState({ avatar: result })
        }
    };

    onNameChange = name => this.setState({ name });

    onAboutChange = about => this.setState({ about });

    navToPassword = () => this.props.navigation.navigate('Password');

    logout = async () => {
        this.props.chat.socket.disconnect();
        await Auth.logout();
        this.props.navigation.navigate('Login')
    };

    validate() {
        Keyboard.dismiss();
        if (!this.state.name) {
            Toast.show({text: Strings.NAME_REQUIRED, type: 'danger' });
            return false;
        }
        if (!this.state.about) {
            Toast.show({text: Strings.ABOUT_REQUIRED, type: 'danger' });
            return false;
        }
        return true;
    }

    send = async () => {
        if (!this.validate()) return;

        let { name, about, avatar } = this.state;

        const data = new FormData();
        data.append('name', name);
        data.append('about', about);
        if (avatar.isObject){
            let fileType = avatar.uri.split('.').pop();
            data.append('avatar', {
                uri: avatar.uri,
                name: `avatar.${fileType}`,
                type: `image/${fileType}`,
            });
        }
        try {
            Axios.defaults.headers.common.Authorization = await Auth.getToken();
            await Axios.post(Urls.UPDATE_PROFILE, data);
            this.setState({password: "", newPassword: "" });
            Toast.show({text: Strings.PROFILE_UPDATED, type: 'success' });
        } catch (e) {
            Toast.show({text: e.response.data.message, type: 'danger' });
        }
    };

    render() {
        return (
            <Container>
                <Header title={Strings.TITLE_MY_ACCOUNT} />
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <Content>
                        <View style={styles.avatarContainer}>
                            <TouchableOpacity onPress={this.handleChoosePhoto}>
                                <Avatar type='profile' source={this.state.avatar ? this.state.avatar.uri : null} isLocal />
                            </TouchableOpacity>
                        </View>
                        <Form style={styles.form}>
                            <Item style={styles.inputItem} floatingLabel>
                                <Label>{Strings.NAME_PLACEHOLDER}</Label>
                                <Input
                                    style={styles.input}
                                    value={this.state.name}
                                    onChangeText={this.onNameChange}
                                />
                            </Item>
                            <Item style={styles.inputItem} floatingLabel>
                                <Label>{Strings.ABOUT_PLACEHOLDER}</Label>
                                <Input
                                    style={styles.input}
                                    value={this.state.about}
                                    onChangeText={this.onAboutChange}
                                />
                            </Item>
                            <Button rounded info block style={styles.button} onPress={this.send}>
                                <Text>{Strings.SAVE}</Text>
                            </Button>
                            <Button rounded bordered dark block style={styles.button} onPress={this.navToPassword}>
                                <Text>{Strings.CHANGE_PASSWORD}</Text>
                            </Button>
                            <Button rounded bordered dark block style={styles.button} onPress={this.logout}>
                                <Text>{Strings.LOGOUT}</Text>
                            </Button>
                        </Form>
                    </Content>
                </KeyboardAvoidingView>
            </Container>
        )
    }
}

export default withChatContext(EditProfileScreen)