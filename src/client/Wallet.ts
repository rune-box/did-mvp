import { PermissionType } from "arconnect";
import Arweave from "arweave";
import axios from "axios";
import { ethers } from "ethers";
import { Account2, Account4 } from "../models/Account";
import {Keplr, StdSignDoc} from "@keplr-wallet/types";
import { OfflineSigner, SigningCosmosClient } from "@cosmjs/launchpad";
import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";
import { AccountKeys } from "./Constants";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { ViewData, ViewMdoelBridge } from "./ViewData";
import { ImprintItem } from "../models/DataRune";
import { DataRuneUtility } from "../utils/DataRuneUtility";
import up, { UPAuthMessage } from "up-core-test";
import functions from "up-ckb-alpha-test";
import { NervosConfig } from "./NervosConfig";
import PWCore from "@lay2/pw-core";
import { delay } from "../utils/threads";

export class WalletUtility {
    static buildSignContent (account: string): string {
        //const nonce = getCookie(CookieKeys.EthSignInNonce);
        const data = {
            account: account,
            message: "Connect to DNA@RuneBox!",
            timestamp: Date.now()
        };
        return JSON.stringify(data);
    }
    static buildSignContent2 (account: string, key: string, address: string): string {
        //const nonce = getCookie(CookieKeys.EthSignInNonce);
        const data = {
            account: account,
            key: key,
            address: address,
            message: "Connect to DNA@RuneBox!",
            timestamp: Date.now()
        };
        return JSON.stringify(data);
    }

    static buildSignContent_MutateDNA (dna: string, key: string, account: string,
        addedAccounts: Array<Account2>, removedAccounts: Array<Account2>, signers: Array<Account4>,
        recombinationThreshold: number): string {
        //const nonce = getCookie(CookieKeys.EthSignInNonce);
        const data = {
            signer: {
                key: key,
                account: account
            },
            dna: dna,
            message: `DNA mutation: added ${addedAccounts.length} new accounts, removed ${removedAccounts.length} accounts. Should be signed by ${signers.length} signers.`,
            addedAccounts: addedAccounts,
            removedAccounts: removedAccounts,
            signers: signers,
            recombinationThreshold: recombinationThreshold,
            timestamp: Date.now()
        };
        return JSON.stringify(data);
    }
    static buildSignContent_DataSnapshot(dna: string, signer: Account4, imprints: Array<ImprintItem>): string{
        //const hash = DataRuneUtility.keccak256(imprints);
        const data = {
            signer: {
                key: signer.key,
                account: signer.account
            },
            dna: dna,
            //data: JSON.stringify(imprints),
            //dataHash: hash,
            count: imprints.length,
            timestamp: Date.now()
        };
        return JSON.stringify(data);
    }
    
    static buildCheckIdenaContent(): string {
        const data = {
            message: "Check the result of Connection with DNA.",
            timestamp: Date.now()
        };
        return JSON.stringify(data);
    }

