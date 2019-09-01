/**
* 备注：带蒙层动画
* create by Mark at 2019-July
*/
import React, { Component } from 'react';
import { 
		View,
		Text,
		Image,
		TouchableOpacity,
		StyleSheet,
		ViewStyle,
		ModalProps,
		Modal,
		Dimensions,
		Animated,
		TouchableWithoutFeedback,
} from 'react-native';
// import Orientation from "react-native-orientation";

/**动画类型 */
type AnimatedType = 'top'|'bottom'|'left'|'right';

type Props = {
		style : ViewStyle,
		animateType:AnimatedType,//动画类型
		contentHeight?:Number,//内容高度，动画竖直方向需要
		contentWidth?:Number,//内容宽度，动画水平方向需要

		topWhenHorizon?:Number,//当水平动画时，距离顶部距离
}&ModalProps;

type State = {
	left : Animated.Value,
	top  : Animated.Value,
	show : Boolean,
};

const S_HEIGHT : Number = Dimensions.get('window').height;
const S_WIDTH  : Number = Dimensions.get('window').width;

/**动画时间 */
const ANIMATED_DURATION : Number = 300;//单位ms

export class UModal extends Component <Props,State>{
		
	static defaultProps :Props = {
			contentHeight : S_HEIGHT*0.6,
			contentWidth  : S_WIDTH*0.7,
			animateType		: 'bottom',
			topWhenHorizon: 0,
		}

		state:State={
			left:this.getPositionPointByAnimatedType(this.props.animateType).left,
			top:this.getPositionPointByAnimatedType(this.props.animateType).top,
			show :false,
		}

		/**根据位置，绘制内容的起始坐标点 */
		getPositionPointByAnimatedType (type:AnimatedType):{left:Number,top:Number}{
			let topWhenHorizon : Number = this.props.topWhenHorizon;
			switch(type){
				case 'bottom':return {left:new Animated.Value(0),top:new Animated.Value(S_HEIGHT)};
				case 'top':return {left:new Animated.Value(0),top:new Animated.Value(-this.props.contentHeight)};
				case 'left':return {left:new Animated.Value(-this.props.contentWidth),top:new Animated.Value(topWhenHorizon)};
				case 'right':return {left:new Animated.Value(S_WIDTH),top:new Animated.Value(topWhenHorizon)};
				default:return {left:new Animated.Value(0),top:new Animated.Value(S_HEIGHT)};
			}
		}

		/**显示动画 */
		showAnimated = ()=>{
			const {contentHeight,contentWidth,animateType} = this.props;
			this.setState({show:true})
			switch(animateType){
				case 'top':Animated.timing(this.state.top,{toValue:0,duration:ANIMATED_DURATION}).start();break;
				case 'bottom':Animated.timing(this.state.top,{toValue:S_HEIGHT-contentHeight,duration:ANIMATED_DURATION}).start();break;
				case 'left':Animated.timing(this.state.left,{toValue:0,duration:ANIMATED_DURATION}).start();break;
				case 'right':Animated.timing(this.state.left,{toValue:S_WIDTH-contentWidth,duration:ANIMATED_DURATION}).start();break;
				default:Animated.timing(this.state.top,{toValue:S_HEIGHT-contentHeight,duration:ANIMATED_DURATION}).start();break;
			}
		}
		
		/**隐藏动画 */
		hideAnimated = ()=>{

			const {contentHeight,contentWidth,animateType} = this.props;
			switch(animateType){
				case 'top':Animated.timing(this.state.top,{toValue:-contentHeight,duration:ANIMATED_DURATION}).start(()=>{this.setState({show:false})});break;
				case 'bottom':Animated.timing(this.state.top,{toValue:S_HEIGHT,duration:ANIMATED_DURATION}).start(()=>{this.setState({show:false})});break;
				case 'left':Animated.timing(this.state.left,{toValue:-contentWidth,duration:ANIMATED_DURATION}).start(()=>{this.setState({show:false})});break;
				case 'right':Animated.timing(this.state.left,{toValue:S_WIDTH,duration:ANIMATED_DURATION}).start(()=>{this.setState({show:false})});break;
				default:Animated.timing(this.state.top,{toValue:S_HEIGHT,duration:ANIMATED_DURATION}).start(()=>{this.setState({show:false})});break;
			}
		}

		UNSAFE_componentWillReceiveProps(nextProps:Props){
			if(!nextProps.visible && this.props.visible){
				this.hideAnimated();
			}
			if(nextProps.visible && !this.props.visible){
				this.showAnimated();
			}
		}

		componentDidMount(){
			// this.addListner()
		}
		componentWillUnmount(){
			// this.removeListner()
		}

		// onScreenChange = (o:Orientation)=>{
		// 	this.forceUpdate();
		// }

		// addListner = ()=>{
		// 	Orientation.addOrientationListener(this.onScreenChange)
		// }

		// removeListner = ()=>{
		// 	Orientation.removeOrientationListener(this.onScreenChange)
		// }

		render(){
				const {style,visible,onDismiss,animateType,topWhenHorizon} = this.props;
				let {left,top,show} = this.state;
				top = animateType=='left'||animateType=='right' ? topWhenHorizon : top;
				return (
						<Modal
							transparent={true}
							{...this.props}
							visible={show}
							
							style={styles.container}
							>
								<TouchableOpacity
									activeOpacity={1}
									onPress={()=>{
										this.props.onRequestClose && this.props.onRequestClose()
									}}
									style={styles.content}>
									<Animated.View 
										onStartShouldSetResponder={()=>true}//这个属性可以放置touchopacity穿透返回true
										style={[styles.animatedContent,{left:left,top:top}]}>
										{this.props.children}
									</Animated.View>
								</TouchableOpacity>
						</Modal>
				)
		}
}

const styles = StyleSheet.create({
		container:{width:'100%',height:'100%',zIndex:1,},
		content:{backgroundColor: 'rgba(0,0,0,0.5)',flex:1},
		animatedContent:{position:'absolute'},
})