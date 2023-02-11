// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "solady/src/utils/Base64.sol";
import "./EthFS/IFileStore.sol";

error TokenDoesNotExist();

struct TokenData {
    string name;
    string description;
    string filename;
}

contract Example2 is ERC721, Ownable {
    IFileStore public fileStore;
    mapping(uint256 => TokenData) private tokenData;

    constructor(IFileStore _fileStore) ERC721("Example1", "EFSE1") {
        fileStore = _fileStore;
    }

    function setFileStore(IFileStore _fileStore) external onlyOwner {
        fileStore = _fileStore;
    }

    function mint(
        uint256 tokenId,
        string memory name,
        string memory description,
        string memory filename
    ) public onlyOwner {
        tokenData[tokenId].name = name;
        tokenData[tokenId].description = description;
        tokenData[tokenId].filename = filename;
        _mint(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        TokenData storage token = tokenData[tokenId];
        string memory json = string.concat(
            '{"name":"',
            token.name,
            '","description":"',
            token.description,
            '","image":"data:image/jpeg;base64,',
            Base64.encode(bytes(fileStore.getFile(token.filename).read())),
            '"}'
        );
        return string.concat("data:application/json;base64,", Base64.encode(bytes(json)));
    }
}
