import React, { Component } from 'react';
import { Container, Icon } from 'native-base';
import { KeyboardAvoidingView } from "react-native";
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { ChatHeader } from '../components';
import { withChatContext } from '../context/ChatProvider';
import { Strings, Moment } from "../config";
import styles from "./styles/chat";

class ChatScreen extends Component {

    state = {
        message: "",
        lastType: false,
    };

    /**
     * componentWillUnmount When screen is going to close then remove the current contact.
     */
    componentWillUnmount() {
        this.props.chat.setCurrentContact({});
    }

    /**
     * On back button click.
     */
    onBackClick = () => this.props.navigation.goBack(null);


    /**
     * Back button click listener.
     */
    onProfileClick = () => this.props.navigation.navigate('Profile');

    /**
     * Message text change listener.
     */
    onMessageChange = message => {
        this.setState({message});
        if (!this.state.lastType || Moment() - this.state.lastType > 2000){
            this.setState({lastType: Moment()});
            this.props.chat.sendType();
        }
    };

    /**
     * Send message handler.
     */
    onSend = () => {
        let content = this.state.message.trim();
        if(!content) return;
        this.setState({lastType: false, message: ""});
        this.props.chat.sendMessage(content);
    };

    render() {
        let { contact, account } = this.props.chat;
        let status = this.props.chat.status();
        let messages = this.props.chat.messages.filter(
            e => e.sender === contact.id || e.receiver === contact.id
        );
        return (
            <Container>
                <ChatHeader
                    onBack={this.onBackClick}
                    onProfile={this.onProfileClick}
                    contact={contact}
                    status={status} />
                
                <GiftedChat
                    user={{_id: account.id}}
                    messages={messages.reverse()}
                    text={this.state.message}
                    renderInputToolbar={this.renderInputToolbar}
                    onInputTextChanged={this.onMessageChange}
                    renderAvatar={null} />

                <KeyboardAvoidingView behavior="padding" enabled />

            </Container>

        );
    }
 
    renderInputToolbar = props => {
        props.placeholder = Strings.WRITE_YOUR_MESSAGE;
        props.textInputStyle = styles.input;
        props.renderSend = this.renderSend;
        return <InputToolbar {...props} />;
    };

    renderSend = () => <Icon name='paper-plane' onPress={this.onSend} style={styles.send}/>;

}

export default withChatContext(ChatScreen);

