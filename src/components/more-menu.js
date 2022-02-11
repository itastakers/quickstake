import React from "react";
import { useState, useContext } from "react";
import { GlobalContext } from "../context/store";
import { Button, Menu, MenuItem, Box } from "@mui/material";
import RedeemIcon from '@mui/icons-material/Redeem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UnbondingModal from "./modals/unbonding-modal";
import RedelegateModal from "./modals/redelegate-modal";
import RewardsModal from "./modals/rewards-modal";
import GrantPermissionModal from "./modals/grantPermission-modal"
const MoreMenu = () => {
    const [state] = useContext(GlobalContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalUnbondingOpen, setModalUnbondingOpen] = useState(false);
    const [modalRedelegateOpen, setModalRedelegateOpen] = useState(false);
    const [modalRewardsOpen, setModalRewardsOpen] = useState(false);
    const [modalGrantPermissionOpen, setModalGrantPermissionOpen] = useState(false)
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="success"
                    disableElevation
                    onClick={() => setModalRewardsOpen(true)}
                    endIcon={<RedeemIcon />}
                    sx={{ mr: 2 }}
                >
                    Rewards
                </Button>
                <Button
                    id="basic-button"
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    color="primary"
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDownIcon />}
                >
                    More
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={() => { handleClose(); setModalUnbondingOpen(true) }}>Unbonding Assets</MenuItem>
                    <MenuItem onClick={() => { handleClose(); setModalRedelegateOpen(true) }}>Redelegate Assets</MenuItem>
                    <MenuItem onClick={() => { handleClose(); setModalGrantPermissionOpen(true) }}>Grant Permission</MenuItem>
                </Menu>
            </Box>
            <UnbondingModal
                open={modalUnbondingOpen}
                handleClose={() => {
                    setModalUnbondingOpen(false);
                }}
            />
            <RedelegateModal
                open={modalRedelegateOpen}
                handleClose={() => {
                    setModalRedelegateOpen(false);
                }}
            />
            <RewardsModal
                open={modalRewardsOpen}
                handleClose={() => {
                    setModalRewardsOpen(false);
                }}
            />
            <GrantPermissionModal
                open={modalGrantPermissionOpen}
                handleClose={() => {
                    setModalGrantPermissionOpen(false);
                }}
            />
        </>
    )
}

export default MoreMenu;