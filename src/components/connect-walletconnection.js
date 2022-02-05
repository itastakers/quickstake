import React, { useContext, useState, useMemo, useEffect } from "react";
import ReactDOM from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import { StaticImage } from "gatsby-plugin-image";
import { connectKeplr } from "../utils/keplr";
import { GlobalContext } from "../context/store";
import chains from "../data/chains.json";
import { renderBalance } from "../utils/cosmos";
import QRCode from 'qrcode.react';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import { AccountStore, getKeplrFromWindow, WalletStatus } from '@keplr-wallet/stores';
import WalletConnect from '@walletconnect/client';
import {
  isAndroid as checkIsAndroid,
  isMobile as checkIsMobile,
  saveMobileLinkInfo,
} from '@walletconnect/browser-utils';
import { Buffer } from 'buffer/';
import Axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Box,
  IconButton,
  Button,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Chip,
  Grid
} from '@mui/material';
class WalletConnectQRCodeModalV1Renderer {
  constructor() { }
  open(uri, cb) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('id', 'wallet-connect-qrcode-modal-v1');
    document.body.appendChild(wrapper);
    ReactDOM.render(
      <WalletConnectQRCodeModal
        uri={uri}
        close={() => {
          this.close();
          cb();
        }}
      />,
      wrapper
    );
  }
  close() {
    const wrapper = document.getElementById('wallet-connect-qrcode-modal-v1');
    if (wrapper) {
      document.body.removeChild(wrapper);
    }
  }
}



const actionConnect = async (type, selectedNetwork, dispatch) => {
  const mergedChains = localStorage.getItem('localChains') ? chains.concat(JSON.parse(localStorage.getItem('localChains'))) : chains;
  const chain = mergedChains.find((c) => c.chain_id === selectedNetwork);

  switch (type) {
    case "keplr":
      await connectKeplr(chain, dispatch);
      break;
    default:
  }
};