    static checkCurrentAccount(savedAddress: string, connectedAddress: string, toast: any){
        if( savedAddress && savedAddress !== connectedAddress){
            toast({
                title: 'Wrong wallet',
                description: "Please switch the wallet to address: " + savedAddress,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return false;
        }
        return true;
    }
    
    static detectEthereum(): boolean{
        return (window as any).ethereum;
    }
    static async requestETHNetwork(ethereum: any) {
        const result = await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: "0x1"
            }]
        });
        return result;
    }
    static async connectEth(message: string, buildSignMessage: (account: string) => string, uri: string,
        connected: (data: any) => any, failed: () => any, cancelled: () => any,
        toast: (data: any) => any) {
        const ethereum = (window as any).ethereum;
        if (!ethereum) {
            toast({
                title: 'No wallet detected!',
                description: "Please install a wallet extension first.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        const ethNetwork = await WalletUtility.requestETHNetwork(ethereum);
        if (ethNetwork) { // null = success
            toast({
                title: 'The ENS function needs ETH mainnet',
                description: "Please switch to Ethereum Mainnet.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if(cancelled) cancelled();
            return;
        }
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        if( WalletUtility.checkCurrentAccount(ViewData.eth, account, toast) === false){
            if(cancelled) cancelled();
            return;
        }
        const msgContent = message || buildSignMessage(account);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner(account);

        const signature = await signer.signMessage(msgContent);
        if (!signature){
            if(cancelled) cancelled();
            return;
        }
        //console.log("signature: " + signature);
        const res = await axios.post(uri, {
            message: msgContent,
            signature: signature
        });
        const data = res.data;
        if (data && data.success === true) {
            console.log("Connected to: " + data.account);
            data["signer"] = signer;
            data["provider"] = provider;
            if (connected) await connected(data);
        }
        else {
            toast({
                title: 'Error!',
                description: data.error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if (failed) failed();
        }
    }

    static detectArweave(): boolean{
        return (window as any).arweaveWallet;
    }
    static async connectArweave(message: string, buildSignMessage: (account: string) => string, uri: string,
        connected: (data: any) => any, failed: () => any, cancelled: () => any,
        toast: (data: any) => any) {
        // arweave.js
        const ar = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https'
        });
        const arWallet = window.arweaveWallet;
        if (!arWallet) {
            toast({
                title: 'No Arweave wallet detected!',
                description: "Your should install a Arweave wallet first.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            if(cancelled) cancelled();
            return;
        }
        const permissions: Array<PermissionType> = ['ACCESS_ADDRESS', 'SIGNATURE', 'ACCESS_PUBLIC_KEY'];//
        await arWallet.connect(permissions, {
                name: "DNA"
            }, {
                host: 'arweave.net',
                port: 443,
                protocol: 'https'
            });
        const address = await arWallet.getActiveAddress();
        if( WalletUtility.checkCurrentAccount(ViewData.ar, address, toast) === false){
            if(cancelled) cancelled();
            return;
        }
        const pk = await arWallet.getActivePublicKey();
        if (address) {
            const msgContent = message || buildSignMessage(address);
            const msgData = Arweave.utils.stringToBuffer(msgContent);
            const sigData = await arWallet.signature(msgData, {
                name: "RSA-PSS",
                saltLength: 32,
            });
            if(!sigData){
                if(cancelled) cancelled();
                return;
            }
            const signature = Arweave.utils.bufferTob64(sigData);
            console.log("Ar sig: ");
            console.log(sigData);
            const res = await axios.post(uri, {
                message: msgContent,
                signature: signature,
                publicKey: pk
            });
            const data = res.data;
            console.log(data);
            if (data && data.success === true) {
                if (connected) connected(data);
            }
            else {
                toast({
                    title: 'Error!',
                    description: data.error,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                if (failed) failed();
            }
        }
    }

    static detectCosmos(): boolean{
        return false;// (window as any).keplr;
    }
    static async connectCosmos(message: string, buildSignMessage: (account: string) => string, uri: string,
    connected: (data: any) => any, failed: () => any, cancelled: () => any,
    toast: (data: any) => any){
        const keplr = (window as any).keplr as Keplr;
        if(!keplr){
            toast({
                title: 'No wallet detected!',
                description: "Please install a Keplr wallet first.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if(cancelled) cancelled();
            return;
        }
        try{
            const chainId = "cosmoshub-4";
            await keplr.enable(chainId);
            const offlineSigner = (window as any).getOfflineSigner(chainId) as OfflineSigner;
            const accounts = await offlineSigner.getAccounts();
            const client = new SigningCosmosClient(
                "https://lcd-cosmoshub.keplr.app",
                accounts[0].address,
                offlineSigner,
            );
            const account = accounts[0].address;
            if( WalletUtility.checkCurrentAccount(ViewData.atom, account, toast) === false){
                if(cancelled) cancelled();
                return;
            }
            const msgContent = message || buildSignMessage(account);
            const resSignature = await keplr.signArbitrary(chainId, account, msgContent);
            console.log("pubKey type:" + resSignature.pub_key.type);
            console.log("pubKey:" + resSignature.pub_key.value);
            console.log("signature:" + resSignature.signature);
            const res = await axios.post(uri, {
                message: msgContent,
                signature: JSON.stringify(resSignature)
            });
            const data = res.data;
            console.log(data);
            if (data && data.success === true) {
                if (connected) connected(data);
            }
            else {
                toast({
                    title: 'Error!',
                    description: data.error,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                if (failed) failed();
            }
        }
        catch (err: any) {
            toast({ 
                title: 'Error',
                description: err.message || err,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if (failed) failed();
        }
    }

    static detectPolkadot(): boolean{
        return false;// (window as any).injectedWeb3;
    }
    static async connectPolkadot(message: string, buildSignMessage: (account: string) => string, uri: string,
    connected: (data: any) => any, failed: () => any, cancelled: () => any,
    toast: (data: any) => any){
        const allInjected = await web3Enable('DNA@Runebox');
        if(!allInjected){
            toast({
                title: 'No wallet detected!',
                description: "Please install a Polkadot wallet first.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if(cancelled) cancelled();
            return;
        }
        try{
            const allAccounts = await web3Accounts();
            const account = allAccounts[0];
            if( WalletUtility.checkCurrentAccount(ViewData.dot, account.address, toast) === false){
                if(cancelled) cancelled();
                return;
            }
            const injector = await web3FromSource(account.meta.source);
            // console.log("web3FromSource(account.meta.source):");
            // console.log(injector);
            const signRaw = injector?.signer?.signRaw;
            if(!!signRaw){
                const msgContent = message || buildSignMessage(account.address);
                const { signature } = await signRaw({
                    address: account.address,
                    data: stringToHex(msgContent),
                    type: 'bytes'
                });
                // signatureVerify is in @polkadot/util-crypto

                const res = await axios.post(uri, {
                    message: msgContent,
                    signature: signature
                });
                const data = res.data;
                console.log(data);
                if (data && data.success === true) {
                    if (connected) connected(data);
                }
                else {
                    toast({
                        title: 'Error!',
                        description: data.error,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    if (failed) failed();
                }
            } // if(!!signRaw)
            else{
                toast({
                    title: 'Unknown!',
                    description: "Cannot initialize a inject signer.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                if(cancelled) cancelled();
                return;
            }
        }
        catch (err: any) {
            toast({ 
                title: 'Error',
                description: err.message || err,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if (failed) failed();
        }
    }

    static detectSolana(): boolean{
        return (window as any).solana;
    }
    static async connectSolana(message: string, buildSignMessage: (account: string) => string, uri: string,
        connected: (data: any) => any, failed: () => any, cancelled: () => any,
        toast: (data: any) => any) {
        //solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"), )
        const solProvider = (window as any).solana;
        if (!solProvider) {
            toast({
                title: 'No wallet detected!',
                description: "Please install a Solana wallet first.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if(cancelled) cancelled();
            return;
        }
        try {
            const resp = await solProvider.connect();
            console.log("Public Key: " + resp.publicKey.toString());
            const address = resp.publicKey.toString();
            if (address) {
                if( WalletUtility.checkCurrentAccount(ViewData.sol, address, toast) === false){
                    if(cancelled) cancelled();
                    return;
                }
                const msgContent = message || buildSignMessage(address);
                const encodedMessage = new TextEncoder().encode(msgContent);
                const signedMessage = await solProvider.signMessage(encodedMessage, "utf8");
                if(!signedMessage){
                    if(cancelled) cancelled();
                    return;
                }
                // {"signature":{"type":"Buffer","data":[220,244,147,48,85,8,90,211,153,190,218,244,15,162,88,221,208,65,146,189,176,228,118,173,84,95,110,153,0,192,139,191,253,82,137,130,34,32,155,57,203,174,84,110,33,169,234,82,15,146,39,115,71,1,249,166,152,234,155,5,122,110,231,15]},
                // "publicKey":"4Dio1pbs5jZAdkhh9n6pnXQmHXamBBCqw3eRt5Ut5hEn"}
                //const signature = new TextDecoder().decode(signedMessage.signature.data);
                const signature = JSON.stringify(signedMessage);
                const res = await axios.post(uri, {
                    message: msgContent,
                    signature: signature
                });
                const data = res.data;
                if (data && data.success === true) {
                    if (connected) connected(data);
                }
                else {
                    toast({
                        title: 'Error!',
                        description: data.error,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    if (failed) failed();
                }
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || err,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if (failed) failed();
        }
    }

    static async connectAlgo(message: string, buildSignMessage: (account: string) => string, uri: string,
        connected: (data: any) => any, failed: () => any, cancelled: () => any,
        toast: (data: any) => any){
        try{
            const myAlgoConnect = new MyAlgoConnect();
            const settings = {
                shouldSelectOneAccount: false,
                openManager: false
            };
            const accounts = await myAlgoConnect.connect(settings);
            const account = accounts[0];
            if( WalletUtility.checkCurrentAccount(ViewData.algo, account.address, toast) === false){
                if(cancelled) cancelled();
                return;
            }

            const msgContent = message || buildSignMessage(account.address);
            const encodedMessage = new TextEncoder().encode(msgContent);
            const resSign = await myAlgoConnect.signBytes(encodedMessage, account.address);
            if(!resSign){
                if(cancelled) cancelled();
                return;
            }
            const res = await axios.post(uri, {
                message: msgContent,
                signature: JSON.stringify(resSign)
            });
            const data = res.data;
            if (data && data.success === true) {
                if (connected) connected(data);
            }
            else {
                toast({
                    title: 'Error!',
                    description: data.error,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                if (failed) failed();
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || err,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if (failed) failed();
        }
    }

    static configCKB(){
        PWCore.setChainId(NervosConfig.PWCore_ChainId);
        functions.config({
            upSnapshotUrl: NervosConfig.Unipass_SnapshotUrl,
            chainID: NervosConfig.PWCore_ChainId,
            ckbNodeUrl: NervosConfig.CKB_NodeUrl,
            ckbIndexerUrl: NervosConfig.CKB_IndexerUrl,
            upLockCodeHash: NervosConfig.Unipass_LockCodeHash
        });
    }
    static async connectUnipassId(message: string, buildSignMessage: (account: string) => string, uri: string,
        connected: (data: any) => any, failed: () => any, cancelled: () => any,
        toast: (data: any) => any){
        try{
            up.config({
                domain: "app.unipass.id",
                protocol: "https"
            });
            WalletUtility.configCKB();
            const upAccount = await up.connect({
                email: false,
                evmKeys: true
            });
            await delay(777);
            const msgContent = message || buildSignMessage(upAccount.username);
            const upRes = await up.authorize(new UPAuthMessage('PLAIN_MSG', upAccount.username, msgContent));
            if(!upRes){
                toast({
                    title: 'Error!',
                    description: "Authorization failed!",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                if (failed) failed();
                return;
            }
            // const ckb = functions.getCKBAddress(upAccount.username);
            // console.log("ckb.addressString: " + ckb.addressString);
            const res = await axios.post(uri, {
                message: msgContent,
                signature: JSON.stringify(upRes)
            });
            const data = res.data;
            if (data && data.success === true) {
                if (connected) connected(data);
            }
            else {
                toast({
                    title: 'Error!',
                    description: data.error,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                if (failed) failed();
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || err,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if (failed) failed();
        }
    }
    static async connectNervosUsingUnipassId(message: string, buildSignMessage: (account: string, key: string, address: string) => string, uri: string,
        connected: (data: any) => any, failed: () => any, cancelled: () => any,
        toast: (data: any) => any){
        try{
            up.config({
                domain: "app.unipass.id",
                protocol: "https"
            });
            WalletUtility.configCKB();
            const upAccount = await up.connect({
                email: false,
                evmKeys: true
            });
            if(upAccount.username !== ViewData.unipassid){
                toast({
                    title: 'Attention!',
                    description: "Please sitch to the account: " + ViewData.unipassid,
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
            const ckb = functions.getCKBAddress(upAccount.username);
            await delay(777);
            const msgContent = message || buildSignMessage(upAccount.username, AccountKeys.NervosCKB, ckb.addressString);
            const upRes = await up.authorize(new UPAuthMessage('PLAIN_MSG', upAccount.username, msgContent));
            if(!upRes){
                toast({
                    title: 'Error!',
                    description: "Authorization failed!",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                if (failed) failed();
                return;
            }
            const res = await axios.post(uri, {
                message: msgContent,
                signature: JSON.stringify(upRes)
            });
            const data = res.data;
            if (data && data.success === true) {
                if (connected) connected(data);
            }
            else {
                toast({
                    title: 'Error!',
                    description: data.error,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                if (failed) failed();
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || err,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if (failed) failed();
        }
    }

    static async checkAccount (uri: string, requestData: any,
        successed: (data: any) => any, failed: () => any,
        toast: (data: any) => any) {
        const reqContent = JSON.stringify(requestData);
        const res = await axios.post(uri, requestData);
        const data = res.data;
        if (data && data.success === true) {
            if (successed) successed(data);
        }
        else {
            toast({
                title: 'Error!',
                description: data.error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if (failed) failed();
        }
    }
    static async submitSignature(uri: string, account: string, message: string, signature: string,
        successed: (data: any) => any, failed: () => any,
        toast: (data: any) => any){
        const res = await axios.post(uri, {
            account: account,
            message: message,
            signature: signature
        });
        const data = res.data;
        if (data && data.success === true) {
            if (successed) successed(data);
        }
        else {
            toast({
                title: 'Error!',
                description: data.error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            if (failed) failed();
        }
    }

    static getTitleByAccountKey(key:string){
        if(!key) return "Unknown";
        switch(key){
            case AccountKeys.ETH:
                return "Eth | EVM";
            case AccountKeys.Arweave:
                return "Arweave";
            case AccountKeys.Atom:
                return "Cosmos";
            case AccountKeys.Polkadot:
                return "Polkadot";
            case AccountKeys.Solana:
                return "Solana";
            case AccountKeys.Algorand:
                    return "Algorand";
            case AccountKeys.Idena:
                return "Idena";
            case AccountKeys.Bitcoin:
                return "Bitcoin";
            case AccountKeys.NervosCKB:
                return "Nervos";
            case AccountKeys.UniPassID:
                return "UniPassID";
        }
    }
}
