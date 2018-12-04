import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import {
  Animated,
  StyleSheet,
  View
} from 'react-native'

export default class Headroom extends Component {
  constructor (props) {
    super(props)
    this.state = {
      height: new Animated.Value(0), // The header top position
      visible: true, // Is the header currently visible
      useNativeDriver: true
    }
    // How long does the slide animation take
    this.slideDuration = this.props.slideDuration || 400
  }

  _onScroll (event) {
    const currentOffset = event.nativeEvent.contentOffset.y

    const scrollOutside =
      currentOffset < 0 ||
      currentOffset >
        event.nativeEvent.contentSize.height -
          event.nativeEvent.layoutMeasurement.height
    const scrollUnderHeader = currentOffset <= this.props.headerHeight
    if (scrollOutside || scrollUnderHeader) {
      return
    }

    if (
      (this.state.visible && currentOffset > this.offset) ||
      (!this.state.visible && currentOffset < this.offset)
    ) {
      this._toggleHeader()
    }

    this.offset = currentOffset
  }

  _toggleHeader () {
    Animated.timing(this.state.height, {
      duration: this.slideDuration,
      toValue: this.state.visible ? -this.props.headerHeight : 0
    }).start()
    this.setState({ visible: !this.state.visible })
  }

  render () {
    const { headerComponent, ScrollableComponent } = this.props
    return (
      <View style={styles.container}>
        <ScrollableComponent
          onScroll={this._onScroll.bind(this)}
          {...this.props}
        >
          <View style={{ marginTop: this.props.headerHeight }}>
            {this.props.children}
          </View>
        </ScrollableComponent>
        <Animated.View
          style={[
            styles.header,
            {
              transform: [
                {
                  translateY: this.state.height
                }
              ]
            }
          ]}
        >
          {headerComponent}
        </Animated.View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  }
})