const ConnectWallet = () => {
  const [state, dispatch] = useContext(GlobalContext);
  const [walletConnectData, setWalletConnectData] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  async function sendTx(chainId, tx, mode) {
    console.log(chainId,"@@@@@@@@@@@@@@@@@@@@@@@@@@")
    let mergedChains = chains;
    const restInstance = Axios.create({
      baseURL: mergedChains.find((c) => c.chain_id === chainId).lcd,
    });
  
    const isProtoTx = Buffer.isBuffer(tx) || tx instanceof Uint8Array;
  
    const params = isProtoTx
      ? {
        tx_bytes: Buffer.from(tx).toString('base64'),
        mode: (() => {
          switch (mode) {
            case 'async':
              return 'BROADCAST_MODE_ASYNC';
            case 'block':
              return 'BROADCAST_MODE_BLOCK';
            case 'sync':
              return 'BROADCAST_MODE_SYNC';
            default:
              return 'BROADCAST_MODE_UNSPECIFIED';
          }
        })(),
      }
      : {
        tx,
        mode: mode,
      };
  
    const result = await restInstance.post(isProtoTx ? '/cosmos/tx/v1beta1/txs' : '/txs', params);
  
    const txResponse = isProtoTx ? result.data['tx_response'] : result.data;
  
    if (txResponse.code != null && txResponse.code !== 0) {
      throw new Error(txResponse['raw_log']);
    }
  
    return Buffer.from(txResponse.txhash, 'hex');
  }
  const getKeplr = () => {
    let walletConnector = null;
    if (walletConnector == null) {
      walletConnector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        signingMethods: [],
        qrcodeModal: new WalletConnectQRCodeModalV1Renderer(),
      });
      walletConnector._clientMeta = {
        name: 'ITAstakers',
        description: 'ITA Stakers Quickstake',
        url: window.location.origin,
        icons: ["https://quickstake.itastakers.com/static/f7f0481612c675424a6fa61b52a942f8/24b8f/logo_square.png"],
      };
      setWalletConnectData(walletConnector)
      handleClose()
    }

    if (!walletConnector.connected) {
      return new Promise((resolve, reject) => {
        walletConnector.connect()
          .then((res) => {
            resolve(
              new KeplrWalletConnectV1(walletConnector, {
                sendTx,
                onBeforeSendRequest: onBeforeSendRequest,
              })
            );
          })
          .catch(e => {
            console.log(e);
            // XXX: Due to the limitation of cureent account store implementation.
            //      We shouldn't throw an error (reject) on the `getKeplr()` method.
            //      So return the `undefined` temporarily.
            //      In this case, the wallet will be considered as `NotExist`
            resolve(undefined);
          });
      });
    } else {
      // return Promise.resolve(
      //   new KeplrWalletConnectV1(walletConnector, {
      //     sendTx,
      //     onBeforeSendRequest: onBeforeSendRequest,
      //   })
      // );
    }
  };
  const onBeforeSendRequest = (request) => {
		if (!checkIsMobile()) {
			return;
		}

		const deepLink = checkIsAndroid()
			? 'intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;'
			: 'keplrwallet://wcV1';

		switch (request.method) {
			case 'keplr_enable_wallet_connect_v1':
				// Keplr mobile requests another per-chain permission for each wallet connect session.
				// By the current logic, `enable()` is requested immediately after wallet connect is connected.
				// However, in this case, two requests are made consecutively.
				// So in ios, the deep link modal pops up twice and confuses the user.
				// To solve this problem, enable on the osmosis chain does not open deep links.
				if (request.params && request.params.length === 1 && request.params[0] === state.selectedNetwork) {
					break;
				}
				window.location.href = deepLink;
				break;
			case 'keplr_sign_amino_wallet_connect_v1':
				window.location.href = deepLink;
				break;
		}

		return;
	};
  if (state.address !== "" && state.signer !== null) {
    return (
      <Grid container spacing={1} wrap="wrap">
        <Grid item sm={12} md={9}>
          <Chip label={state.address} variant="outlined" />
        </Grid>
        <Grid item sm={12} md={3}>
          <Chip label={renderBalance(state.chain, state.balance)} />
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Connect Wallet
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="wallet-connection-dialog"
      >
        <DialogTitle id="alert-dialog-title">
          <Grid
            container
            direction="row"
            justifyContent="space-between"
          >
            <div>
              <p className="connect-wallet-title">Connect Wallet</p>
            </div>
            <div>
              <IconButton aria-label="close-icon" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <List
            sx={{
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                pb: 2,
              }}
            >
              <Paper elevation={3}>
                <ListItemButton
                  onClick={(e) =>
                    actionConnect("keplr", state.selectedNetwork, dispatch)
                  }
                >
                  <ListItemAvatar>
                    <StaticImage className="wallet_avatar" src="../images/keplr.png" alt="keplr" />
                  </ListItemAvatar>
                  <ListItemText primary="Keplr" secondary="Keplr Browser Extension" />
                </ListItemButton>
              </Paper>
            </Box>
            <Box
              sx={{
                pb: 2,
              }}
            >
              <Paper elevation={3}>
                <ListItemButton
                  onClick={getKeplr}
                >
                  <ListItemAvatar>
                    <StaticImage className="wallet_avatar" src="../images/wallet_connect.png" alt="wallet" />
                  </ListItemAvatar>
                  <ListItemText primary="WalletConnection" secondary="Keplr Mobile" />
                </ListItemButton>
              </Paper>
            </Box>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectWallet;



export const WalletConnectQRCodeModal = ({ uri, close }) => {
  const [isMobile] = useState(() => checkIsMobile());
  const [isAndroid] = useState(() => checkIsAndroid());
  const [qrCodeModal, setQrCodeModal] = useState(true);
  const handleQrCodeClose = () => {
    setQrCodeModal(false)
    close()
  }
  const navigateToAppURL = useMemo(() => {
    console.log(isMobile,"JHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    if (isMobile) {
      if (isAndroid) {
        // Save the mobile link.
        saveMobileLinkInfo({
          name: 'Keplr',
          href: 'intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;',
        });

        return `intent://wcV1?${uri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`;
      } else {
        // Save the mobile link.
        saveMobileLinkInfo({
          name: 'Keplr',
          href: 'keplrwallet://wcV1',
        });

        return `keplrwallet://wcV1?${uri}`;
      }
    }
  }, [isMobile, isAndroid, uri]);

  useEffect(() => {
    if (navigateToAppURL) {
      window.location.href = navigateToAppURL;
    }
  }, [navigateToAppURL]);

  const [isTimeout, setIsTimeout] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsTimeout(true);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Perhaps there is no way to know whether the app is installed or launched in the web browser.
  // For now, if users are still looking at the screen after 2 seconds, assume that the app isn't installed.
  if (isMobile) {
    if (isTimeout) {
      return (
        <div className="fixed inset-0 z-100 overflow-y-auto">
          <div className="p-5 flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-black opacity-20 flex justify-center items-center"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();

                close();
              }}
            />
            <div
              className="relative md:max-w-modal px-4 py-5 md:p-8 bg-surface shadow-elevation-24dp rounded-2xl z-10"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}>
              {isAndroid ? (
                <button
                  className="px-6 py-2.5 rounded-xl bg-primary-400 flex items-center justify-center mx-auto hover:opacity-75"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();

                    window.location.href = navigateToAppURL;
                  }}>
                  <h6 className="text-white-high">Open Keplr</h6>
                </button>
              ) : (
                <button
                  className="px-6 py-2.5 rounded-xl bg-primary-400 flex items-center justify-center mx-auto hover:opacity-75"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();

                    window.location.href = 'itms-apps://itunes.apple.com/app/1567851089';
                  }}>
                  <h6 className="text-white-high">Install Keplr</h6>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="fixed inset-0 z-100 overflow-y-auto">
          <div className="p-5 flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-black opacity-20 flex justify-center items-center"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();

                close();
              }}
            />
            <div
              className="relative md:max-w-modal px-4 py-5 md:p-8 bg-surface shadow-elevation-24dp rounded-2xl z-10"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}>
              <img alt="ldg" className="s-spin w-7 h-7" src="/public/assets/Icons/Loading.png" />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <Dialog
      open={qrCodeModal}
      onClose={handleQrCodeClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="wallet-connection-dialog"
    >
      <DialogTitle id="alert-dialog-title">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
        >
          <div>
            <p className="connect-wallet-title">Scan QR Code</p>
          </div>
          <div>
            <IconButton aria-label="close-icon" onClick={handleQrCodeClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <div className="qrcode-container">
          <div className="qrcode-wrapper">
            <QRCode size={500} value={uri} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
