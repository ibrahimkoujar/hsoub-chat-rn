import React from 'react';
import io from "socket.io-client";
import { Moment, Strings, Auth, Urls } from "../config";

const ChatContext = React.createContext({
    connected: false,
    connect: () => {},
    status: () => {},
    loadUserAccount: () => {}
});

export class ChatProvider extends React.Component {

    /**
     * Connect to SocketIO Server
     */
    connect = async () => {
        let token = await Auth.getToken();
        let socket = io(Urls.SOCKET, {query: 'token=' + token});
        // Handle user connected event.
        socket.on('connect', () => this.setState({connected: true}));
        // Handle user disconnected event.
        socket.on('disconnect', () => this.setState({connected: false}));
        // Handle user data event (after connection).
        socket.on('data', this.onData);
        // Handle new user event.
        socket.on('new_user', this.onNewUser);
        // Handle update user event.
        socket.on('update_user', this.onUpdateUser);
        // Handle incoming message event.
        socket.on('message', this.onNewMessage);
        // Handle changes for user presence.
        socket.on('user_status', this.updateUsersState);
        // Handle typing or composing event.
        socket.on('typing', this.onTypingMessage);
        // Set user socket as state variable.
        this.setState({socket});
        return socket;
    };

    /**
     * Load user account from async storage.
     */
    loadUserAccount = async () =>  {
        let account = await Auth.getUser();
        this.setState({ account });
    };

    /**
     * @param contact
     */
    setCurrentContact = contact => this.setState({contact});

    /**
     * Send message.
     * @param content
     */
    sendMessage = content => {
        
        if(!this.state.contact.id) return;
        
        let message = {
            content: content,
            sender: this.state.account.id,
            receiver: this.state.contact.id,
            date: new Date().getTime()
        };

        message = this.formatMessage(message);
        let messages = this.state.messages.concat(message);
        this.setState({messages});
        
        this.state.socket.emit('message', message);
    };

    /**
     * Send typing(composing) message.
     */
    sendType = () => this.state.socket.emit('typing', this.state.contact.id);

    status = () => {
        let status = this.state.contact.status; 
        if(this.state.typing) return Strings.WRITING_NOW;
        if(status === true) return Strings.ONLINE;
        if(status) return Moment(status).fromNow();
    };

    state = {
        contacts: [],
        messages: [],
        contact: {},
        account: null,
        profile: false,
        connected: false,
        connect: this.connect,
        loadUserAccount: this.loadUserAccount,
        status: this.status,
        setCurrentContact: this.setCurrentContact,
        sendMessage: this.sendMessage,
        sendType: this.sendType,
        socket: null,
    };

    render() {
        return (
            <ChatContext.Provider value={this.state}>
                {this.props.children}
            </ChatContext.Provider>
        );
    }

    /*EVENTS*********************************************************************/

    /**
     * Handle user data event (after connection).
     * @param user
     * @param contacts
     * @param messages
     * @param users
     */
    onData = (user, contacts, messages, users) => {
        let contact = contacts[0] || {};
        messages = messages.map(this.formatMessage);
        this.setState({messages, contacts, user, contact}, () => {
            this.updateUsersState(users);
        });
    };

    /**
     * Handle new user event.
     * @param user
     */
    onNewUser = user => {
        // Add user to contacts list.
        let contacts = this.state.contacts.concat(user);
        this.setState({contacts});
    };

    /**
     * Handle update user event.
     * @param user
     */
    onUpdateUser = async user => {
        // Add updated user is the current user then update local storage data.
        if (this.state.account.id === user.id) {
            this.setState({account: user});
            await Auth.updateProfile(user);
            return;
        }
        // Update contact data.
        let contacts = this.state.contacts;
        contacts.forEach((element, index) => {
            if(element.id === user.id) {
                contacts[index] = user;
                contacts[index].status = element.status;
            }
        });
        this.setState({contacts});
        if (this.state.contact.id === user.id) this.setState({contact: user});
    };

    /**
     * Handle incoming message event.
     * @param message
     */
    onNewMessage = message => {
        // If user is already in chat then mark the message as seen.
        if(message.sender === this.state.contact.id){
            this.setState({typing: false});
            this.state.socket.emit('seen', this.state.contact.id);
            message.seen = true;
        }
        // Add message to messages list.
        let messages = this.state.messages.concat(this.formatMessage(message));
        this.setState({messages});
    };

    /**
     * Handle typing or composing event.
     * @param sender
     */
    onTypingMessage = sender => {
        // If the typer not the current chat user then ignore it.
        if(this.state.contact.id !== sender) return;
        // Set typer.
        this.setState({typing: sender});
        // Create timeout function to remove typing status after 3 seconds.
        clearTimeout(this.state.timeout);
        const timeout = setTimeout(this.typingTimeout, 3000);
        this.setState({timeout});
    };

    /**
     * Clear typing status.
     */
    typingTimeout = () => this.setState({typing: false});

    /**
     * update users statuses.
     * @param users
     */
    updateUsersState = users => {
        let contacts = this.state.contacts;
        contacts.forEach((element, index) => {
            if(users[element.id]) contacts[index].status = users[element.id];
        });
        this.setState({contacts});
        let contact = this.state.contact;
        if(users[contact.id]) contact.status = users[contact.id];
        this.setState({contact});
    };

    formatMessage = message => {
        message._id = message._id || message.date;
        message.text = message.content;
        message.createdAt = message.date;
        message.user = { _id: message.sender };
        return message;
    }

}

export function withChatContext(Component) {
    class ComponentWithChat extends React.Component {
        static displayName = `${Component.displayName || Component.name}`;
        render() {
            return (
                <ChatContext.Consumer>
                    { chat => <Component {...this.props} chat={chat} ref={this.props.onRef} /> }
                </ChatContext.Consumer>
            );
        }
    }

    return ComponentWithChat;
}