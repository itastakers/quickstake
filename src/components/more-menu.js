import React from "react";
import { useState } from "react";
import { Button, Menu, MenuItem, Box } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UnbondingModal from "./unbonding-modal";
import RedelegateModal from "./redelegate-modal";

const MoreMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalUnbondingOpen, setModalUnbondingOpen] = useState(false);
    const [modalRedelegateOpen, setModalRedelegateOpen] = useState(false);
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
        </>
    )
}

export default MoreMenu;