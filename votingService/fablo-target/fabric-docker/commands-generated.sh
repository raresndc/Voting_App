#!/usr/bin/env bash

generateArtifacts() {
  printHeadline "Generating basic configs" "U1F913"

  printItalics "Generating crypto material for Org1" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-org1.yaml" "peerOrganizations/org1.example.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating genesis block for group orderer-group" "U1F3E0"
  genesisBlockCreate "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config" "Orderer-groupGenesis"

  # Create directories to avoid permission errors on linux
  mkdir -p "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"
  mkdir -p "$FABLO_NETWORK_ROOT/fabric-config/config"
}

startNetwork() {
  printHeadline "Starting network" "U1F680"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker compose up -d)
  sleep 4
}

generateChannelsArtifacts() {
  printHeadline "Generating config for 'voting-channel'" "U1F913"
  createChannelTx "voting-channel" "$FABLO_NETWORK_ROOT/fabric-config" "VotingChannel" "$FABLO_NETWORK_ROOT/fabric-config/config"
}

installChannels() {
  printHeadline "Creating 'voting-channel' on Org1/peer0" "U1F63B"
  docker exec -i cli.org1.example.com bash -c "source scripts/channel_fns.sh; createChannelAndJoinTls 'voting-channel' 'Org1MSP' 'peer0.org1.example.com:7021' 'crypto/users/Admin@org1.example.com/msp' 'crypto/users/Admin@org1.example.com/tls' 'crypto-orderer/tlsca.org1.example.com-cert.pem' 'orderer0.orderer-group.org1.example.com:7030';"

  printItalics "Joining 'voting-channel' on Org1/peer1" "U1F638"
  docker exec -i cli.org1.example.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'voting-channel' 'Org1MSP' 'peer1.org1.example.com:7022' 'crypto/users/Admin@org1.example.com/msp' 'crypto/users/Admin@org1.example.com/tls' 'crypto-orderer/tlsca.org1.example.com-cert.pem' 'orderer0.orderer-group.org1.example.com:7030';"
}

installChaincodes() {
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincode/voting-contract")" ]; then
    local version="1.0"
    printHeadline "Packaging chaincode 'voting-contract'" "U1F60E"
    chaincodeBuild "voting-contract" "node" "$CHAINCODES_BASE_DIR/./chaincode/voting-contract" "16"
    chaincodePackage "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-contract" "$version" "node" printHeadline "Installing 'voting-contract' for Org1" "U1F60E"
    chaincodeInstall "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-contract" "$version" "crypto-orderer/tlsca.org1.example.com-cert.pem"
    chaincodeInstall "cli.org1.example.com" "peer1.org1.example.com:7022" "voting-contract" "$version" "crypto-orderer/tlsca.org1.example.com-cert.pem"
    chaincodeApprove "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-channel" "voting-contract" "$version" "orderer0.orderer-group.org1.example.com:7030" "" "false" "crypto-orderer/tlsca.org1.example.com-cert.pem" ""
    printItalics "Committing chaincode 'voting-contract' on channel 'voting-channel' as 'Org1'" "U1F618"
    chaincodeCommit "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-channel" "voting-contract" "$version" "orderer0.orderer-group.org1.example.com:7030" "" "false" "crypto-orderer/tlsca.org1.example.com-cert.pem" "peer0.org1.example.com:7021" "crypto-peer/peer0.org1.example.com/tls/ca.crt" ""
  else
    echo "Warning! Skipping chaincode 'voting-contract' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincode/voting-contract'"
  fi

}

installChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "voting-contract" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincode/voting-contract")" ]; then
      printHeadline "Packaging chaincode 'voting-contract'" "U1F60E"
      chaincodeBuild "voting-contract" "node" "$CHAINCODES_BASE_DIR/./chaincode/voting-contract" "16"
      chaincodePackage "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-contract" "$version" "node" printHeadline "Installing 'voting-contract' for Org1" "U1F60E"
      chaincodeInstall "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-contract" "$version" "crypto-orderer/tlsca.org1.example.com-cert.pem"
      chaincodeInstall "cli.org1.example.com" "peer1.org1.example.com:7022" "voting-contract" "$version" "crypto-orderer/tlsca.org1.example.com-cert.pem"
      chaincodeApprove "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-channel" "voting-contract" "$version" "orderer0.orderer-group.org1.example.com:7030" "" "false" "crypto-orderer/tlsca.org1.example.com-cert.pem" ""
      printItalics "Committing chaincode 'voting-contract' on channel 'voting-channel' as 'Org1'" "U1F618"
      chaincodeCommit "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-channel" "voting-contract" "$version" "orderer0.orderer-group.org1.example.com:7030" "" "false" "crypto-orderer/tlsca.org1.example.com-cert.pem" "peer0.org1.example.com:7021" "crypto-peer/peer0.org1.example.com/tls/ca.crt" ""

    else
      echo "Warning! Skipping chaincode 'voting-contract' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincode/voting-contract'"
    fi
  fi
}

