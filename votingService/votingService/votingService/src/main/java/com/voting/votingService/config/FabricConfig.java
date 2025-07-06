package com.voting.votingService.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import org.hyperledger.fabric.gateway.Gateway;
import org.hyperledger.fabric.gateway.Wallet;
import org.hyperledger.fabric.gateway.Wallets;
import org.hyperledger.fabric.gateway.Network;
import org.hyperledger.fabric.gateway.Contract;
import org.hyperledger.fabric.gateway.Identities;
import org.hyperledger.fabric.gateway.Identity;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

@Configuration
public class FabricConfig {

    @Value("${fabric.networkConfig}")
    private Resource networkConfig;

    @Value("${fabric.certPath}")
    private Resource certResource;

    @Value("${fabric.keyPath}")
    private Resource keyResource;

    @Value("${fabric.user}")
    private String userName;

    @Bean
    public Gateway gateway() throws Exception {
        // 1) Read the PEM streams
        X509Certificate certificate =
                Identities.readX509Certificate(
                        new BufferedReader(new InputStreamReader(certResource.getInputStream()))
                );
        PrivateKey privateKey =
                Identities.readPrivateKey(
                        new BufferedReader(new InputStreamReader(keyResource.getInputStream()))
                );

        // 2) Build an in-memory wallet
        Wallet wallet = Wallets.newInMemoryWallet();
        wallet.put(
                userName,
                Identities.newX509Identity("Org1MSP", certificate, privateKey)
        );

        // 3) Connect
        return Gateway.createBuilder()
                .identity(wallet, userName)
                .networkConfig(networkConfig.getFile().toPath())
                .connect();
    }

    @Bean
    public Network network(Gateway gateway,
                           @Value("${fabric.channel}") String channel) {
        return gateway.getNetwork(channel);
    }

    @Bean
    public Contract votingContract(Network network,
                                   @Value("${fabric.chaincode}") String ccName) {
        return network.getContract(ccName);
    }
}


