// SPDX-License-Identifier: MIT
// Everyone can mint from this minter. Use ONLY on a TESTNET.
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Minter is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(string => bool) private takenNames;
    mapping(uint256 => Attr) public attributes;

    struct Attr {
        string name;
        string title;
        string imageUri;
        string[] traitsKeys;
        string[] traitsValues;
        uint8 quantity;
    }

    constructor() ERC721("MyToken", "MTK") {}

function join(string[] memory elements, string memory delimiter) internal pure returns (string memory) {
    if (elements.length == 0) {
        return "";
    }

    string memory joinedString = elements[0];
    for (uint256 i = 1; i < elements.length; i++) {
        joinedString = string(abi.encodePacked(joinedString, delimiter, elements[i]));
    }

    return joinedString;
}

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function safeMint(address to, string memory uri, string memory _name, string memory _title, string memory _imageUri,
        string[] memory _traitsKeys,
        string[] memory _traitsValues,
        uint8 _quantity
     ) public  {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        attributes[tokenId] = Attr(_name, _title, _imageUri, _traitsKeys, _traitsValues, _quantity);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    string[] memory traits = new string[](attributes[tokenId].traitsKeys.length);

    for (uint256 i = 0; i < attributes[tokenId].traitsKeys.length; i++) {
        traits[i] = string(abi.encodePacked(
            '{"trait_type": "', attributes[tokenId].traitsKeys[i], '", "value": "', attributes[tokenId].traitsValues[i], '"}'
        ));
    }

    string memory json = Base64.encode(bytes(string(
        abi.encodePacked(
            '{"name": "', attributes[tokenId].name, '", "title": "', attributes[tokenId].title, '", "image": "', attributes[tokenId].imageUri, '", "attributes": [',
            string(abi.encodePacked(join(traits, ","))),
            ']}'
        )
    )));

    return string(abi.encodePacked('data:application/json;base64,', json));
}




    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721URIStorage, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

library Base64 {
    string internal constant TABLE_ENCODE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    bytes  internal constant TABLE_DECODE = hex"0000000000000000000000000000000000000000000000000000000000000000"
    hex"00000000000000000000003e0000003f3435363738393a3b3c3d000000000000"
    hex"00000102030405060708090a0b0c0d0e0f101112131415161718190000000000"
    hex"001a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132330000000000";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return '';

        // load the table into memory
        string memory table = TABLE_ENCODE;

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((data.length + 2) / 3);

        // add some extra buffer at the end required for the writing
        string memory result = new string(encodedLen + 32);

        assembly {
        // set the actual output length
            mstore(result, encodedLen)

        // prepare the lookup table
            let tablePtr := add(table, 1)

        // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

        // result ptr, jump over length
            let resultPtr := add(result, 32)

        // run over the input, 3 bytes at a time
            for {} lt(dataPtr, endPtr) {}
            {
            // read 3 bytes
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)

            // write 4 characters
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr( 6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(        input,  0x3F))))
                resultPtr := add(resultPtr, 1)
            }

        // padding with '='
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }

        return result;
    }

    function decode(string memory _data) internal pure returns (bytes memory) {
        bytes memory data = bytes(_data);

        if (data.length == 0) return new bytes(0);
        require(data.length % 4 == 0, "invalid base64 decoder input");

        // load the table into memory
        bytes memory table = TABLE_DECODE;

        // every 4 characters represent 3 bytes
        uint256 decodedLen = (data.length / 4) * 3;

        // add some extra buffer at the end required for the writing
        bytes memory result = new bytes(decodedLen + 32);

        assembly {
        // padding with '='
            let lastBytes := mload(add(data, mload(data)))
            if eq(and(lastBytes, 0xFF), 0x3d) {
                decodedLen := sub(decodedLen, 1)
                if eq(and(lastBytes, 0xFFFF), 0x3d3d) {
                    decodedLen := sub(decodedLen, 1)
                }
            }

        // set the actual output length
            mstore(result, decodedLen)

        // prepare the lookup table
            let tablePtr := add(table, 1)

        // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

        // result ptr, jump over length
            let resultPtr := add(result, 32)

        // run over the input, 4 characters at a time
            for {} lt(dataPtr, endPtr) {}
            {
            // read 4 characters
                dataPtr := add(dataPtr, 4)
                let input := mload(dataPtr)

            // write 3 bytes
                let output := add(
                add(
                shl(18, and(mload(add(tablePtr, and(shr(24, input), 0xFF))), 0xFF)),
                shl(12, and(mload(add(tablePtr, and(shr(16, input), 0xFF))), 0xFF))),
                add(
                shl( 6, and(mload(add(tablePtr, and(shr( 8, input), 0xFF))), 0xFF)),
                and(mload(add(tablePtr, and(        input , 0xFF))), 0xFF)
                )
                )
                mstore(resultPtr, shl(232, output))
                resultPtr := add(resultPtr, 3)
            }
        }

        return result;
    }
}