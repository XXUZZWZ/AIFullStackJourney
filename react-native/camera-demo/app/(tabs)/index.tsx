import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions
}from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import {
  useRef,
  useState
}from 'react'

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Pressable,
  Button,
  Alert
}from 'react-native'
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons'
export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [uri, setUri] = useState<string | null>(null);
  const ref = useRef<CameraView>(null);
  
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [recording, setRecording] = useState(false);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  if (!permission) {
    return null
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          需要相机权限才能使用相机功能
        </Text>
        <Pressable
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>授权相机权限</Text>
        </Pressable>
      </View>
    )
  }

  const toggleMode = () => {
    setMode(mode === "picture" ? "video" : "picture");
  }

  // const takePicture = async () => {
  //   if (ref.current) {
  //     try {
  //       const photo = await ref.current.takePictureAsync();
  //       setUri(photo.uri);
  //     } catch (error) {
  //       console.error('Error taking picture:', error);
  //     }
  //   }
  // }
  const takePicture = async ()=>{
    const photo = await ref.current?.takePictureAsync();
    if(photo?.uri){
      setUri(photo.uri);

    }
  }

  const toggleRecording = async () => {
    if (!recording) {
      // 开始录像
      if (ref.current) {
        try {
          const video = await ref.current.recordAsync();
          setRecording(true);
        } catch (error) {
          console.error('Error starting recording:', error);
        }
      }
    } else {
      // 停止录像
      if (ref.current) {
        try {
          const video = await ref.current.stopRecording();
          setRecording(false);
          setUri(video.uri);
        } catch (error) {
          console.error('Error stopping recording:', error);
        }
      }
    }
  }

  const saveToAlbum = async () => {
    if (!uri) return;

    try {
      if (!mediaPermission?.granted) {
        const permission = await requestMediaPermission();
        if (!permission.granted) {
          Alert.alert('需要相册权限才能保存');
          return;
        }
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('保存成功', '照片/视频已保存到相册');
    } catch (error) {
      console.error('Error saving to album:', error);
      Alert.alert('保存失败', '无法保存到相册，请使用开发构建版本测试完整功能');
    }
  }

  const renderPicture = (uri:string) => {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri }} style={styles.preview} />
        <View style={styles.previewControls}>
         <Button onPress={()=>setUri(null)} title='take other photo'/>
        </View>
      </View>
    )
  };
  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera}
          ref={ref}
          mode={mode}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        /> 
        <View style={styles.shutterContainer}>
          <Pressable onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
            <Ionicons name="camera-reverse" size={32} color="white" />
          </Pressable>

          <Pressable onPress={toggleMode}>
            {
              mode === 'picture'?
              (<AntDesign name="picture" size={32} color="white"/>)
              :
              (
                <Feather name="video" size={32} color="white"/>
              )
            }
          </Pressable>
          <Pressable
            onPress={() => {
              if (mode === 'picture') {
                takePicture();
              } else {
                toggleRecording();
              }
            }}
          >
            {({pressed}) => (
              <View style={
                [
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1
                  }
                ]
              }>
                <View style={
                  [
                    styles.shutterBtnInner,
                    {
                      backgroundColor: mode === 'picture'?'white':'red'
                    }
                  ]
                }>

                </View>
              </View>
            )}
          </Pressable>
         
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
    {uri ? renderPicture(uri):renderCamera() }
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  shutterContainer: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    width: '100%',
  },
  shutterBtn: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'white',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shutterBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white'
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain'
  },
  previewControls: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  previewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333'
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
})


