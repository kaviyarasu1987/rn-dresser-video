import React from 'react';
import { Text, View, Image, TouchableOpacity, TouchableHighlight, StyleSheet, Alert,Share,  Button, Slider, Platform,Dimensions  } from 'react-native';
import * as Permissions from 'expo-permissions';
import { WebView } from 'react-native-webview';
import { Camera } from 'expo-camera';
//import { captureScreen } from "react-native-view-shot";
import SelectableGrid from 'react-native-selectable-grid';
import { Paint } from './jspaint';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing';
import * as ImageManipulator from 'expo-image-manipulator';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import { Entypo,SimpleLineIcons,MaterialCommunityIcons,MaterialIcons,FontAwesome } from '@expo/vector-icons';


export default class DresserMale extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.front,
        snap:false,
        showseparator: false,
        imageuri: " ",
        panturi: " ",
        shirtCapture: "Try Shirt",
        pantCapture: "Try Pant",
        brush1: "green",
        brush2: "red",
        brush3: "black",
        brush4: "black",
        brush5: "rgba(255,255,255,0.5)",
        action: JSON.parse('{"name":"brush","value":"10"}'),
        selectedItems: [],
        key: 13213,
        progress:"0%",
        rubbertype:"Magic click thickness:",
        cameracolor:"black",
        data: [{ label: "body", value: [12, 13],logo: require("./assets/bodyparts/body.png") }, { label: "upper arms", value: [2, 3, 4, 5],logo: require("./assets/bodyparts/upperarm.png") },{ label: "lower arms", value: [6, 7, 8, 9],logo: require("./assets/bodyparts/lowerarms.png") },{ label: "hands", value: [10,11],logo: require("./assets/bodyparts/hands.png") }, { label: "upper legs", value: [14,15,16,17],logo: require("./assets/bodyparts/upperlegs.png") },{ label: "lower legs", value: [18,19,20,21],logo: require("./assets/bodyparts/lowerlegs.png") },{ label: "feets", value: [22,23],logo: require("./assets/bodyparts/feets.png")},{ label: "face", value: [0,1],logo: require("./assets/bodyparts/face.png")} ]
    };
    items = [{ id: "0", name: "left face" }, { id: "1", name: "right face" }, { id: "2", name: "left upper arm front" }, { id: "3", name: "left arm back" }, { id: "4", name: "right upper arm front" }, { id: "5", name: "right upper arm back" }, { id: "6", name: "left lower arm front" }, { id: "7", name: "left lower arm back" }, { id: "8", name: "right lower arm front" }, { id: "9", name: "right lower arm back" }, { id: "10", name: "left hand" }, { id: "11", name: "right hand" }, { id: "12", name: "torso front" }, { id: "13", name: "torso back" }, { id: "14", name: "left upper leg front" },
    { id: "15", name: "left upper leg back" }, { id: "16", name: "right upper leg front" }, { id: "17", name: "right upper leg back" }, { id: "18", name: "left lower leg front" }, { id: "19", name: "left lower leg back" }, { id: "20", name: "right lower leg front" }, { id: "21", name: "right lower leg back" }, { id: "22", name: "left feet" }, { id: "23", name: "right feet" }]
    imageuri = ""

    createGenericAlert = (title,message,callbackOk,callbackCancel) =>
    Alert.alert(
        title,
        message,
      [
       
        { text: "OK", onPress: callbackOk?callbackOk:() => console.log("OK Pressed") },
        { text: "Cancel", onPress: callbackCancel?callbackCancel:() => console.log("Cancel Pressed") }
      ],
      { cancelable: false }
    );

    handleColor(brush1, brush2, brush3, brush4, brush5) {
        this.setState({
            brush1: brush1,
            brush2: brush2,
            brush3: brush3,
            brush4: brush4,
            brush5: brush5
        })

        let actionObject = this.state.action;
        if(this.state.brush2=="red")
        {
            actionObject.name = 'rubber'
            this.setState({ rubbertype: "Rubber thickness:" });

        }
        else if(this.state.brush1=="red")
        {
            actionObject.name = 'magic'
            this.setState({  rubbertype: "Magic click thickness:" });

        }

       
        
        
        this.sendpostMessage(JSON.stringify(actionObject))
       
        this.setState({ action: actionObject });

    }

    rubberThickness(value) {
       
        let actionObject = this.state.action;
        if(this.state.brush2=="red")
        {
            actionObject.name = 'magic'
            this.setState({  rubbertype: "Magic click thickness:" });
            

        }
        else if(this.state.brush1=="red")
        {
            actionObject.name = 'rubber'
            this.setState({ rubbertype: "Rubber thickness:" });

        }



        actionObject.value = "" + value;
        this.setState({ progress: ""+parseInt(value*4)+"%" });
      
        this.sendpostMessage(JSON.stringify(actionObject));
        this.setState({ action: actionObject });
      






    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { statusCameraRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted' });
    }
    _imagPicker = async()=>{
        let photo = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        base64: true,
        quality :0.1,
        compress:0,
        maxWidth: 500,
        maxHeight: 500

        })
        const screenWidth = Math.round(Dimensions.get('window').width);
        //  console.log(screenWidth);
       const screenHeight = Math.round(Dimensions.get('window').height);

        this.setState({ snap: true });
        
       var  photoSelf = await ImageManipulator.manipulateAsync(photo.uri, [{
            rotate: 0
        },


        {
            resize: {
                width: screenWidth,
                height: screenHeight
            }
        }], {
            compress: 0,
            base64: true
        });

            this.sendpostMessage(JSON.stringify({compressed:photoSelf.base64,original:photo.base64}));
            this.setState({ type: Camera.Constants.Type.back });
            this.setState({ snap: true});
    }

    

    sendpostMessage(dataToSend) {

        this.webview.postMessage(dataToSend)
        

    }
    

    captureAndSend = async () => {

        // if(this.state.cameracolor == "grey")
        // {
        //     this.createGenericAlert("Aww.. no place to trial","Please select any cloth parts or draw");

        //     return;
        // }

        if(this.camera)
        { 
                let video = await this.camera.recordAsync({
                    maxDuration:10,
                    mute:true

                });
                //video.uri = video.uri.replace("file://","")
               // console.log("local uri "+video.uri)
                const info = await FileSystem.getInfoAsync(video.uri)
                const response = await fetch(info.uri);
               
                
                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(blob); 
                reader.onloadend = this.sendVideoToWebView.bind(this,reader)
              
              
        }


    }

    sendVideoToWebView(reader){
        var base64data = reader.result;                
        //  console.log("done");
         // this.webview.postMessage("hi");
         if(base64data)
            console.log("done");
         this.sendpostMessage(base64data);

    }

    resetToPreviousBehaviour() {

        const callbackOk = ()=>{
            let actionObject = this.state.action;
            actionObject.name = "reset";
            this.setState({ snap: false});
            this.setState({  key: Math.random()});
            this.sendpostMessage(JSON.stringify(actionObject));

        }
       
    

        this.createGenericAlert("Sure?","Are you sure to reset all your changes?",callbackOk);

       


    }

    undoToPreviousBehaviour() {
        let actionObject = this.state.action;
        actionObject.name = "undo";
        this.sendpostMessage(JSON.stringify(actionObject));


    }
    reverseCamera() {
       if(this.state.type ==  Camera.Constants.Type.front)
        this.setState({ type: Camera.Constants.Type.back });
       else
       this.setState({ type: Camera.Constants.Type.front });
    }
    shareOnWebView()
    {
        if(!this.state.snap)
        {
            this.createGenericAlert("Snap","Take a picture or upload to trial and share") 
            this.setState({  key: Math.random()})  
            return 

        }
        let actionObject = JSON.parse('{"name":"brush","value":"10"}');
        actionObject.name = "share";
        actionObject.value = "";       
        this.sendpostMessage(JSON.stringify(actionObject));

    }
    organselector(datachange) {
        
        if(!this.state.snap)
        {
            this.createGenericAlert("Snap","Take a picture or upload to trial") 
            this.setState({  key: Math.random()})  
            return 

        }


        let actionObject = JSON.parse('{"name":"brush","value":"10"}');
        var overallParts =[]
        if(datachange)
        for(var i=0;i<datachange.length;i++)
        {
            overallParts = overallParts.concat(  this.state.data[datachange[i]].value );

        }
        actionObject.name = "organ";
        actionObject.value = overallParts;
        console.log(overallParts);
        //console.log(JSON.stringify(actionObject))
        this.sendpostMessage(JSON.stringify(actionObject));

    }
    async onMessage(event) {   
     console.log(event)
     var syncJSONObject  = JSON. parse(event.nativeEvent.data)
     console.log(syncJSONObject) 
       if(syncJSONObject.imageData)
       {
          this.imageuri = syncJSONObject.imageData;
          
          this.share();
       }
       else if(syncJSONObject.alertmessage)
       {
        this.createGenericAlert(syncJSONObject.alerttitle,syncJSONObject.alertmessage) 

       }
       else if(syncJSONObject.separatorenable)
       {
            if(syncJSONObject.separatorenable == "true")
            {

                this.setState({ showseparator: true });
            }
            else{

                this.setState({ showseparator: false });
            }

       }
       else if(syncJSONObject.enablecamsnap)
       {
        if(syncJSONObject.enablecamsnap == "true")
        {

            this.setState({ cameracolor: "black" });
        }
        else{

            this.setState({ cameracolor: "grey" });
        }
        
       }
       else if(syncJSONObject.message)
       {
        
        this.createGenericAlert(syncJSONObject.title,syncJSONObject.message);
        //this.createGenericAlert("Aww.. no place to trial","Please select any cloth parts or draw");

       }
       else if(syncJSONObject.resetpartselect)
       {
        if(syncJSONObject.resetpartselect == "true")
        {

            this.setState({  key: Math.random()});  
        }
       
        
       }
             
      

      }
     async share() {

      
              //const path = `${RNFS.DocumentDirectoryPath}/${id}.png`;

              if(!this.state.snap)
              {
                  this.createGenericAlert("Snap","Take a picture or upload and edit to share") 
                  this.setState({  key: Math.random()})  
                  return 
      
              }
             
              try {
                let filename = 'share.png'; // or some other way to generate filename
                let filepath = `${FileSystem.documentDirectory}/${filename}`;
                await FileSystem.writeAsStringAsync(filepath, this.imageuri.split(",")[1], { encoding: 'base64'});
                await Sharing.shareAsync(filepath, { mimeType: 'image/png' })
              } catch(e) {
                alert(e.message);
              }

            
               
        
            }

    render() {
        const { hasCameraPermission } = this.state;

        const styles = StyleSheet.create({
            container: {
                flex: 1
            },
            box1: {
                position: 'absolute',
                flex: 0.5,
                flexDirection: "row",
                top: 40,
                left: 40,

                backgroundColor: 'black'
            },
            box2: {
                position: 'absolute',
                flex: 1,
                flexDirection: "row",
                top: 80,
                left: 80,

                backgroundColor: 'blue'

            },
            box3: {
                position: 'absolute',
                flex: 0.5,
                flexDirection: "row",
                top: 120,
                left: 120,

                backgroundColor: 'green'
            },
            text: {
                color: '#ffffff',
                fontSize: 80
            }
        });
        var imageURL = "";
        var shirtimageURL = " ";
        const html = `<html style="background-color: transparent;">

        <head>
        <script src="https://code.jquery.com/jquery-1.7.2.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2"></script>
        <script src="https://cdn.jsdelivr.net/gh/kaviyarasu1987/rn-dresser/tsupdatedjs.js"></script>
        <style type="text/css">
        .LockOn {
    display: none;
    visibility: visible;
    position: absolute;
    z-index: 999;
    top: 0px;
    left: 0px;
    width: 105%;
    height: 105%;
    background-color:white;
    vertical-align:bottom;
    padding-top: 20%; 
    filter: alpha(opacity=75); 
    opacity: 0.75; 
    font-size:large;
    color:blue;
    font-style:italic;
    font-weight:400;
    background-image: url("https://cdn.jsdelivr.net/gh/kaviyarasu1987/rn-dresser/img_nature.gif");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
}
    </style>
        </head>
        
        <body style="background-color: transparent;">
        
        <div id="coverScreen"  class="LockOn">
</div>
                <canvas id="canvas" style='border: 1px solid black; background-color: transparent; display: none'></canvas>
              
                <video id="video" style='border: 1px solid black; background-color: transparent; width:98%; height:98%'></video>
               
               
        
            <script>
                (function() {

                    var rubberIndex=1;
                    var thickness=5;
                    var floodFillPoints;
                    var imageBackup;
                    var imageForBody;
                    var magicPoints = [];
                    var imageHistory = [];
                    var rubberPoints = [];
                    var rubberPointsOverall = []; 
                    var isinitial = true;
                    var lastPrediction;
                    var overrideLastImage = false;
                    MagicWand = (function () {
                        var lib = {};
                    
                        
                        lib.floodFill = function(image, px, py, colorThreshold, mask, includeBorders) {
                            return includeBorders
                                ? floodFillWithBorders(image, px, py, colorThreshold, mask)
                                : floodFillWithoutBorders(image, px, py, colorThreshold, mask);
                        };
                    
                        function floodFillWithoutBorders(image, px, py, colorThreshold, mask) {
                    
                            var c, x, newY, el, xr, xl, dy, dyl, dyr, checkY,
                                data = image.data,
                                w = image.width,
                                h = image.height,
                                bytes = image.bytes,
                                maxX = -1, minX = w + 1, maxY = -1, minY = h + 1,
                                i = py * w + px, 
                                result = new Uint8Array(w * h), 
                                visited = new Uint8Array(mask ? mask : w * h); 
                    
                            if (visited[i] === 1) return null;
                    
                            i = i * bytes; 
                            var sampleColor = [data[i], data[i + 1], data[i + 2], data[i + 3]]; 
                    
                            var stack = [{ y: py, left: px - 1, right: px + 1, dir: 1 }]; 
                            do {
                                el = stack.shift(); 
                    
                                checkY = false;
                                for (x = el.left + 1; x < el.right; x++) {
                                    dy = el.y * w;
                                    i = (dy + x) * bytes; 
                    
                                    if (visited[dy + x] === 1) continue; 
                                   
                                    c = data[i] - sampleColor[0]; 
                                    if (c > colorThreshold || c < -colorThreshold) continue;
                                    c = data[i + 1] - sampleColor[1]; 
                                    if (c > colorThreshold || c < -colorThreshold) continue;
                                    c = data[i + 2] - sampleColor[2]; 
                                    if (c > colorThreshold || c < -colorThreshold) continue;
                    
                                    checkY = true;  
                    
                                    result[dy + x] = 1; 
                                    visited[dy + x] = 1;
                    
                                    xl = x - 1;
                                    
                                    while (xl > -1) {
                                        dyl = dy + xl;
                                        i = dyl * bytes; 
                                        if (visited[dyl] === 1) break; 
                                        
                                        c = data[i] - sampleColor[0]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                                        c = data[i + 1] - sampleColor[1]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                                        c = data[i + 2] - sampleColor[2]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                    
                                        result[dyl] = 1;
                                        visited[dyl] = 1;
                    
                                        xl--;
                                    }
                                    xr = x + 1;
                                    
                                    while (xr < w) {
                                        dyr = dy + xr;
                                        i = dyr * bytes; 
                                        if (visited[dyr] === 1) break; 
                                        c = data[i] - sampleColor[0]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                                        c = data[i + 1] - sampleColor[1]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                                        c = data[i + 2] - sampleColor[2]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                    
                                        result[dyr] = 1;
                                        visited[dyr] = 1;
                    
                                        xr++;
                                    }
                    
                                    
                                    if (xl < minX) minX = xl + 1;
                                    if (xr > maxX) maxX = xr - 1;
                    
                                    newY = el.y - el.dir;
                                    if (newY >= 0 && newY < h) { 
                                        if (xl < el.left) stack.push({ y: newY, left: xl, right: el.left, dir: -el.dir }); 
                                        if (el.right < xr) stack.push({ y: newY, left: el.right, right: xr, dir: -el.dir }); 
                                    }
                                    newY = el.y + el.dir;
                                    if (newY >= 0 && newY < h) { 
                                        if (xl < xr) stack.push({ y: newY, left: xl, right: xr, dir: el.dir }); 
                                    }
                                }
                                
                                if (checkY) {
                                    if (el.y < minY) minY = el.y;
                                    if (el.y > maxY) maxY = el.y;
                                }
                            } while (stack.length > 0);
                    
                            return {
                                data: result,
                                width: image.width,
                                height: image.height,
                                bounds: {
                                    minX: minX,
                                    minY: minY,
                                    maxX: maxX,
                                    maxY: maxY
                                }
                            };
                        };
                    
                        function floodFillWithBorders(image, px, py, colorThreshold, mask) {
                    
                            var c, x, newY, el, xr, xl, dy, dyl, dyr, checkY,
                                data = image.data,
                                w = image.width,
                                h = image.height,
                                bytes = image.bytes, 
                                maxX = -1, minX = w + 1, maxY = -1, minY = h + 1,
                                i = py * w + px, 
                                result = new Uint8Array(w * h), 
                                visited = new Uint8Array(mask ? mask : w * h); 
                    
                            if (visited[i] === 1) return null;
                    
                            i = i * bytes; 
                            var sampleColor = [data[i], data[i + 1], data[i + 2], data[i + 3]]; 
                    
                            var stack = [{ y: py, left: px - 1, right: px + 1, dir: 1 }];
                            do {
                                el = stack.shift(); 
                    
                                checkY = false;
                                for (x = el.left + 1; x < el.right; x++) {
                                    dy = el.y * w;
                                    i = (dy + x) * bytes; 
                    
                                    if (visited[dy + x] === 1) continue; 
                    
                                    checkY = true;  
                    
                                    result[dy + x] = 1; 
                                    visited[dy + x] = 1; 
                    
                                    
                                    c = data[i] - sampleColor[0]; 
                                    if (c > colorThreshold || c < -colorThreshold) continue;
                                    c = data[i + 1] - sampleColor[1]; 
                                    if (c > colorThreshold || c < -colorThreshold) continue;
                                    c = data[i + 2] - sampleColor[2]; 
                                    if (c > colorThreshold || c < -colorThreshold) continue;
                    
                                    xl = x - 1;
                                    
                                    while (xl > -1) {
                                        dyl = dy + xl;
                                        i = dyl * bytes; 
                                        if (visited[dyl] === 1) break; 
                    
                                        result[dyl] = 1;
                                        visited[dyl] = 1;
                                        xl--;
                    
                                        
                                        c = data[i] - sampleColor[0]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                                        c = data[i + 1] - sampleColor[1]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                                        c = data[i + 2] - sampleColor[2]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                                    }
                                    xr = x + 1;
                                    
                                    while (xr < w) {
                                        dyr = dy + xr;
                                        i = dyr * bytes; 
                                        if (visited[dyr] === 1) break; 
                    
                                        result[dyr] = 1;
                                        visited[dyr] = 1;
                                        xr++;
                    
                                       
                                        c = data[i] - sampleColor[0]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                                        c = data[i + 1] - sampleColor[1]; 
                                        if (c > colorThreshold || c < -colorThreshold) break;
                                        c = data[i + 2] - sampleColor[2];
                                        if (c > colorThreshold || c < -colorThreshold) break;
                                    }
                    
                                    
                                    if (xl < minX) minX = xl + 1;
                                    if (xr > maxX) maxX = xr - 1;
                    
                                    newY = el.y - el.dir;
                                    if (newY >= 0 && newY < h) { 
                                        if (xl < el.left) stack.push({ y: newY, left: xl, right: el.left, dir: -el.dir }); 
                                        if (el.right < xr) stack.push({ y: newY, left: el.right, right: xr, dir: -el.dir }); 
                                    }
                                    newY = el.y + el.dir;
                                    if (newY >= 0 && newY < h) { 
                                        if (xl < xr) stack.push({ y: newY, left: xl, right: xr, dir: el.dir }); 
                                    }
                                }
                                
                                if (checkY) {
                                    if (el.y < minY) minY = el.y;
                                    if (el.y > maxY) maxY = el.y;
                                }
                            } while (stack.length > 0);
                    
                            return {
                                data: result,
                                width: image.width,
                                height: image.height,
                                bounds: {
                                    minX: minX,
                                    minY: minY,
                                    maxX: maxX,
                                    maxY: maxY
                                }
                            };
                        };

 lib.gaussBlur = function(mask, radius) {

        var i, k, k1, x, y, val, start, end,
            n = radius * 2 + 1, // size of the pattern for radius-neighbors (from -r to +r with the center point)
            s2 = radius * radius,
            wg = new Float32Array(n), // weights
            total = 0, // sum of weights(used for normalization)
            w = mask.width,
            h = mask.height,
            data = mask.data,
            minX = mask.bounds.minX,
            maxX = mask.bounds.maxX,
            minY = mask.bounds.minY,
            maxY = mask.bounds.maxY;

        // calc gauss weights
        for (i = 0; i < radius; i++) {
            var dsq = (radius - i) * (radius - i);
            var ww = Math.exp(-dsq / (2.0 * s2)) / (2 * Math.PI * s2);
            wg[radius + i] = wg[radius - i] = ww;
            total += 2 * ww;
        }
        // normalization weights
        for (i = 0; i < n; i++) {
            wg[i] /= total;
        }

        var result = new Uint8Array(w * h), // result mask
            endX = radius + w,
            endY = radius + h;

        //walk through all source points for blur
        for (y = minY; y < maxY + 1; y++)
            for (x = minX; x < maxX + 1; x++) {
                val = 0;
                k = y * w + x; // index of the point
                start = radius - x > 0 ? radius - x : 0;
                end = endX - x < n ? endX - x : n; // Math.min((((w - 1) - x) + radius) + 1, n);
                k1 = k - radius;
                // walk through x-neighbors
                for (i = start; i < end; i++) {
                    val += data[k1 + i] * wg[i];
                }
                start = radius - y > 0 ? radius - y : 0;
                end = endY - y < n ? endY - y : n; // Math.min((((h - 1) - y) + radius) + 1, n);
                k1 = k - radius * w;
                // walk through y-neighbors
                for (i = start; i < end; i++) {
                    val += data[k1 + i * w] * wg[i];
                }
                result[k] = val > 0.5 ? 1 : 0;
            }

        return {
            data: result,
            width: w,
            height: h,
            bounds: {
                minX: minX,
                minY: minY,
                maxX: maxX,
                maxY: maxY
            }
        };
    };

    lib.gaussBlur = function(mask, radius) {

        var i, k, k1, x, y, val, start, end,
            n = radius * 2 + 1, 
            s2 = radius * radius,
            wg = new Float32Array(n), 
            total = 0, 
            w = mask.width,
            h = mask.height,
            data = mask.data,
            minX = mask.bounds.minX,
            maxX = mask.bounds.maxX,
            minY = mask.bounds.minY,
            maxY = mask.bounds.maxY;

        
        for (i = 0; i < radius; i++) {
            var dsq = (radius - i) * (radius - i);
            var ww = Math.exp(-dsq / (2.0 * s2)) / (2 * Math.PI * s2);
            wg[radius + i] = wg[radius - i] = ww;
            total += 2 * ww;
        }
       
        for (i = 0; i < n; i++) {
            wg[i] /= total;
        }

        var result = new Uint8Array(w * h), 
            endX = radius + w,
            endY = radius + h;

       
        for (y = minY; y < maxY + 1; y++)
            for (x = minX; x < maxX + 1; x++) {
                val = 0;
                k = y * w + x; 
                start = radius - x > 0 ? radius - x : 0;
                end = endX - x < n ? endX - x : n; 
                k1 = k - radius;
                
                for (i = start; i < end; i++) {
                    val += data[k1 + i] * wg[i];
                }
                start = radius - y > 0 ? radius - y : 0;
                end = endY - y < n ? endY - y : n; 
                k1 = k - radius * w;
                
                for (i = start; i < end; i++) {
                    val += data[k1 + i * w] * wg[i];
                }
                result[k] = val > 0.5 ? 1 : 0;
            }

        return {
            data: result,
            width: w,
            height: h,
            bounds: {
                minX: minX,
                minY: minY,
                maxX: maxX,
                maxY: maxY
            }
        };
    };
           
    
                         return lib;
                         
                    })(); 
               
                    var magic = function () {
                        
                        if (imageInfo.width>0 && imageInfo.height>0) {
                          var image = {
                            data: imageInfo.data,
                            width: imageInfo.width,
                            height: imageInfo.height,
                            bytes: 4
                          };
                          mask = MagicWand.floodFill(image, downPoint.x, downPoint.y, thickness,undefined,true);
                          mask = MagicWand.gaussBlur(mask,5);
                          
                          floodFillPoints=mask.data;
                       
                          drawInside(1);
                        
                        }
                      };

                     

                    var drawInside = function(selectedIndex)
                    {
                      
                        var points = floodFillPoints;
                        var x, y,
                        w = imageInfo.width,
                        h = imageInfo.height,
                        ctx = imageInfo.context,
                        isFirst =true;  
  
                        ctx.lineCap="butt";
                        ctx.lineJoin="mutter";
                        ctx.lineWidth=1;
                        ctx.beginPath();
     
                        magicPoints.push(floodFillPoints);
  for(var k=0;k<points.length;k++)
    {
      if(points[k]==selectedIndex)
        {
           x = k % imageInfo.width;
          y = k/imageInfo.width;
        
          
          if(isFirst)
            {
              ctx.moveTo(x, y);
              isFirst = false;
            }
        
          ctx.lineTo(x, y);
         
          
        }
      
    }
   
      ctx.globalCompositeOperation = 'destination-out';
      ctx.stroke();
  
  
  

}

        var canvas = document.getElementById('canvas');
        var backCanvas = document.createElement('canvas');
        var backCtx = backCanvas.getContext('2d');
        
        var imageInfo = {
            width: 0,
            height: 0,
            context: canvas.getContext("2d")
          };

        canvas.width = $(document).width()-15;
        
        canvas.height = $(document).height()-20;  
        backCanvas.width = canvas.width;
        backCanvas.height = canvas.height;

        var ctx = canvas.getContext('2d');
        
        var canvasx = $(canvas).offset().left;
        var canvasy = $(canvas).offset().top;
        var last_mousex = last_mousey = 0;
        var mousex = mousey = 0;
        var mousedown = false;
        var tooltype = 'erase';
        var image = new Image();
        var brushWidth = 10;
        var context;
        image.onload = drawImageActualSize;
        
        
    

        function onReceive(event) {
          
            alert('on receive '+event.data);
            var video = document.getElementById('video');
            video.setAttribute('src',event.data);
            video.play();
            
         
        }

        //for android
       // document.addEventListener("message", onReceive);

        //for IOS
        window.addEventListener("message", onReceive); 
        
		function compressImage (base64) {
            const canvas1 = document.createElement('canvas1')
            const img = document.createElement('img')
          
            return new Promise((resolve, reject) => {
              img.onload = function () {
                let width = img.width
                let height = img.height
                const maxHeight = 200
                const maxWidth = 200
          
                if (width > height) {
                  if (width > maxWidth) {
                    height = Math.round((height *= maxWidth / width))
                    width = maxWidth
                  }
                } else {
                  if (height > maxHeight) {
                    width = Math.round((width *= maxHeight / height))
                    height = maxHeight
                  }
                }
                canvas1.width = width
                canvas1.height = height
          
                const ctx = canvas1.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
          
                resolve(canvas1.toDataURL('image/jpeg', 0.7))
              }
              img.onerror = function (err) {
                reject(err)
              }
              img.src = base64
            })
          }
        function initiateListeners()
        {
        $('#canvas').on('click', function (e) {
            if(rubberIndex==1)
            {
              
              var p = $(e.target).offset(),
                  x = Math.round((e.clientX || e.pageX) - p.left),
                  y = Math.round((e.clientY || e.pageY) - p.top);    
              downPoint = { x: x, y: y };    
              magic();
             
             imageHistory.push(canvas.toDataURL('image/png'));

             
                
             
               
            }
            });
        
        canvas.addEventListener('touchstart', function (e) {
         var xyPoints ={};

         rubberPoints = [];         
        if(rubberIndex==0)
        {
            last_mousex = mousex = parseInt(e.touches[0].clientX - canvasx);
            last_mousey = mousey = parseInt(e.touches[0].clientY - canvasy);
            xyPoints.x=last_mousex;
            xyPoints.y=last_mousey;
            xyPoints.brushWidth = brushWidth;
            xyPoints.tooltype = tooltype;
            rubberPoints.push(xyPoints);
            mousedown = true;

        }
        });
        
        
        canvas.addEventListener('touchend', function (e) {
           
            if(rubberIndex==0)
            {    
            mousedown = false;
             
            imageHistory.push(canvas.toDataURL('image/png'));
           
           


            }
            
        

        });
        
        
        canvas.addEventListener('touchmove', function (e) {
            if(rubberIndex==0)
            {
                var xyPoints ={};                
        mousex = parseInt(e.touches[0].clientX - canvasx);
        mousey = parseInt(e.touches[0].clientY - canvasy);
        if (mousedown) {
        context = ctx;
        ctx.beginPath();
        if (tooltype == 'draw') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = brushWidth;
        } else {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = brushWidth;
        }
        ctx.moveTo(last_mousex, last_mousey);
        xyPoints.x = mousex;
        xyPoints.y = mousey;
        xyPoints.brushWidth = brushWidth; 
        xyPoints.tooltype = tooltype;
        rubberPoints.push(xyPoints);
        ctx.lineTo(mousex, mousey);
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.stroke();
        }
        last_mousex = mousex;
        last_mousey = mousey;
        
    }
        });
    }

        initiateListeners();
        
        use_tool = function (tool) {
          tooltype = tool;
        }
        
        function drawImageActualSize() {
          //  alert('on draw actual image');
            imageInfo.width = $(document).width()-10;
            imageInfo.height = $(document).height()-20;
            ctx.drawImage(this, 0, 0, this.width, this.height,0,0,$(document).width()-10,$(document).height()-20);
            imageInfo.data = ctx.getImageData(0, 0, imageInfo.width, imageInfo.height).data;
            if(overrideLastImage)
            {
                var overAllImage = new Image();
                overAllImage.onload = async function(){
                    overrideLastImage = false;
                    image = this;
                    $("#coverScreen").hide();
                    window.ReactNativeWebView.postMessage('{"separatorenable":"false"}');

                }
                overAllImage.src = canvas.toDataURL('image/png');

            }
            imageBackup=canvas.toDataURL('image/png',0.1);
           
            
          


        }
        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        function undo()
        {
            
           
            redrawItAll();            
          

        }
        function share()
        {
          
            window.ReactNativeWebView.postMessage('{"imageData":"'+canvas.toDataURL('image/png')+'"}');
         

           
            

        }

        function reset()
        {
            
             rubberIndex=1;
             imageBackup = (function () { return; })();
             imageForBody = (function () { return; })();
             overrideLastImage = false;
             floodFillPoints="";
             magicPoints = [];
             imageHistory = [];
             rubberPoints = [];
             rubberPointsOverall = []; 
             isinitial = true;
             lastPrediction="";
             image.onload = drawImageActualSize;
            refreshCanvas(undefined);
          
          

        }

        function refreshCanvas(imageStr)
        {
           
            $('#canvas').remove();
            var canvasElement = $('<canvas id="canvas" style="border: 1px solid black; background-color: transparent;"></canvas>');
            canvasElement.appendTo('body');
            canvas = document.getElementById('canvas');
            canvas.width = $(document).width()-15;
            canvas.height = $(document).height()-20;
            ctx = canvas.getContext('2d');
            context = ctx;
            canvasx = $(canvas).offset().left;
            canvasy = $(canvas).offset().top; 
            imageInfo.context = ctx;
            initiateListeners();
            if(imageStr)
            implementImage(imageStr);

        }
		function compressImage (base64) {
            const canvas1 = document.createElement('canvas1')
            const img = document.createElement('img')
          
            return new Promise((resolve, reject) => {
              img.onload = function () {
                let width = img.width
                let height = img.height
                const maxHeight = 200
                const maxWidth = 200
          
                if (width > height) {
                  if (width > maxWidth) {
                    height = Math.round((height *= maxWidth / width))
                    width = maxWidth
                  }
                } else {
                  if (height > maxHeight) {
                    width = Math.round((width *= maxHeight / height))
                    height = maxHeight
                  }
                }
                canvas1.width = width
                canvas1.height = height
          
                const ctx = canvas1.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
          
                resolve(canvas1.toDataURL('image/jpeg', 0.1))
              }
              img.onerror = function (err) {
                reject(err)
              }
              img.src = base64
            })
          }
        function detectBody(imageStr,bodypartArray)
        {
            $("#coverScreen").show();
           
            $('#canvas').remove();
            var canvasElement = $('<canvas id="canvas" style="border: 1px solid black; background-color: transparent;"></canvas>');
            canvasElement.appendTo('body');
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');
            canvasx = $(canvas).offset().left;
            canvasy = $(canvas).offset().top; 
            imageInfo.context = ctx;
            initiateListeners();
            var imageCopy = new Image()
            var lastImage = new Image()
            lastImage.src = canvas.toDataURL() 
            imageCopy.src = imageStr;
         
            imageCopy.onload = async function(){
            try
            {   
			const net = await bodyPix.load();
			const partSegmentation = await net.segmentPersonParts(this, {
            flipHorizontal: false,
            internalResolution: 'medium',
            segmentationThreshold: 0.7});
            var isBodyPart = false;
            var bodyParts = partSegmentation.data;
                 
            for(var z=0;z<bodyParts.length;z++)
            {
               if(bodyParts[z]>0)
               {
                   isBodyPart = true;

               }

            }
            if(!isBodyPart)
            {
                window.ReactNativeWebView.postMessage('{"title":"Check your picture","message":"hmmm..no person available in the picture, Please upload/take picture with person on it by reseting existing one"}')
                window.ReactNativeWebView.postMessage('{"resetpartselect":"true"}')
                
            }

			const backgroundBlurAmount = 3;
			const edgeBlurAmount = 3;
			const flipHorizontal = false;
            const faceBodyPartIdsToBlur = [12,2,3,4,5];
		    bodyPix.blurBodyPart(canvas, this, partSegmentation, bodypartArray,backgroundBlurAmount, edgeBlurAmount, flipHorizontal,image);
            refreshCanvas(imagedata_to_image(canvas.getContext("2d").getImageData(0,0,this.width,this.height)));
            }
            catch(err)
            {
                refreshCanvas(undefined);
                window.postMessage('{"alerttitle":"Check your picture","alertmessage":"hmmm..no person available in the picture"}')
                

            }
            $("#coverScreen").hide();
        };

          

        }
        function imagedata_to_image(imagedata) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = imagedata.width;
            canvas.height = imagedata.height; 
            ctx.putImageData(imagedata, 0, 0);
            imageHistory.push(canvas.toDataURL());  
            
            return  canvas.toDataURL();
        }

        function implementImage(imageStr)
        {
            var imageB = new Image();
            imageB.src = imageStr;
            imageB.onload = drawImageActualSize;
            

        }

        function redrawItAll()
        {
           
            
            if(imageHistory.length>0)
            {
                document.imageBackup = new Image();
                window.ReactNativeWebView.postMessage('{"separatorenable":"false"}');
                document.imageBackup.onload = function()
                {
                        image = this;
                        window.ReactNativeWebView.postMessage('{"separatorenable":"true"}');

                } 
                document.imageBackup.src = imageHistory[imageHistory.length-2]; 
                refreshCanvas(imageHistory[imageHistory.length-2]);
                imageHistory[imageHistory.length-2]
                imageHistory =  imageHistory.slice(0, imageHistory.length-1);
                
            }

        }

        async function loadAndPredict(image) {
          
            
            const net = await bodyPix.load();
            
            if(net)
            $("#title").text("loadandpredict");
            const segmentation = await net.segmentPersonParts(image, {
            flipHorizontal: false,
            internalResolution: 'medium',
            segmentationThreshold: 0.7
      });
            $("#title").text("loadandpredict");
            lastPrediction = segmentation;

            
          }

        function  redrawRubber()
        {
            rubberPointsOverAll = rubberPointsOverAll.pop()
            if(rubberPointsOverAll.length>0)
            for(var j=0;j<rubberPointsOverAll.length;j++)
        {
            var rubberPoints=rubberPointsOverAll[j];
            for(var i=0;i<rubberPoints.length;i++)
        {
            if(i==0)
            {
                last_mousex = rubberPoints[i].x;
                last_mousey = rubberPoints[i].y;

            }

    else{
            mousex = rubberPoints[i].x;
            mousey = rubberPoints[i].y;
            tooltype = rubberPoints[i].tooltype;
            brushWidth = rubberPoints[i].brushWidth;
            context = ctx;
            ctx.beginPath();
            if (tooltype == 'draw') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = brushWidth;
            } else {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = brushWidth;
            }
            ctx.moveTo(last_mousex, last_mousey);
          
            ctx.lineTo(mousex, mousey);
            ctx.lineJoin = ctx.lineCap = 'round';
            ctx.stroke();
            last_mousex = mousex;
            last_mousey = mousey;
            }
            

        }   
        }

        }


        }());
            </script>
        </body>
        
        </html>`;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (

                
                <View style={{ flex: 1 }}
                    ref={ref => {
                        this.parentView = ref;
                    }}
                >
                    
                    
                   
                   
                   

                    <Camera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={{
                            flex: 1,
                            flexDirection: 'column'

                        }} type={this.state.type}>


                        <WebView

                            source={{ html: html }}
                            useWebKit={true}
                            scrollEnabled={false}
                            style={{
                                flex: 1,
                                flexDirection: "column",
                                backgroundColor: 'transparent'

                            }}
                            ref={ref => {
                                this.webview = ref
                            }}
                            javaScriptEnabledAndroid={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            onMessage={this.onMessage.bind(this)} />


<View
                        style={{

                            flex: 0.35,
                            flexDirection: "column",
                            left: 0,
                            bottom: 0,
                            backgroundColor: 'transparent',
                            zIndex: 3

                        }}>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: "column"

                            }}
                        >
                            <View
                                style={{

                                    flexDirection: "row",
                                    width: '100%',
                                    justifyContent: "space-between"

                                }}
                            >

                                <View
                                    style={{

                                        flexDirection: "row",
                                        width: '100%',
                                        justifyContent: "space-between"

                                    }}
                                >
                                    <TouchableHighlight
                                        style={{
                                            width: '30%',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "rgba(255,255,255,0.5)"


                                        }}


                                    >

                                        <TouchableHighlight
                                            style={{

                                                height: 50,
                                                width: '100%',

                                                backgroundColor: 'transparent'

                                            }}

                                        


                                        >

                                            <View
                                                flexDirection='row'
                                                style={{
                                                    margin: '2%',
                                                    justifyContent: 'space-around'

                                                }}
                                            >
                                                <TouchableHighlight
                                                    style={{

                                                        backgroundColor: 'transparent'
                                                    }}
                                                    
                                                >
                                                    <MaterialCommunityIcons name="eraser" size={32} color={this.state.brush2}
                                                    onPress={() => this.handleColor('red', 'green', 'black', 'black', 'black')}
                                                    />
                                                </TouchableHighlight>

                                                <TouchableHighlight
                                                    style={{

                                                        backgroundColor: 'transparent'
                                                    }}

                                                   
                                                >
                                                    <SimpleLineIcons name="magic-wand" size={32} color={this.state.brush1}
                                                     onPress={() => this.handleColor('green', 'red', 'black', 'black', 'black')}
                                                    />
                                                </TouchableHighlight>


                                            </View>


                                        </TouchableHighlight>

                                    </TouchableHighlight>

                                    <TouchableHighlight
                                        style={{
                                            width: '60%',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "rgba(255,255,255,0.5)"


                                        }}
                                      
                                    >

                                        <TouchableHighlight
                                            style={{
                                                margin: 2,
                                                height: 40,
                                                width: '100%',
                                                borderRadius: 40,
                                                backgroundColor: 'transparent'

                                            }}
                                            
                                        >


                                            <View
                                                style={{
                                                    width: '100%',
                                                    flex: 1,
                                                    flexDirection: 'column',
                                                    alignSelf: 'stretch'

                                                }}
                                            >

                                                <Slider
                                                    style={{ flex: 0.50,flexDirection: 'column', width: '100%' }}
                                                    value={this.state.value}
                                                    onValueChange={this.rubberThickness.bind(this)}
                                                    minimumValue={2}
                                                    maximumValue={25}

                                                />

                                                 <Text style={{  flex: 0.50,
                                                 marginTop:8,
                                                     flexDirection: 'column' }}>{this.state.rubbertype}{this.state.progress}</Text>


                                            </View>

                                        </TouchableHighlight>

                                    </TouchableHighlight>

                                    <TouchableHighlight
                                        style={{
                                            width: '10%',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "rgba(255,255,255,0.5)"


                                        }}
                                        onPress={() => this.shareOnWebView()}
                                    >

                                        <TouchableHighlight
                                            style={{
                                                margin: 2,
                                                height: 40,
                                                width: '100%',
                                                borderRadius: 40,
                                             
                                            }}
                                            
                                        >


                                            <View
                                                style={{
                                                    width: '100%',
                                                    flex: 1,
                                                    alignSelf: 'stretch'

                                                }}
                                            >

                                                <Entypo name="share" size={32} color="green" onPress={() =>  this.shareOnWebView()} />


                                            </View>

                                        </TouchableHighlight>

                                    </TouchableHighlight>



                                </View>






                            </View>

                            <View   >                        
                            <SelectableGrid
                             data={this.state.data}
                            maxSelect = {8}
                             maxPerRow = {4}
                                height = {35}
                                unselectedStyle={{backgroundColor: 'rgba(255,255,255,0.5)' }}
                                selectedStyle={{ backgroundColor: '#87ceeb'}}
  key ={this.state.key}
  onSelect={this.organselector.bind(this)}
  ref={(ref) => {
    this.sbRef = ref;
  }}
  unselectedRender={data => (
    <View>
    
      <Image style={{ height: 20, width: 20 }} source={data.logo}/>
    </View>
  )}
  selectedRender={data => (
    <View>
      <Image style={{ height: 20, width: 20 }} source={data.logo}/>
    </View>
  )}
/>
{ this.state.showseparator?
<View style={{ height:100,
    width:"100%",
    height:"100%",
    backgroundColor:'black',
    position: 'absolute',
    top:0,
    left:0}} >

<AnimatedEllipsis numberOfDots={23} animationDelay={70} />

    </View>:null

}
</View>


                            <View
                                style={{

                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    backgroundColor: 'rgba(255,255,255,0.5)'

                                }}

                            >



                                
                                
                               <MaterialIcons name="clear" size={40} color="black"  onPress={this.resetToPreviousBehaviour.bind(this)} />
                                <MaterialCommunityIcons name="folder-upload" size={40} color="black" onPress={this._imagPicker.bind(this)} />
                                <Entypo name="camera" size={70} color={this.state.cameracolor} onPress={this.captureAndSend}/>
                                
                                <FontAwesome name="undo" size={40} color="black" onPress={this.undoToPreviousBehaviour.bind(this)}  />

                                <MaterialIcons name="switch-camera" size={40} color="black"  onPress={this.reverseCamera.bind(this)} />
                              




                            </View>


                        </View>


                    </View>





                    </Camera>
                    
                    





                </View>
            );
        }
    }


} 