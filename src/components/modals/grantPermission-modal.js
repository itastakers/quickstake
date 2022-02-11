import React, { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { GlobalContext } from "../../context/store";
import { grantPermission, withdrawReward, getAllRewards, withdrawAllRewards } from "../../utils/cosmos";
export default function GrantPermissionModal({ open, handleClose }) {
  const [state, dispatch] = useContext(GlobalContext);
  const handleCloseModal = () => {
    handleClose()
  };
  const [permissionType, setPermissionType] = useState('');
  const [permissionAddress,setPermissionAddress] = useState('');

  useEffect(() => {
   if(open){
     setPermissionType('')
     setPermissionAddress('')
   }
  }, [open]);
  const handleChangeType = (event) => {
    console.log(event.target.value)
    setPermissionType(event.target.value);
  };
  const handleChangeAddress = (event) =>{
    console.log(event.target.value)
    setPermissionAddress(event.target.Value)
  }
  const saveGrantPermission = async () => {
    grantPermission(state.chain, state.signingClient, state.address, permissionAddress, permissionType)
      .then(res => {
       console.log(res,"res====================>")
      })
      .catch(e => {
        console.log(e,"error====================>")
      })
  }
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Grant Permission
        </DialogTitle>
        {state.address ? (
          <React.Fragment>
            <DialogContent>
              <Box pb={3} sx={{ minWidth: 380 }}>
                <TextField
                  sx={{ width: '100%' }}
                  id="permission-address"
                  label="Address"
                  value={permissionAddress?permissionAddress:''}
                  onChange={(e)=>setPermissionAddress(e.target.value)}
                  variant="standard"
                />
              </Box>
              <FormControl variant="standard" sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-autowidth-label">Permission</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={permissionType}
                  onChange={handleChangeType}
                  autoWidth
                  label="Permission Type"
                >
                  <MenuItem value={"withdraw_reward"}>Withdraw Reward</MenuItem>
                  <MenuItem value={"vote"}>Vote</MenuItem>
                  <MenuItem value={"delegate"}>Delegate</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Box pb={3} px={3}>
                <Button variant="contained" onClick={saveGrantPermission}>Save</Button>
              </Box>
            </DialogActions>
          </React.Fragment>
        ) : (
          <Box pb={3} sx={{ minWidth: 380 }}>
            <Alert severity="error">Please connect your wallet!</Alert>
          </Box>
        )}
      </Dialog>
    </div>
  );
}