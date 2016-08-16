import React, { Component } from 'react'
import {
  Dimensions,
  Text,
  View,
  StyleSheet
} from 'react-native'
import {Motion, spring, StaggeredMotion} from 'react-motion';

const animationEffects = {
  noWobble: {stiffness: 170, damping: 26},
  gentle: {stiffness: 120, damping: 14},
  wobbly: {stiffness: 180, damping: 12},
  stiff: {stiffness: 210, damping: 20},
  custom: {stiffness: 300,  damping: 30}
}

export default class OffCanvas extends Component {
  render() {
    // get the window height and width
    // since device orientation can change
    // height and width will change on render
    const { height, width } = Dimensions.get('window')
    const activityLeftPos = this.props.active ? width * (1/2) : 0
    const scaleSize = this.props.active? .8 : 1
    const rotation = this.props.active? -10 : 0
    const menuTranslateX = this.props.active? 0 : -150

    console.log(this.props.active)


    return (
      <View style={[styles.offCanvasContainer, {
        height: height,
        width: width
      }]}>


        <View style={styles.menuItemsContainer}>

          <StaggeredMotion
          defaultStyles={[{x: 0}, {x: 0}, {x: 0}]}
          styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
            return i === 0
            ? {x: spring(menuTranslateX, {...animationEffects.noWobble})}
            : {x: spring(prevInterpolatedStyles[i - 1].x, {...animationEffects.noWobble})}
          })}>

          { interpolatingStyles =>
            <View>
              { interpolatingStyles.map((style, i) =>
                <Text
                style={[styles.menuItem, {
                  color: 'white',
                  transform: [
                    {translateX: style.x}
                  ]
                }]}
                key={i}
                onPress={this._handlePress.bind(this)}
                >{'Hello World'.toUpperCase()}</Text>
              )}
            </View>
          }

          </StaggeredMotion>




        </View>

        <Motion style={{
          left: spring(activityLeftPos, {...animationEffects.noWobble}),
          scale: spring(scaleSize, {...animationEffects.noWobble}),
          rotate: spring(rotation, {...animationEffects.noWobble})
        }}>
          { value =>
            <View style={[styles.activityContainer, {
              left: value.left,
              height: height,
              width: width,
              elevation: 10,
              transform: [
                { scale: value.scale },
                { rotateY: value.rotate + 'deg' }
              ]
            }]}>
              {this.props.children}
            </View>
          }
        </Motion>
      </View>
    )
  }

  _handlePress() {
    this.props.onMenuPress()
  }
}

const styles = StyleSheet.create({
  offCanvasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#222222'
  },
  menuItemsContainer: {
    marginTop: 30
  },
  menuItem: {
    fontWeight: 'bold',
    paddingLeft: 30,
    marginTop: 10,
    marginBottom: 10
  },
  activityContainer: {
    top: 0,
    position: 'absolute'
  }
})
