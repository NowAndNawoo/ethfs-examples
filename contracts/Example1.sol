// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "solady/src/utils/Base64.sol";
import "solady/src/utils/SSTORE2.sol";

error DataIsFrozen();
error TokenAlreadyExists();
error TokenDoesNotExist();
error TooManyValues();
error DataIsEmpty();

contract Example1 is ERC721, Ownable {
    constructor() ERC721("Example1", "EXAMPLE1") {}

    string public constant DESCRIPTION = "description";

    function mint(uint256 tokenId) public onlyOwner {
        _mint(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        string memory json = "{name:'Example1'}";
        return string.concat("data:application/json;base64,", Base64.encode(bytes(json)));
    }
}
