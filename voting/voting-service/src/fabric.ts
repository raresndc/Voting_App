import { Gateway, Wallets } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';

export async function getContract(): Promise<any> {
  const ccpPath = process.env.FABRIC_CONNECTION_PROFILE!;
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'));
  const wallet = await Wallets.newFileSystemWallet(process.env.FABRIC_WALLET!);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',        // pre-enrolled identity
    discovery: { enabled: true, asLocalhost: true }
  });
  const network = await gateway.getNetwork('mychannel');
  return network.getContract('voting-contract');
}
