import React from "react";
import { Grid, List, ListItem, Typography, Link, Divider } from "@mui/material";
import { Twitter, GitHub, YouTube } from '@mui/icons-material';
import { StaticImage } from "gatsby-plugin-image";

const Footer = () => {
    return (
        <Grid container sx={{ mt: 4 }}>
            <Grid item xs={12} md={4} alignSelf="center">
                <StaticImage src="../images/logo-dark-itastakers.png" alt="Logo" />
            </Grid>
            <Grid item xs={0} md={2} />
            <Grid item xs={4} md={2}>
                <Typography variant="h6">
                    <strong>Validators</strong>
                </Typography>
                <List dense>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={4} md={2}>
                <Typography variant="h6">
                    <strong>Medium</strong>
                </Typography>
                <List dense>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={4} md={2}>
                <Typography variant="h6">
                    <strong>Github</strong>
                </Typography>
                <List dense>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">News</Link>
                    </ListItem>
                </List>
            </Grid>
            <Grid item sx={{ py: 3 }} xs={12}>
                <Divider flexItem />
            </Grid>
            <Grid item sx={{ pb: 3 }} display="flex" xs={6}>
                <Typography variant="body1">
                    © ITA Stakers {(new Date().getFullYear())}
                </Typography>
            </Grid>
            <Grid item sx={{ pb: 3 }} display="flex" justifyContent="flex-end" xs={6}>
                <Link href="#" color="inherit" underline="none">
                    <Twitter />
                </Link>
                <Link sx={{ pl: 3 }} href="#" color="inherit" underline="none">
                    <GitHub />
                </Link>
                <Link sx={{ pl: 3 }} href="#" color="inherit" underline="none">
                    <YouTube />
                </Link>
            </Grid>
        </Grid>

    );
};

export default Footer;
