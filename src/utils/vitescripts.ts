// fork of https://github.com/weserickson/solpp-dapp-workshop/blob/master/src/vitescripts.js

import { WS_RPC } from '@vite/vitejs-ws';
import { ViteAPI, abi, accountBlock } from '@vite/vitejs';
import Connector from '@vite/connector';
var Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const CONTRACT = {
  binary:
    '6080604052600060015534801561001557600080fd5b50336000806101000a81548174ffffffffffffffffffffffffffffffffffffffffff021916908374ffffffffffffffffffffffffffffffffffffffffff160217905550611e9d806100676000396000f3fe6080604052600436106100b9576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168062f2bfed146101165780631162f2581461014457806319300245146101f55780631f81be071461029c578063217248a01461032257806331a08c321461036757806332ed46da1461037e5780635de1f213146103d0578063693bb30a14610460578063a920a599146104f0578063af5f8e2a14610535578063b3cc79eb146105bb575b6000809054906101000a900474ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff163460405160405180820390838587f25050505050005b6101426004803603602081101561012c57600080fd5b81019080803590602001909291905050506105d2565b005b34801561015057600080fd5b506101f36004803603606081101561016757600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001906401000000008111156101af57600080fd5b8201836020820111156101c157600080fd5b803590602001918460208302840111640100000000831117156101e357600080fd5b9091929391929390505050610869565b005b34801561020157600080fd5b5061029a6004803603604081101561021857600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561025657600080fd5b82018360208201111561026857600080fd5b8035906020019184602083028401116401000000008311171561028a57600080fd5b90919293919293905050506109f2565b005b3480156102a857600080fd5b50610320600480360360208110156102bf57600080fd5b81019080803590602001906401000000008111156102dc57600080fd5b8201836020820111156102ee57600080fd5b8035906020019184600183028401116401000000008311171561031057600080fd5b9091929391929390505050610b61565b005b6103656004803603602081101561033857600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff169060200190929190505050610bb7565b005b34801561037357600080fd5b5061037c610d92565b005b34801561038a57600080fd5b506103ce600480360360208110156103a157600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e3e565b005b3480156103dc57600080fd5b5061045e600480360360408110156103f357600080fd5b810190808035906020019064010000000081111561041057600080fd5b82018360208201111561042257600080fd5b8035906020019184600183028401116401000000008311171561044457600080fd5b909192939192939080359060200190929190505050611012565b005b34801561046c57600080fd5b506104ee6004803603604081101561048357600080fd5b8101908080359060200190929190803590602001906401000000008111156104aa57600080fd5b8201836020820111156104bc57600080fd5b803590602001918460208302840111640100000000831117156104de57600080fd5b9091929391929390505050611065565b005b3480156104fc57600080fd5b506105336004803603604081101561051357600080fd5b81019080803590602001909291908035906020019092919050505061121a565b005b34801561054157600080fd5b506105b96004803603602081101561055857600080fd5b810190808035906020019064010000000081111561057557600080fd5b82018360208201111561058757600080fd5b803590602001918460018302840111640100000000831117156105a957600080fd5b9091929391929390505050611444565b005b3480156105c757600080fd5b506105d061149c565b005b60003411151561064a576040517f4b2bae7e00000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f54697020616d6f7574206d75737420626520706f73697469766500000000000081525060200191505060405180910390fd5b60006002600083815260200190815260200160002190508060030160009054906101000a900474ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff163374ffffffffffffffffffffffffffffffffffffffffff161415151561072c576040517f4b2bae7e00000000000000000000000000000000000000000000000000000000815260040180806020018281038252601c8152602001807f53656e6465722063616e6e6f74206265206e6f746520617574686f720000000081525060200191505060405180910390fd5b8060030160009054906101000a900474ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff163460405160405180820390838587f25050505050348160040160004669ffffffffffffffffffff1669ffffffffffffffffffff1681526020019081526020016000216000828254019250508190555034600360008360030160009054906101000a900474ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002160030160004669ffffffffffffffffffff1669ffffffffffffffffffff168152602001908152602001600021600082825401925050819055505050565b60008060608060006108bd89888880806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f820116905080830192505050505050508a6114fa565b9450945094509450945033635d66618b86868686866040518663ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808681526020018581526020018060200180602001848152602001838103835286818151815260200191508051906020019080838360005b83811015610953578082015181840152602081019050610938565b50505050905090810190601f1680156109805780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019060200280838360005b838110156109bc5780820151818401526020810190506109a1565b50505050905001975050505050505050604051808203906000692445f6e5cde8c2c70e4486f29250505050505050505050505050565b606060006060610a4386868680806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f820116905080830192505050505050506116ed565b92509250925033638d70c4118484846040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808060200184815260200180602001838103835286818151815260200191508051906020019080838360005b83811015610ac7578082015181840152602081019050610aac565b50505050905090810190601f168015610af45780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019060200280838360005b83811015610b30578082015181840152602081019050610b15565b5050505090500195505050505050604051808203906000692445f6e5cde8c2c70e4486f29250505050505050505050565b610bb382828080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505060006001026118a0565b5050565b600034111515610c2f576040517f4b2bae7e00000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f54697020616d6f7574206d75737420626520706f73697469766500000000000081525060200191505060405180910390fd5b8074ffffffffffffffffffffffffffffffffffffffffff163374ffffffffffffffffffffffffffffffffffffffffff1614151515610cd5576040517f4b2bae7e0000000000000000000000000000000000000000000000000000000081526004018080602001828103825260178152602001807f53656e6465722063616e6e6f7420626520617574686f7200000000000000000081525060200191505060405180910390fd5b8074ffffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff163460405160405180820390838587f250505050506000600360008374ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000219050348160030160004669ffffffffffffffffffff1669ffffffffffffffffffff168152602001908152602001600021600082825401925050819055505050565b3363ab733f066000809054906101000a900474ffffffffffffffffffffffffffffffffffffffffff166040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808274ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff168152602001915050604051808203906000692445f6e5cde8c2c70e4486f29250505050565b6000809054906101000a900474ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff163374ffffffffffffffffffffffffffffffffffffffffff16141515610f05576040517f4b2bae7e0000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f53656e646572206d757374206265206f776e657200000000000000000000000081525060200191505060405180910390fd5b6000809054906101000a900474ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff168174ffffffffffffffffffffffffffffffffffffffffff1614151515610fcd576040517f4b2bae7e0000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f6e65774f776e65722063616e6e6f74206265206f776e6572000000000000000081525060200191505060405180910390fd5b806000806101000a81548174ffffffffffffffffffffffffffffffffffffffffff021916908374ffffffffffffffffffffffffffffffffffffffffff16021790555050565b61106083838080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050826118a0565b505050565b60008060608060006110b888888880806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f82011690508083019250505050505050611b94565b9450945094509450945033630db3db5f86868686866040518663ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808674ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff1681526020018581526020018060200180602001848152602001838103835286818151815260200191508051906020019080838360005b8381101561117c578082015181840152602081019050611161565b50505050905090810190601f1680156111a95780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019060200280838360005b838110156111e55780820151818401526020810190506111ca565b50505050905001975050505050505050604051808203906000692445f6e5cde8c2c70e4486f292505050505050505050505050565b60006002600084815260200190815260200160002190508060030160009054906101000a900474ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff163374ffffffffffffffffffffffffffffffffffffffffff161415156112fb576040517f4b2bae7e00000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f53656e646572206d757374206265206e6f746520617574686f7200000000000081525060200191505060405180910390fd5b818314151515611399576040517f4b2bae7e00000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e8152602001807f6e6f74654861736820616e642072656c617465644e6f746548617368206d757381526020017f7420626520646966666572656e7400000000000000000000000000000000000081525060400191505060405180910390fd5b600060010282141515611436576000600260008481526020019081526020016000216001015414151515611435576040517f4b2bae7e00000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f52656c61746564206e6f746520646f6573206e6f74206578697374000000000081525060200191505060405180910390fd5b5b818160050181905550505050565b8181600360003374ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000216001019190611497929190611d4c565b505050565b3363e65393b56001546040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050604051808203906000692445f6e5cde8c2c70e4486f29250505050565b600080606080600080600360008a74ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002190506000600260008360020160008b81526020019081526020016000215481526020019081526020016000219050606089516040519080825280602002602001820160405280156115a45781602001602082028038833980820191505090505b50905060008090505b8a51811015611624578260040160008c838151811015156115ca57fe5b9060200190602002015169ffffffffffffffffffff1669ffffffffffffffffffff16815260200190815260200160002154828281518110151561160957fe5b906020019060200201818152505080806001019150506115ad565b508160000154826001015483600201838560050154828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156116ce5780601f106116a3576101008083540402835291602001916116ce565b820191906000526020600021905b8154815290600101906020018083116116b157829003601f168201915b5050505050925097509750975097509750505050939792965093509350565b6060600060606000600360008774ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002190506060855160405190808252806020026020018201604052801561176a5781602001602082028038833980820191505090505b50905060008090505b86518110156117ea57826003016000888381518110151561179057fe5b9060200190602002015169ffffffffffffffffffff1669ffffffffffffffffffff1681526020019081526020016000215482828151811015156117cf57fe5b90602001906020020181815250508080600101915050611773565b5081600101826000015482828054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561188a5780601f1061185f5761010080835404028352916020019161188a565b820191906000526020600021905b81548152906001019060200180831161186d57829003601f168201915b5050505050925094509450945050509250925092565b60016000815480929190600101919050555060004990506000429050600060010283141515611959576000600260008581526020019081526020016000216001015414151515611958576040517f4b2bae7e00000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f52656c61746564206e6f746520646f6573206e6f74206578697374000000000081525060200191505060405180910390fd5b5b60a0604051908101604052808381526020018281526020018581526020013374ffffffffffffffffffffffffffffffffffffffffff1681526020018481525060026000848152602001908152602001600021600082015181600001556020820151816001015560408201518160020190805190602001906119db929190611dcc565b5060608201518160030160006101000a81548174ffffffffffffffffffffffffffffffffffffffffff021916908374ffffffffffffffffffffffffffffffffffffffffff160217905550608082015181600501559050506000600360003374ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff168152602001908152602001600021905082816002016000836000016000815480929190600101919050558152602001908152602001600021819055507f805d9dd169c89f2c4767762e6c0ceaad929e4d07a87fc75e6bd5576b5be6f2ee838387338860405180868152602001858152602001806020018474ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff168152602001838152602001828103825285818151815260200191508051906020019080838360005b83811015611b4f578082015181840152602081019050611b34565b50505050905090810190601f168015611b7c5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a15050505050565b60008060608060008060026000898152602001908152602001600021905060608751604051908082528060200260200182016040528015611be45781602001602082028038833980820191505090505b50905060008090505b8851811015611c64578260040160008a83815181101515611c0a57fe5b9060200190602002015169ffffffffffffffffffff1669ffffffffffffffffffff168152602001908152602001600021548282815181101515611c4957fe5b90602001906020020181815250508080600101915050611bed565b508160030160009054906101000a900474ffffffffffffffffffffffffffffffffffffffffff16826001015483600201838560050154828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611d2f5780601f10611d0457610100808354040283529160200191611d2f565b820191906000526020600021905b815481529060010190602001808311611d1257829003601f168201915b505050505092509650965096509650965050509295509295909350565b828054600181600116156101000203166002900490600052602060002190601f016020900481019282601f10611d8d57803560ff1916838001178555611dbb565b82800160010185558215611dbb579182015b82811115611dba578235825591602001919060010190611d9f565b5b509050611dc89190611e4c565b5090565b828054600181600116156101000203166002900490600052602060002190601f016020900481019282601f10611e0d57805160ff1916838001178555611e3b565b82800160010185558215611e3b579182015b82811115611e3a578251825591602001919060010190611e1f565b5b509050611e489190611e4c565b5090565b611e6e91905b80821115611e6a576000816000905550600101611e52565b5090565b9056fea165627a7a72305820bfade07ec445d08d7d1469431744e7889cc4600248ae74a85e41adc1cd21dcf30029',
  // prettier-ignore
  abi: [{"constant":false,"inputs":[{"name":"noteHash","type":"bytes32"}],"name":"tipNote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"author","type":"address"},{"name":"index","type":"uint256"},{"name":"tokenIds","type":"tokenId[]"}],"name":"requestNoteByTimeline","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"author","type":"address"},{"name":"tokenIds","type":"tokenId[]"}],"name":"requestTimelineStats","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"noteText","type":"string"}],"name":"recordNote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"author","type":"address"}],"name":"tipTimeline","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"requestOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"offchain"},{"constant":false,"inputs":[{"name":"noteText","type":"string"},{"name":"relatedNoteHash","type":"bytes32"}],"name":"recordNoteWithRelatedNoteHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"noteHash","type":"bytes32"},{"name":"tokenIds","type":"tokenId[]"}],"name":"requestNoteByHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"noteHash","type":"bytes32"},{"name":"tokenIds","type":"tokenId[]"}],"name":"getNoteByHash","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"uint256[]"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"offchain"},{"constant":false,"inputs":[{"name":"noteHash","type":"bytes32"},{"name":"relatedNoteHash","type":"bytes32"}],"name":"updateRelatedNoteHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"bio","type":"string"}],"name":"updateBio","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"requestTotalNotes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"author","type":"address"},{"name":"tokenIds","type":"tokenId[]"}],"name":"getTimelineStats","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"offchain"},{"constant":true,"inputs":[],"name":"getTotalNotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"offchain"},{"constant":true,"inputs":[{"name":"author","type":"address"},{"name":"tokenIds","type":"tokenId[]"},{"name":"index","type":"uint256"}],"name":"getNoteByTimeline","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"uint256[]"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"offchain"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"inputs":[{"indexed":false,"name":"","type":"bytes32"},{"indexed":false,"name":"","type":"uint256"},{"indexed":false,"name":"","type":"string"},{"indexed":false,"name":"","type":"uint256[]"},{"indexed":false,"name":"","type":"bytes32"}],"name":"noteByTimelineData","type":"message"},{"inputs":[{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"uint256"},{"indexed":false,"name":"","type":"string"},{"indexed":false,"name":"","type":"uint256[]"},{"indexed":false,"name":"","type":"bytes32"}],"name":"noteByHashData","type":"message"},{"inputs":[{"indexed":false,"name":"","type":"string"},{"indexed":false,"name":"","type":"uint256"},{"indexed":false,"name":"","type":"uint256[]"}],"name":"timelineStats","type":"message"},{"inputs":[{"indexed":false,"name":"","type":"address"}],"name":"ownerData","type":"message"},{"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"totalNotesData","type":"message"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"bytes32"},{"indexed":false,"name":"","type":"uint256"},{"indexed":false,"name":"","type":"string"},{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"bytes32"}],"name":"NewNote","type":"event"}],
  offChain:
    '608060405260043610610071576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635c6cfcbe146100735780636d9184e4146100bf578063cefaec961461025a578063d670992a146103c4578063f12d90f1146103e257610071565b005b61007b610574565b604051808274ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61014a600480360360408110156100d65760006000fd5b810190808035600019169060200190929190803590602001906401000000008111156101025760006000fd5b8201836020820111156101155760006000fd5b803590602001918460208302840111640100000000831117156101385760006000fd5b909192939090919293905050506105a4565b604051808674ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff16815260200185815260200180602001806020018460001916600019168152602001838103835286818151815260200191508051906020019080838360005b838110156101d75780820151818401525b6020810190506101bb565b50505050905090810190601f1680156102045780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019060200280838360005b838110156102415780820151818401525b602081019050610225565b5050505090500197505050505050505060405180910390f35b6102f8600480360360408110156102715760006000fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156102b05760006000fd5b8201836020820111156102c35760006000fd5b803590602001918460208302840111640100000000831117156102e65760006000fd5b90919293909091929390505050610619565b604051808060200184815260200180602001838103835286818151815260200191508051906020019080838360005b838110156103435780820151818401525b602081019050610327565b50505050905090810190601f1680156103705780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019060200280838360005b838110156103ad5780820151818401525b602081019050610391565b505050509050019550505050505060405180910390f35b6103cc610684565b6040518082815260200191505060405180910390f35b61048a600480360360608110156103f95760006000fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156104385760006000fd5b82018360208201111561044b5760006000fd5b8035906020019184602083028401116401000000008311171561046e5760006000fd5b9091929390909192939080359060200190929190505050610696565b60405180866000191660001916815260200185815260200180602001806020018460001916600019168152602001838103835286818151815260200191508051906020019080838360005b838110156104f15780820151818401525b6020810190506104d5565b50505050905090810190601f16801561051e5780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019060200280838360005b8381101561055b5780820151818401525b60208101905061053f565b5050505090500197505050505050505060405180910390f35b6000600060009054906101000a900474ffffffffffffffffffffffffffffffffffffffffff1690506105a1565b90565b600060006060606060006105ff88888880806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505061070c63ffffffff16565b9450945094509450945061060e565b939792965093509350565b60606000606061067086868680806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f820116905080830192505050505050506108f263ffffffff16565b92509250925061067b565b93509350939050565b60006001600050549050610693565b90565b600060006060606060006106f289898980806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505088610ac563ffffffff16565b94509450945094509450610701565b945094509450945094565b60006000606060606000600060026000506000896000191660001916815260200190815260200160002160005090506060875160405190808252806020026020018201604052801561076d5781602001602082028038833980820191505090505b5090506000600090505b88518110156107fa578260040160005060008a8381518110151561079757fe5b9060200190602002015169ffffffffffffffffffff1669ffffffffffffffffffff1681526020019081526020016000216000505482828151811015156107d957fe5b906020019060200201909081815260200150505b8080600101915050610777565b508160030160009054906101000a900474ffffffffffffffffffffffffffffffffffffffffff16826001016000505483600201600050838560050160005054828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108ce5780601f106108a3576101008083540402835291602001916108ce565b820191906000526020600021905b8154815290600101906020018083116108b157829003601f168201915b505050505092509650965096509650965050506108e85650505b9295509295909350565b6060600060606000600360005060008774ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000216000509050606085516040519080825280602002602001820160405280156109755781602001602082028038833980820191505090505b5090506000600090505b8651811015610a0257826003016000506000888381518110151561099f57fe5b9060200190602002015169ffffffffffffffffffff1669ffffffffffffffffffff1681526020019081526020016000216000505482828151811015156109e157fe5b906020019060200201909081815260200150505b808060010191505061097f565b5081600101600050826000016000505482828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610aa85780601f10610a7d57610100808354040283529160200191610aa8565b820191906000526020600021905b815481529060010190602001808311610a8b57829003601f168201915b505050505092509450945094505050610abe5650505b9250925092565b600060006060606060006000600360005060008a74ffffffffffffffffffffffffffffffffffffffffff1674ffffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002160005090506000600260005060008360020160005060008b81526020019081526020016000216000505460001916600019168152602001908152602001600021600050905060608951604051908082528060200260200182016040528015610b8c5781602001602082028038833980820191505090505b5090506000600090505b8a51811015610c19578260040160005060008c83815181101515610bb657fe5b9060200190602002015169ffffffffffffffffffff1669ffffffffffffffffffff168152602001908152602001600021600050548282815181101515610bf857fe5b906020019060200201909081815260200150505b8080600101915050610b96565b508160000160005054826001016000505483600201600050838560050160005054828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ccf5780601f10610ca457610100808354040283529160200191610ccf565b820191906000526020600021905b815481529060010190602001808311610cb257829003601f168201915b5050505050925097509750975097509750505050610ceb565050505b93979296509350935056fea165627a7a72305820bfade07ec445d08d7d1469431744e7889cc4600248ae74a85e41adc1cd21dcf30029',
  address: 'vite_0d2ace1459d19d7960cb5daedb1202677013a1c715b809ebd5',
};

