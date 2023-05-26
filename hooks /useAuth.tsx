import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { canisterId, idlFactory } from "../utils/xsctoken";
import { Actor, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

type AuthContextType = {
    isAuthenticated: boolean,
    login: () => void,
    logout: () => void,
    authClient: AuthClient | undefined,
    identity: Identity | undefined,
    principal: Principal | undefined,
    xscActor: ActorSubclass | undefined,
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => undefined,
    logout: () => undefined,
    authClient: undefined,
    identity: undefined,
    principal: undefined,
    xscActor: undefined,
});

const defaultOptions = {
    /**
     *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
     */
    createOptions: {
        idleOptions: {
            // Set to true if you do not want idle functionality
            disableIdle: true,
        },
    },
    /**
     * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
     */
    loginOptions: {
        identityProvider:
            process.env.NEXT_PUBLIC_DFX_NETWORK === "ic"
                ? "https://identity.ic0.app/#authorize"
                : `http://localhost:4943?canisterId=avqkn-guaaa-aaaaa-qaaea-cai#authorize`,
    },
};

/**
 *
 * @param options - Options for the AuthClient
 * @param {AuthClientCreateOptions} options.createOptions - Options for the AuthClient.create() method
 * @param {AuthClientLoginOptions} options.loginOptions - Options for the AuthClient.login() method
 * @returns
 */
export const useAuthClient = (options = defaultOptions): AuthContextType => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authClient, setAuthClient] = useState<AuthClient | undefined>();
    const [identity, setIdentity] = useState<Identity | undefined>();
    const [principal, setPrincipal] = useState<Principal | undefined>();
    const [xscActor, setXscActor] = useState<ActorSubclass | undefined>();

    useEffect(() => {
        // Initialize AuthClient
        AuthClient.create(options.createOptions).then(async (client: AuthClient) => {
            updateClient(client);
        }).catch((e) => {
            console.error(e)
        });
    }, []);

    const login = (): void => {
        if (authClient) {
            authClient.login({
                ...options.loginOptions,
                onSuccess: () => {
                    updateClient(authClient);
                },
            });
        }
    };

    async function updateClient(client: AuthClient) {
        const isAuthenticated = await client.isAuthenticated();
        setIsAuthenticated(isAuthenticated);

        const identity = client.getIdentity();
        setIdentity(identity);

        const principal = identity.getPrincipal();
        setPrincipal(principal);

        setAuthClient(client);

        const actor = Actor.createActor(idlFactory, {
            agent: new HttpAgent({ host: process.env.NEXT_PUBLIC_DFX_HOST || "http://localhost:4943", identity }),
            canisterId: canisterId as string
        });

        setXscActor(actor);
    }

    async function logout() {
        if (authClient) {
            await authClient?.logout();
            await updateClient(authClient);
        }
    }

    return {
        isAuthenticated,
        login,
        logout,
        authClient,
        identity,
        principal,
        xscActor,
    };
};

/**
 * @type {React.FC}
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuthClient();

    return <AuthContext.Provider value={auth}>
        {children}
    </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
