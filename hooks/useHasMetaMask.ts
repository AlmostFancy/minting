import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";

const useHasMetaMask = () => {
    const [hasProvider, setHasProvider] = useState(false);

    useEffect(() => {
        async function handleProvider() {
            const provider = await detectEthereumProvider();
            setHasProvider(!!provider);
        }
        
        handleProvider();
    }, []);

    return hasProvider;
}

export default useHasMetaMask;