import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  BackHandler
} from 'react-native'

class OffCanvasReveal extends Component {
  constructor(props) {
    super(props)

    this.goToMenu = this._goToMenu.bind(this)
    this.changeTitleItem = this._changeTitleItem.bind(this)

    this._hardwareBackHandler = this._hardwareBackHandler.bind(this)

    this.state = {
      activityLeftPos : new Animated.Value(0),
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
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._hardwareBackHandler)
    }

    if(this.props.handleBackPress && !this.props.active) {
      try {
         this.backHandler.remove();
      }
      catch (e) {
         this.backHandler = undefined;
      }
    }
  }

  render() {
    const staggeredAnimatedMenus = this.state.stagArr.map((index) => {

      return (this.state.menuItems[index].title!=null) ? (
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
      ) : (null);
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
            { translateX: this.state.activityLeftPos }
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
    const activityLeftPos = this.props.active ? 250 : 0
    const menuTranslateX = this.props.active? 0 : -150

    Animated.parallel([
      Animated.timing(this.state.activityLeftPos, { toValue: activityLeftPos, duration: this.state.animationDuration }),
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

  // go to menu item
  _goToMenu(index){

    if(Number.isInteger(index) && this.state.menuItems.length < index){
      console.warn('item does not exist');
      return false;
    }

    this.setState({ activeMenu: index });
  }

  // change a menu title by index
  _changeTitleItem(index, title){

    if(Number.isInteger(index) && this.state.menuItems.length < index){
      console.warn('item does not exist');
      return false;
    }

    let menuItem = this.state.menuItems;
    menuItem[index].title = title;

    this.setState({menuItem});
  }

}

// validate props
OffCanvasReveal.propTypes = {
  active: PropTypes.bool.isRequired,
  onMenuPress: PropTypes.func.isRequired,
  menuItems: PropTypes.array.isRequired,
  backgroundColor: PropTypes.string,
  menuTextStyles: PropTypes.object,
  handleBackPress: PropTypes.bool
}

// set default props
OffCanvasReveal.defaultProps = {
  backgroundColor: '#222222',
  menuTextStyles: { color: 'white' },
  handleBackPress: true
}

export default OffCanvasReveal

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
