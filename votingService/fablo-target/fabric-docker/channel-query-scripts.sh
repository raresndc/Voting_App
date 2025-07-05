#!/usr/bin/env bash

source "$FABLO_NETWORK_ROOT/fabric-docker/scripts/channel-query-functions.sh"

set -eu

channelQuery() {
  if [ "$#" -eq 1 ]; then
    printChannelsHelp

  elif [ "$1" = "list" ] && [ "$2" = "org1" ] && [ "$3" = "peer0" ]; then

    peerChannelListTls "cli.org1.example.com" "peer0.org1.example.com:7021" "crypto-orderer/tlsca.org1.example.com-cert.pem"

  elif
    [ "$1" = "list" ] && [ "$2" = "org1" ] && [ "$3" = "peer1" ]
  then

    peerChannelListTls "cli.org1.example.com" "peer1.org1.example.com:7022" "crypto-orderer/tlsca.org1.example.com-cert.pem"

  elif

    [ "$1" = "getinfo" ] && [ "$2" = "voting-channel" ] && [ "$3" = "org1" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfoTls "voting-channel" "cli.org1.example.com" "peer0.org1.example.com:7021" "crypto-orderer/tlsca.org1.example.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "voting-channel" ] && [ "$4" = "org1" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfigTls "voting-channel" "cli.org1.example.com" "$TARGET_FILE" "peer0.org1.example.com:7021" "crypto-orderer/tlsca.org1.example.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$3" = "voting-channel" ] && [ "$4" = "org1" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlockTls "voting-channel" "cli.org1.example.com" "${BLOCK_NAME}" "peer0.org1.example.com:7021" "crypto-orderer/tlsca.org1.example.com-cert.pem" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "voting-channel" ] && [ "$3" = "org1" ] && [ "$4" = "peer1" ]
  then

    peerChannelGetInfoTls "voting-channel" "cli.org1.example.com" "peer1.org1.example.com:7022" "crypto-orderer/tlsca.org1.example.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "voting-channel" ] && [ "$4" = "org1" ] && [ "$5" = "peer1" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfigTls "voting-channel" "cli.org1.example.com" "$TARGET_FILE" "peer1.org1.example.com:7022" "crypto-orderer/tlsca.org1.example.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$3" = "voting-channel" ] && [ "$4" = "org1" ] && [ "$5" = "peer1" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlockTls "voting-channel" "cli.org1.example.com" "${BLOCK_NAME}" "peer1.org1.example.com:7022" "crypto-orderer/tlsca.org1.example.com-cert.pem" "$TARGET_FILE"

  else

    echo "$@"
    echo "$1, $2, $3, $4, $5, $6, $7, $#"
    printChannelsHelp
  fi

}

printChannelsHelp() {
  echo "Channel management commands:"
  echo ""

  echo "fablo channel list org1 peer0"
  echo -e "\t List channels on 'peer0' of 'Org1'".
  echo ""

  echo "fablo channel list org1 peer1"
  echo -e "\t List channels on 'peer1' of 'Org1'".
  echo ""

  echo "fablo channel getinfo voting-channel org1 peer0"
  echo -e "\t Get channel info on 'peer0' of 'Org1'".
  echo ""
  echo "fablo channel fetch config voting-channel org1 peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'Org1'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> voting-channel org1 peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'Org1'".
  echo ""

  echo "fablo channel getinfo voting-channel org1 peer1"
  echo -e "\t Get channel info on 'peer1' of 'Org1'".
  echo ""
  echo "fablo channel fetch config voting-channel org1 peer1 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer1' of 'Org1'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> voting-channel org1 peer1 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer1' of 'Org1'".
  echo ""

}
