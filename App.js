import React from 'react';
import { Button, Image, View, Text, ScrollView } from 'react-native';
import { ImagePicker } from 'expo';
import FilteredImage from './js/filteredImage';


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
          <ScrollView style={{width: "100%", height: "100%"}}>
            <FilteredImage
              source={{uri: this.state.image}}
              width={300}
              height={300}
              style={{backgroundColor: "#ccc"}}
            />
          </ScrollView>
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
      console.log(result);
      this.setState({ image: result.uri });
    }
  };
}
