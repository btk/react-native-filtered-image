import React from 'react';
import { View, WebView, Image, Text } from 'react-native';

function toDataURL(url, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('get', url);
	xhr.responseType = 'blob';
	xhr.onload = function(){
	  var fr = new FileReader();

	  fr.onload = function(){
	    callback(this.result);
	  };

	  fr.readAsDataURL(xhr.response); // async call
	};

	xhr.send();
}

export default class Canvas extends React.Component {
  constructor(props){
		super(props);
		this.canvasWidth = this.props.width;
		this.canvasHeight = this.props.height;
		this.state = {
			filtertedImageUri: null,
			rawImageBase64: null
		}
		console.log(this.props.source.uri);
		toDataURL(this.props.source.uri, (rawImageBase64) => {
			this.setState({rawImageBase64});
			console.time("s3");
		})
	}

	sentData(event){
		let data = event.nativeEvent.data;
		this.setState({
			filtertedImageUri: data
		});
		console.log(this.props.source.uri);
		console.timeEnd("s3");
	}

	imgFilterFunction(){
		// Keep in mind, this function will render
		// on browser, and can not interact with global variables.
		// img: current loaded img object (dom)
		// texture: glfx object for manipulation
		var texture = canvas.texture(img);
		var drawer = canvas.draw(texture);
		var isUIwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
		if(isUIwebview){
			drawer.matrixWarp([[1,0],[0,-1]], false, true);
			// Flip the canvas if browser engine is running on UIwebview
			// BC of wierd bug on webgl or glfx: evanw/glfx.js/issues/36
		}
		drawer.hueSaturation(-0.96, 0.36)
		drawer.sepia(0.2)
		drawer.update();

		window.postMessage(canvas.toDataURL("image/jpeg", 1));
	}

	injectJS(){
		return `
		var canvas = fx.canvas();
		var img = new Image;
		img.onload = ${this.imgFilterFunction.toString()};
		img.src = '${this.state.rawImageBase64}';
		`;
	}

	renderWebView(){
		return(
			<View style={[this.props.style, { width: this.canvasWidth, height: this.canvasHeight }]}>
				<Text>Loading</Text>
				<WebView
					source={require("./index.html")}
					injectedJavaScript={this.injectJS()}
					onMessage={this.sentData.bind(this)}
					style={{width: 0, height: 0}}
				/>
			</View>
		);
	}

  render() {
		if(this.state.rawImageBase64){
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
		}else{
			return null;
		}
  }
}
