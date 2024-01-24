
import React from 'react';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

const CustomSwitch = withStyles((theme) => ({
  // on checked unchecked change the thumb(ball) color
  switchBase: {
    color: "#000000", // this is working
    "&$checked": { // this is not working
      color: "#fff"
    }
  },
  // change the swithc  background color
  colorSecondary: {
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#28A909",
      color:"#000000"
    }
  },
  track: {
    backgroundColor: "#767B85"
  },
  checked:{}
}))(Switch);


export default CustomSwitch;