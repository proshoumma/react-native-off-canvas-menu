/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  Text,
  View,
  StatusBar
} from 'react-native'

import OffCanvas from './src/offcanvas'
import Menu1 from './src/menu1'
import Menu2 from './src/menu2'
import Menu3 from './src/menu3'
import Menu4 from './src/menu4'
import Menu5 from './src/menu5'
import Menu6 from './src/menu6'
import Menu7 from './src/menu7'

class OffCanvasMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false
    }
  }

  render() {
    const statusBar = this.state.menuOpen ?
      <StatusBar
        backgroundColor="#222222"
        animated={true}
      />
    : null

    return (
      <View style={{flex: 1}}>
        {statusBar}

        <OffCanvas
        active={this.state.menuOpen}
        onMenuPress={this._handleMenu.bind(this)}
        backgroundColor={'#222222'}
        menuItems={[
          {
            title: 'Menu 1',
            renderScene: <Menu1 handleMenu={this._handleMenu.bind(this)}/>
          },
          {
            title: 'Menu 2',
            renderScene: <Menu2 handleMenu={this._handleMenu.bind(this)}/>
          },
          {
            title: 'Menu 3',
            renderScene: <Menu3 handleMenu={this._handleMenu.bind(this)}/>
          },
          {
            title: 'Menu 4',
            renderScene: <Menu4 handleMenu={this._handleMenu.bind(this)}/>
          },
          {
            title: 'Menu 5',
            renderScene: <Menu5 handleMenu={this._handleMenu.bind(this)}/>
          },
          {
            title: 'Menu 6',
            renderScene: <Menu6 handleMenu={this._handleMenu.bind(this)}/>
          },
          {
            title: 'Menu 7',
            renderScene: <Menu7 handleMenu={this._handleMenu.bind(this)}/>
          }
        ]}
        >
        </OffCanvas>
      </View>
    )
  }

  _handleMenu() {
    const {menuOpen} = this.state
    this.setState({
      menuOpen: !menuOpen
    })
  }
}

AppRegistry.registerComponent('OffCanvasMenu', () => OffCanvasMenu)
