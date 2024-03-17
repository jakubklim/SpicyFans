import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { useLocation } from "react-router-dom";

const evmNetworks = [
  {
    blockExplorerUrls: ["https://testnet.chiliscan.com/"],
    chainId: 88882,
    chainName: "Chiliz Spicy Testnet",
    iconUrls: ["https://app.dynamic.xyz/assets/networks/chiliz.svg"],
    name: "Chiliz Spicy",
    nativeCurrency: {
      decimals: 18,
      name: "Chiliz",
      symbol: "CHZ",
    },
    networkId: 88882,

    rpcUrls: ["https://spicy-rpc.chiliz.com/"],
    vanityName: "Spicy",
  },
];

const App = () => {
  // Use useLocation to access the query string
  const location = useLocation();

  // A utility function to parse the query string
  function useQuery() {
    return new URLSearchParams(location.search);
  }

  console.log("process.env.REACT_URL");
  console.log(process.env.APP_URL);

  const query = useQuery();
  const id = query.get("id"); // This will be '12345' if the URL is localhost:3000?id=12345

  return (
    <DynamicContextProvider
      settings={{
        environmentId: "d85cc0dd-1657-47d1-84d1-42b7c09b81d1",
        walletConnectors: [EthereumWalletConnectors],
        evmNetworks,
        eventsCallbacks: {
          onAuthSuccess: async (args) => {
            console.log("onAuthSuccess was called", args);
            console.log("Query parameter id:", id);

            if (args && id) {
              try {
                const response = await fetch(
                  `http://${process.env.APP_URL}/dynamic_verify`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      dynamicUserId: args.authToken,
                      telegramUserId: id,
                    }),
                  }
                );

                if (response.ok) {
                  console.log("Verification message sent successfully!");
                } else {
                  console.error("Failed to send verification message.");
                }
              } catch (error) {
                console.error("Error sending verification message:", error);
              }
            }
          },
        },
      }}
    >
      <DynamicWidget />
    </DynamicContextProvider>
  );
};

export default App;
