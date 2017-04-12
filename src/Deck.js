import React, {Component} from 'react';
import { View, 
		Animated,
		PanResponder,
		Dimensions
		} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD =  0.50 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250
class Deck extends Component{
	constructor(props){
		super(props);
		const position = new Animated.ValueXY();
		const panResponder = PanResponder.create({
			onStartShouldSetPanResponder : () => true,
			onPanResponderMove : (event, gesture) => {
				position.setValue({x:gesture.dx, y:gesture.dy});
			},
			onPanResponderRelease : (event, gesture) => {
				if(gesture.dx > SWIPE_THRESHOLD){
					this.forceSwipe('right');
				} else if (gesture.dx < -SWIPE_THRESHOLD) {
					this.forceSwipe('left');
				} else {
					this.resetPosition();
				}
				
			}
		});

		this.state = {panResponder, position };
	}
	forceSwipe(direction){
		const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

		Animated.timing(this.state.position, {
			toValue:{x, y:0},
			duration: SWIPE_OUT_DURATION
		}).start();
	}

    resetPosition(){
	      Animated.spring(this.state.position, {
		        toValue:{x:0, y:0}
	         }).start();
     }
	getCardStyle(){

		// Interpolation 
		const {position} =this.state;
		//Set up interpolation relationship between rotation and card position of Animated.ValueXY()
		const rotate = position.x.interpolate({
			inputRange: [-SCREEN_WIDTH * 2.0, 0, SCREEN_WIDTH * 2.0],
			outputRange:['-120deg', '0deg', '120deg']
		});

		return	 {
			...position.getLayout(),
			transform: [{rotate}]
		};
	}

	renderCards(){
		return this.props.data.map( (item, index) =>{
			if (index === 0){
				return(
					<Animated.View
						key={item.id}
						style={this.getCardStyle()}
				 		{...this.state.panResponder.panHandlers}
					>
						{this.props.renderCard(item)}
					</Animated.View>
					)
			}
			return this.props.renderCard(item);
		});
	}
	render(){
		return (
				<View>
						{this.renderCards()}
				</View>
			);
		
	}
}


export default Deck;