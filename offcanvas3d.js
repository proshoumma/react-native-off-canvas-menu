import React, { Component } from 'react'
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  BackAndroid
} from 'react-native'

class OffCanvas3D extends Component {
  constructor(props) {
    super(props)

    this._hardwareBackHandler = this._hardwareBackHandler.bind(this)

    this.state = {
      activityLeftPos : new Animated.Value(0),
      scaleSize : new Animated.Value(1.0),
      rotate: new Animated.Value(0),
      animationDuration: 400,
      stagArr: [],
      animatedStagArr: [],
      menuItems: this.props.menuItems,
      activeMenu: 0
    }
  }

  // staggered animation configuration for menu items
  componentDidMount() {
    let stagArrNew = []
    for (let i = 0; i < this.state.menuItems.length; i++) stagArrNew.push(i)
    this.setState({ stagArr: stagArrNew })

    let animatedStagArrNew = []
    stagArrNew.forEach((value) => {
      animatedStagArrNew[value] = new Animated.Value(0)
    })
    this.setState({ animatedStagArr: animatedStagArrNew })
  }

  // any update to component will fire the animation
  componentDidUpdate() {
    this._animateStuffs()

    if(this.props.handleBackPress && this.props.active) {
      BackAndroid.addEventListener('hardwareBackPress', this._hardwareBackHandler)
    }

    if(this.props.handleBackPress && !this.props.active) {
      BackAndroid.removeEventListener('hardwareBackPress', this._hardwareBackHandler)
    }
  }

  render() {
    const rotateVal = this.state.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-10deg']
    })

    const staggeredAnimatedMenus = this.state.stagArr.map((index) => {
      return (
        <TouchableWithoutFeedback key={index} onPress={this._handlePress.bind(this, index)} style={{backgroundColor: 'red'}}>
          <Animated.View
          style={{ transform: [{ translateX: this.state.animatedStagArr[index] }] }}>
            <View style={styles.menuItemContainer}>
              {this.state.menuItems[index].icon}
              <Text style={[styles.menuItem, { ...this.props.menuTextStyles }]}>
                {this.state.menuItems[index].title}
              </Text>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )
    })

    return (
      <View style={[styles.offCanvasContainer, {
        flex: 1,
        backgroundColor: this.props.backgroundColor
      }]}>

        <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}>
          <Animated.View style={styles.menuItemsContainer}>
              {staggeredAnimatedMenus}
          </Animated.View>
        </ScrollView>

        <Animated.View
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => true}
        onResponderRelease={(evt) => this._gestureControl(evt)}
        style={[styles.activityContainer, {
          flex: 1,
          backgroundColor: this.props.backgroundColor,
          transform: [
            { translateX: this.state.activityLeftPos },
            { scale: this.state.scaleSize },
            { rotateY: rotateVal }
          ]
        }]}>

          {this.state.menuItems[this.state.activeMenu].renderScene}
        </Animated.View>

      </View>
    )
  }

  // press on any menu item, render the respective scene
  _handlePress(index) {
    this.setState({ activeMenu: index })
    this.props.onMenuPress()
  }

  _hardwareBackHandler() {
    this.props.onMenuPress()
    return true
  }

  // control swipe left or right reveal for menu
  _gestureControl(evt) {
    const {locationX, pageX} = evt.nativeEvent

    if (!this.props.active) {
      if (locationX < 40 && pageX > 100) this.props.onMenuPress()
    } else {
      if (pageX) this.props.onMenuPress()
    }
  }

  // animate stuffs with hard coded values for fine tuning
  _animateStuffs() {
    const activityLeftPos = this.props.active ? 150 : 0
    const scaleSize = this.props.active ? .8 : 1
    const rotate = this.props.active ? 1 : 0
    const menuTranslateX = this.props.active? 0 : -150

    Animated.parallel([
      Animated.timing(this.state.activityLeftPos, { toValue: activityLeftPos, duration: this.state.animationDuration }),
      Animated.timing(this.state.scaleSize, { toValue: scaleSize, duration: this.state.animationDuration }),
      Animated.timing(this.state.rotate, { toValue: rotate, duration: this.state.animationDuration }),
      Animated.stagger(50, this.state.stagArr.map((item) => {
        if (this.props.active) {
          return Animated.timing(
            this.state.animatedStagArr[item],
            {
              toValue: menuTranslateX,
              duration: this.state.animationDuration,
              delay: 250
            }
          )
        } else {
          return Animated.timing(
            this.state.animatedStagArr[item],
            {
              toValue: menuTranslateX,
              duration: this.state.animationDuration,
              delay: 400
            }
          )
        }
      }))
    ])
    .start()
  }
}

// validate props
OffCanvas3D.propTypes = {
  active: React.PropTypes.bool.isRequired,
  onMenuPress: React.PropTypes.func.isRequired,
  menuItems: React.PropTypes.array.isRequired,
  backgroundColor: React.PropTypes.string,
  menuTextStyles: React.PropTypes.object,
  handleBackPress: React.PropTypes.bool
}

// set default props
OffCanvas3D.defaultProps = {
  backgroundColor: '#222222',
  menuTextStyles: { color: 'white' },
  handleBackPress: true
}

export default OffCanvas3D

// structure stylesheet
const styles = StyleSheet.create({
  offCanvasContainer: {

  },
  menuItemsContainer: {
    paddingTop: 30
  },
  menuItemContainer: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuItem: {
    fontWeight: 'bold',
    paddingLeft: 12,
    paddingTop: 15,
    paddingBottom: 15
  },
  activityContainer: {

  }
})