runDevModeChaincode() {
  local chaincodeName=$1
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "voting-contract" ]; then
    local version="1.0"
    printHeadline "Approving 'voting-contract' for Org1 (dev mode)" "U1F60E"
    chaincodeApprove "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-channel" "voting-contract" "1.0" "orderer0.orderer-group.org1.example.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'voting-contract' on channel 'voting-channel' as 'Org1' (dev mode)" "U1F618"
    chaincodeCommit "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-channel" "voting-contract" "1.0" "orderer0.orderer-group.org1.example.com:7030" "" "false" "" "peer0.org1.example.com:7021" "" ""

  fi
}

upgradeChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "voting-contract" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincode/voting-contract")" ]; then
      printHeadline "Packaging chaincode 'voting-contract'" "U1F60E"
      chaincodeBuild "voting-contract" "node" "$CHAINCODES_BASE_DIR/./chaincode/voting-contract" "16"
      chaincodePackage "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-contract" "$version" "node" printHeadline "Installing 'voting-contract' for Org1" "U1F60E"
      chaincodeInstall "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-contract" "$version" "crypto-orderer/tlsca.org1.example.com-cert.pem"
      chaincodeInstall "cli.org1.example.com" "peer1.org1.example.com:7022" "voting-contract" "$version" "crypto-orderer/tlsca.org1.example.com-cert.pem"
      chaincodeApprove "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-channel" "voting-contract" "$version" "orderer0.orderer-group.org1.example.com:7030" "" "false" "crypto-orderer/tlsca.org1.example.com-cert.pem" ""
      printItalics "Committing chaincode 'voting-contract' on channel 'voting-channel' as 'Org1'" "U1F618"
      chaincodeCommit "cli.org1.example.com" "peer0.org1.example.com:7021" "voting-channel" "voting-contract" "$version" "orderer0.orderer-group.org1.example.com:7030" "" "false" "crypto-orderer/tlsca.org1.example.com-cert.pem" "peer0.org1.example.com:7021" "crypto-peer/peer0.org1.example.com/tls/ca.crt" ""

    else
      echo "Warning! Skipping chaincode 'voting-contract' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincode/voting-contract'"
    fi
  fi
}

notifyOrgsAboutChannels() {

  printHeadline "Creating new channel config blocks" "U1F537"
  createNewChannelUpdateTx "voting-channel" "Org1MSP" "VotingChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"

  printHeadline "Notyfing orgs about channels" "U1F4E2"
  notifyOrgAboutNewChannelTls "voting-channel" "Org1MSP" "cli.org1.example.com" "peer0.org1.example.com" "orderer0.orderer-group.org1.example.com:7030" "crypto-orderer/tlsca.org1.example.com-cert.pem"

  printHeadline "Deleting new channel config blocks" "U1F52A"
  deleteNewChannelUpdateTx "voting-channel" "Org1MSP" "cli.org1.example.com"

}

printStartSuccessInfo() {
  printHeadline "Done! Enjoy your fresh network" "U1F984"
}

stopNetwork() {
  printHeadline "Stopping network" "U1F68F"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker compose stop)
  sleep 4
}

networkDown() {
  printHeadline "Destroying network" "U1F916"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker compose down)

  printf "Removing chaincode containers & images... \U1F5D1 \n"
  for container in $(docker ps -a | grep "dev-peer0.org1.example.com-voting-contract" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.org1.example.com-voting-contract*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer1.org1.example.com-voting-contract" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer1.org1.example.com-voting-contract*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done

  printf "Removing generated configs... \U1F5D1 \n"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/crypto-config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"

  printHeadline "Done! Network was purged" "U1F5D1"
}
