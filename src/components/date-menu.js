import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { Hidden, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from 'src/contexts/AuthUserContext';

export default function BasicMenu({callback, month}) {
  const { authUser } = useAuth();
  const [value, setValue] = React.useState(dayjs(month));

  console.log(dayjs(month))

 

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const handleItemClick = async (date) => {
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/changeMonth?company=${authUser.companyId}`).then((res) => {
      if (res.data.error) {
          console.log(res.data.error);
      }})
    console.log({"Here:":date})
    callback(date)
    
  }
  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{display:"flex", flexDirection:'row', alignItems:'center', justifyContent:'center', gap:'10px'}}>
      <Hidden smDown={true}>
      <Typography>Select Month:</Typography>
      </Hidden>

<DatePicker
          views={['year', 'month']}
          label="Year and Month"
          minDate={dayjs('2012-03-01')}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            handleItemClick(dayjs(newValue?.$y + "-" + (newValue?.$M + 1) + "-" + "01").$d);

          }}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
    </Box>
    </LocalizationProvider>
    
  );
}