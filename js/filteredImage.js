import React from 'react';
import { View, WebView, Image, Text } from 'react-native';

export default class Canvas extends React.Component {
  constructor(props){
		super(props);
		this.canvasWidth = this.props.width;
		this.canvasHeight = this.props.height;
		this.state = {
			filtertedImageUri: null
		}
	}

	sentData(event){
		let data = event.nativeEvent.data;
		console.log(data);
		this.setState({
			filtertedImageUri: data
		});
	}

	injectJS(){
		return `
		var canvas = fx.canvas();
		var img = new Image;
		img.onload = function(){
		  var texture = canvas.texture(img);
			canvas.draw(texture).matrixWarp([[1,0],[0,-1]], false, true).hueSaturation(-0.33, 0.47).update();
			window.postMessage(canvas.toDataURL("image/jpeg", 0.92));
		};
		img.src = '${this.props.imageUri}';
		`;
	}

	finished(){
		console.log("loaded");
	}

	renderWebView(){
		return(
			<View style={[this.props.style, { width: this.canvasWidth, height: this.canvasHeight }]}>
				<Text>Loading</Text>
				<WebView
					source={require("./index.html")}
					injectedJavaScript={this.injectJS()}
					onMessage={this.sentData.bind(this)}
					onLoad={this.finished}
					style={{width: 0, height: 0}}
				/>
			</View>
		);
	}

  render() {
		if(!this.state.filtertedImageUri){
			return(this.renderWebView());
		}else{
			return (
				<Image
					source={{ uri: this.state.filtertedImageUri }}
					style={[{
						width: this.canvasWidth,
						height: this.canvasHeight
				}, this.props.style]}/>
	    );
		}
  }
}