// Setup ViteAPI client using websockets. We will use this to subscribe to events.
// const providerURL = 'wss://buidl.vite.net/gvite/ws'; // testnet node
const providerURL = 'wss://node.vite.net/ws';
// const providerTimeout = 60000;
// const providerOptions = { retryTimes: 10, retryInterval: 5000 };
// const WS_RPC = new provider(providerURL, providerTimeout, providerOptions);
// const viteClient = new ViteAPI(WS_RPC, () => {
//   //   console.log('client connected');
// });
const connection = new WS_RPC(providerURL);
const provider = new ViteAPI(connection, () => {
  // console.log('client connected');
});

type Block = {
  accountAddress: string;
  amount: string;
  blockType: number;
  data: string;
  fee: string;
  hash: string;
  height: string;
  prevHash: string;
  publicKey: string;
  signature: string;
  toAddress: string;
  tokenId: string;
};

function sendVcTx(vbInstance: typeof Connector, ...args: any) {
  // TODO: make this a modal that disappears on confirm
  setTimeout(() => window.alert('Confirm transaction on your device'), 100);
  return vbInstance
    .sendCustomRequest({ method: 'vite_signAndSendTx', params: args })
    .then((signedBlock: Block) => signedBlock);
}

export const callContract = async (
  vbInstance: typeof Connector,
  methodName: string,
  params: any[] = [],
  amount: string = '0',
  tokenId?: string
) => {
  let block = await accountBlock.createAccountBlock('callContract', {
    address: vbInstance.accounts[0],
    abi: CONTRACT.abi,
    toAddress: CONTRACT.address,
    params,
    methodName,
    amount: String(amount),
    tokenId,
  });
  let myblock = block.accountBlock;
  return await sendVcTx(vbInstance, { block: myblock, abi: CONTRACT.abi });
};

