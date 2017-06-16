import React from 'react';
import { Button, Image, View, Text } from 'react-native';
import { ImagePicker } from 'expo';
import FilteredImage from './js/filteredImage';

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

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
  };

  render() {
    return (
      <View>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {this.state.image &&
          <View>
            <Image
              source={{ uri: this.state.image }}
              style={{
                width: 300,
                height: 300,
                resizeMode: Image.resizeMode.contain
            }}/>
            <FilteredImage
              imageUri={this.state.image}
              width={300}
              height={300}
              style={{backgroundColor: "#ccc"}}
            />
          </View>
        }
      </View>
    );
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });

    if (!result.cancelled) {
      toDataURL(result.uri, (dataURL) => {
        this.setState({ image: dataURL });
      });

    }
  };
}
