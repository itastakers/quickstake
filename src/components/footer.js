import React from "react";
import { Grid, List, ListItem, Typography, Link, Divider } from "@mui/material";
import { Twitter, GitHub, YouTube } from '@mui/icons-material';
import { StaticImage } from "gatsby-plugin-image";

const Footer = () => {
    return (
        <Grid container sx={{ mt: 4 }}>
            <Grid item xs={12} md={4} alignSelf="center">
                <StaticImage src="../images/logo_square.svg" alt="ITA Stakers Logo" />
            </Grid>
            <Grid item xs={0} md={2} />
            <Grid item xs={4} md={2}>
                <Typography variant="h6">
                    <strong>Validators</strong>
                </Typography>
                <List dense>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://explorebitsong.com/staking/bitsongvaloper1fkj2cn209yeexxyets98evrcmmds23hck0lyzq">Bitsong</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://explorer.sentinel.co/validator/sentvaloper1z2qgaj3flw2r2gdn7yq22623p7adykwg8fw93z">Sentinel</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://www.mintscan.io/iris/validators/iva1d0cs3cv2mkzhu2xq2gskxcpfk3e7jyzzp8e8s4">Iris Network</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://morpheus.desmos.network/validators/desmosvaloper1u0dae8r8hay6r2gvccegg2fz6ryftf2wfnj5ft">Desmos</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://www.mintscan.io/persistence/validators/persistencevaloper1l6tn2xgtch3nv6a5aezfswd5uecww62uh3gwy4">Persistence</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="#">Juno</Link>
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={4} md={2}>
                <Typography variant="h6">
                    <strong>Medium</strong>
                </Typography>
                <List dense>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://itastakers.com/blog/category/news">News</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://itastakers.com/blog/category/general">General</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://itastakers.com/blog/category/tutorials">Tutorials</Link>
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={4} md={2}>
                <Typography variant="h6">
                    <strong>Github</strong>
                </Typography>
                <List dense>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://copernicus.itastakers.com/">Copernicus</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://sentinel-turing-4.itastakers.com/">Kepler IBC Sentinel</Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link color="inherit" sx={{ lineHeight: 1.5 }} underline="hover" variant="body1" href="https://cosmic.bet/">Cosmic</Link>
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
                <Link href="https://twitter.com/itastakers" color="inherit" underline="none">
                    <Twitter />
                </Link>
                <Link sx={{ pl: 3 }} href="https://github.com/itastakers" color="inherit" underline="none">
                    <GitHub />
                </Link>
                <Link sx={{ pl: 3 }} href="https://www.youtube.com/channel/UCaobj3KMp76sUSBVZqO4DTA" color="inherit" underline="none">
                    <YouTube />
                </Link>
            </Grid>
        </Grid>

    );
};

export default Footer;