// async function subscribeToEvent(eventName: string, callback: (e: any) => void) {
//   const address = CONTRACT.address;
//   const topichash = abi.encodeLogSignature(CONTRACT.abi, eventName);
//   const filterParameters = {
//     addressHeightRange: { [address]: { fromHeight: '0', toHeight: '0' } },
//     topics: [[topichash]],
//   };
//   const subscription = await provider.subscribe('createVmlogSubscription', filterParameters);
//   subscription.callback = (res: any) => {
//     console.log('EVENT:', res);
//     const data = Buffer.from(res[0]['vmlog']['data'], 'base64').toString('hex');
//     const log = abi.decodeLog(CONTRACT.abi, data, topichash, eventName);
//     callback(log);
//   };
//   console.log('SUBSCRIBED:', eventName);
// }

/*
// Alternative approach to setting up subscriptions.
async function subscribeToEvent(eventName, callback){
    const address = CONTRACT.address;
    const filterParameters = {"addressHeightRange":{[address]:{"fromHeight":"0","toHeight":"0"}}}; 
    provider.subscribe("createVmlogSubscription", filterParameters).then( (event) => {
        event.on( (res) => {
            console.log("EVENT:",res);
            if (!Array.isArray(res)) return;
            const sig = abi.encodeLogSignature(CONTRACT.abi, eventName);
            if (sig === res[0]['vmlog']['topics'][0]) {
                const data = Buffer.from(res[0]['vmlog']['data'], 'base64').toString('hex');
                const log = abi.decodeLog(CONTRACT.abi, data, sig, eventName);
                callback(log);
            }
        })
    }).catch((err) => {
        console.log(err);
    });
    console.log("SUBSCRIBED", eventName);
}
*/

// from https://github.com/weserickson/vite-staking-pools/blob/master/test.js
export const callOffChain = (methodName: string, params: any[]) => {
  const ehex = abi.encodeFunctionCall(CONTRACT.abi, params, methodName);
  const ebase64 = Buffer.from(ehex, 'hex').toString('base64');
  const code = Buffer.from(CONTRACT.offChain, 'hex').toString('base64');

  return provider
    .request('contract_callOffChainMethod', {
      address: CONTRACT.address,
      code,
      data: ebase64,
    })
    .then((res: any) => {
      const hexbuf = Buffer.from(res, 'base64').toString('hex');
      const { outputs = [] } = CONTRACT.abi.find((x) => x.name === methodName) || {};
      return abi.decodeParameters(outputs, hexbuf);
    });
};
