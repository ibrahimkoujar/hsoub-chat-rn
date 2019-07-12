import React from 'react';
import { Container, Content, List } from 'native-base';
import { HomeHeader, Contact } from '../components';
import { withChatContext } from '../context/ChatProvider';
import { Strings, Auth } from "../config";

class HomeScreen extends React.Component {


    constructor(props) {
        super(props);
        this.state = { search: "" };
        this._init();
    }

    /**
     * Init connection and user account.
     * @returns {Promise<void>}
     * @private
     */
    _init = async () => {
        let socket = await this.props.chat.connect();
        socket.on('error', this.onSocketError);
        // Handle socket.io errors.
        this.props.chat.loadUserAccount();
    };

    /**
     * On Socket Error
     * @param err
     */
    onSocketError = async err => {
        // If authentication error then logout.
        if(err === 'auth_error'){
            await Auth.logout();
            this.props.navigation.navigate('Login');
        }
    };

    onSearchChange = search => this.setState({search});

    onMenuClick = async () => {
        // await Auth.logout()
        this.props.navigation.navigate('EditProfile', { profile: this.props.chat.account });
    };

    onContactClick = (contact) => {
        this.props.chat.setCurrentContact(contact);
        this.props.navigation.navigate('Chat');
    };

    render() {
        return (
            <Container>
                <HomeHeader
                    title={Strings.TITLE_CONTACTS}
                    onMenuClick={this.onMenuClick}
                    onSearchChange={this.onSearchChange}
                />
                <Content>
                    <List>
                        { this.props.chat.contacts.map((contact, i) => this.renderContact(contact, i)) }
                    </List>
                </Content>
            </Container>
        );
    }

    renderContact(contact, i){
        if(!contact.name.includes(this.state.search)) return null;
        contact = this.setMessageAndCounter(contact);
        return (
            <Contact key={i}  contact={contact} onClick={this.onContactClick}/>
        );
    }

    setMessageAndCounter(contact){
        let messages = this.props.chat.messages.filter(
            e => e.sender === contact.id || e.receiver === contact.id
        );
        contact.lastMessage = messages[messages.length - 1];
        contact.counter = messages.filter(e => !e.seen && e.sender === contact.id).length;
        return contact
    }

}

export default withChatContext(HomeScreen)
