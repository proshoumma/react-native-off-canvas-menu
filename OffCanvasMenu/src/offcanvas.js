import React, { Component } from 'react'
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Animated
} from 'react-native'

export default class OffCanvas extends Component {
  constructor(props) {
    super(props)

    const { height, width } = Dimensions.get('window')

    this.state = {
      activityLeftPos : new Animated.Value(0),
      scaleSize : new Animated.Value(1.0),
      rotate: new Animated.Value(0),
      animationDuration: 400,
      stagArr: [],
      animatedStagArr: [],
      menuItems: this.props.menuItems,
      activeMenu: 0,
      windowHeight: height,
      windowWidth: width
    }
  }

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

  componentDidUpdate() {
    this._animateStuffs()
  }

  render() {
    const rotateVal = this.state.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-10deg']
    })

    const staggeredAnimatedMenus = this.state.stagArr.map((index) => {
      return (
        <Animated.Text
        style={[styles.menuItem, {
          color: 'white',
          transform: [
            {translateX: this.state.animatedStagArr[index]}
          ]
        }]}
        key={index}
        onPress={this._handlePress.bind(this, index)}
        >{this.state.menuItems[index].title.toUpperCase()}</Animated.Text>
      )
    })

    return (
      <View style={[styles.offCanvasContainer, {
        height: this.state.windowHeight,
        width: this.state.windowWidth,
        backgroundColor: this.props.backgroundColor
      }]}>

        <Animated.View style={styles.menuItemsContainer}>
          {staggeredAnimatedMenus}
        </Animated.View>

        <Animated.View
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => true}
        onResponderRelease={(evt) => this._gestureControl(evt)}
        style={[styles.activityContainer, {
          left: this.state.activityLeftPos,
          height: this.state.windowHeight,
          width: this.state.windowWidth,
          backgroundColor: this.props.backgroundColor,
          transform: [
            { scale: this.state.scaleSize },
            { rotateY: rotateVal }
          ]
        }]}>

          {this.state.menuItems[this.state.activeMenu].renderScene}

        </Animated.View>

      </View>
    )
  }

  _handlePress(index) {
    this.setState({ activeMenu: index })
    this.props.onMenuPress()
  }

  _gestureControl(evt) {
    const {locationX, pageX} = evt.nativeEvent

    if (!this.props.active) {
      if (locationX < 40 && pageX > 100) this.props.onMenuPress()
    } else {
      if (pageX) this.props.onMenuPress()
    }
  }

  _animateStuffs() {
    const activityLeftPos = this.props.active ? this.state.windowWidth * (1/2) : 0
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

const styles = StyleSheet.create({
  offCanvasContainer: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  menuItemsContainer: {
    marginTop: 30
  },
  menuItem: {
    fontWeight: 'bold',
    paddingLeft: 30,
    paddingTop: 15,
    paddingBottom: 15
  },
  activityContainer: {
    top: 0,
    position: 'absolute',
    elevation: 0
  }
})
