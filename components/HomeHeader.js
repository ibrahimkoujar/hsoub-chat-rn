import React from "react";
import {Header, Body, Title, View, Right, Button, Icon, Left, Item, Input } from "native-base";
import { StyleSheet } from 'react-native'
import Constants from 'expo-constants';
import {Colors, Strings} from "../config";

class HomeHeader extends React.Component {

    state = { isSearch: false };

    onSearchClose = () => {
        this.setState({isSearch: false});
        this.props.onSearchChange("");
    };

    renderHeader(){
        const { title } = this.props;
        if(this.state.isSearch){
            return (
                <Header searchBar rounded style={styles.header}>
                    <Item>
                        <Icon name="close" onPress={this.onSearchClose}/>
                        <Input placeholder={Strings.SEARCH} onChangeText={this.props.onSearchChange}/>
                        <Icon name="search"/>
                    </Item>
                </Header>
            )
        }
        return (
            <Header style={styles.header}>
                <Left style={{flex: 1}}>
                    <Button transparent onPress={this.props.onMenuClick}>
                        <Icon name='menu'/>
                    </Button>
                </Left>
                <Body style={{flex: 1}}>
                <Title style={{alignSelf: "center"}}>{title}</Title>
                </Body>
                <Right style={{flex: 1}}>
                    <Button transparent onPress={() => this.setState({isSearch: true})}>
                        <Icon name='search'/>
                    </Button>
                </Right>
            </Header>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
            </View>
        );
    }
}
export default HomeHeader

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.GRAY,
    },
    header: {
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: Colors.GRAY,
        marginTop: Constants.statusBarHeight,
    },
});

